import { snap, coreApi } from "../../config/midtrans.config.js";
import type {
  CreatePaymentRequest,
  CreatePaymentResponse,
  MidtransNotification,
  PaymentCallbackResponse,
} from "../../types/payment.types.js";
import prisma from "../../config/db.js";
import { NotificationService } from "../../socket/notification.service.js";
import crypto from "crypto";
import dayjs from "dayjs";

export class PaymentService {
  async createPayment(paymentData: CreatePaymentRequest) {
    const stratTime = dayjs().format("YYYY-MM-DD HH:mm:ss Z");
    try {
      const { orderId, amount, customerDetails, items } = paymentData;

      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: amount,
        },
        customer_details: customerDetails,
        item_details: items,
        expiry: {
          start_time: stratTime,
          unit: "minutes",
          duration: 10, // 10 menit
        },
      };
      const transaction = await snap.createTransaction(parameter);

      return {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
        order_id: orderId,
      };
    } catch (error) {
      throw error;
    }
  }
  verifySignature(notification: any): boolean {
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

    const orderId = notification.order_id?.toString().trim();
    const statusCode = notification.status_code?.toString().trim();
    const grossAmount = Number(notification.gross_amount).toFixed(2);

    const signatureKey = crypto
      .createHash("sha512")
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest("hex");

    const isValid = signatureKey === notification.signature_key;

    if (!isValid) {
      console.warn("❌ Signature mismatch");
      console.log("Expected :", signatureKey);
      console.log("Received :", notification.signature_key);
      console.log({
        orderId,
        statusCode,
        grossAmount,
        serverKey: serverKey.slice(0, 10) + "...",
      });
    }

    return isValid;
  }

  async checkTransactionStatus(order_id: string) {
    try {
      console.log("Checking transaction status for:", order_id);
      const status = await (coreApi as any).transaction.status(order_id);
      return status;
    } catch (error: any) {
      console.error("Error checking transaction status:", error);
      throw new Error(error.message || "Error checking transaction status");
    }
  }
  async handleCallback(
    notification: MidtransNotification
  ): Promise<PaymentCallbackResponse> {
    try {
      // STEP 1: Verifikasi signature (WAJIB untuk security!)
      if (!this.verifySignature(notification)) {
        throw new Error("Invalid signature key");
      }

      const { order_id, transaction_status, payment_type } = notification;

      console.log(
        "Processing callback for order:",
        order_id,
        "status:",
        transaction_status
      );

      // STEP 2: Tentukan status order berdasarkan transaction_status
      let paymentStatus = "";

      if (transaction_status === "settlement") {
        // Untuk non-credit card (VA, QRIS, dll) - payment sukses
        paymentStatus = "Dikirim";
      } else if (transaction_status === "deny") {
        paymentStatus = "Gagal";
      } else if (
        transaction_status === "cancel" ||
        transaction_status === "expire"
      ) {
        paymentStatus = "Gagal";
      } else if (transaction_status === "pending") {
        paymentStatus = "Menunggu Pembayaran";
      }

      const existingOrder = await prisma.order.findUnique({
        where: { order_code: order_id }
      })

      // STEP 3: Update order di database
      const order = await prisma.order.update({
        where: { id: existingOrder?.id },
        data: {
          status: paymentStatus,
          payment_method: payment_type,
          updated_at: new Date(),
        },
      });

      // STEP 4: Kirim notifikasi jika pembayaran berhasil
      if (order.status === "Dikirim") {
        NotificationService.sendNewOrderNotification(order);
      }

      console.log(`Payment processed: ${order_id} - ${paymentStatus}`);

      return {
        order_id: (order.order_code as string) || order_id,
        status: paymentStatus,
        payment_type,
      };
    } catch (error: any) {
      console.error("Error handling callback:", error);
      throw error;
    }
  }
}
