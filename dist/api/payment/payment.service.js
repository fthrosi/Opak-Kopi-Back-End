var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { snap, coreApi } from "../../config/midtrans.config.js";
import prisma from "../../config/db.js";
import { NotificationService } from "../../socket/notification.service.js";
import crypto from "crypto";
import dayjs from "dayjs";
export class PaymentService {
    createPayment(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const transaction = yield snap.createTransaction(parameter);
                return {
                    token: transaction.token,
                    redirect_url: transaction.redirect_url,
                    order_id: orderId,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifySignature(notification) {
        var _a, _b;
        const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
        const orderId = (_a = notification.order_id) === null || _a === void 0 ? void 0 : _a.toString().trim();
        const statusCode = (_b = notification.status_code) === null || _b === void 0 ? void 0 : _b.toString().trim();
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
    checkTransactionStatus(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Checking transaction status for:", order_id);
                const status = yield coreApi.transaction.status(order_id);
                return status;
            }
            catch (error) {
                console.error("Error checking transaction status:", error);
                throw new Error(error.message || "Error checking transaction status");
            }
        });
    }
    handleCallback(notification) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // STEP 1: Verifikasi signature (WAJIB untuk security!)
                if (!this.verifySignature(notification)) {
                    throw new Error("Invalid signature key");
                }
                const { order_id, transaction_status, payment_type } = notification;
                console.log("Processing callback for order:", order_id, "status:", transaction_status);
                // STEP 2: Tentukan status order berdasarkan transaction_status
                let paymentStatus = "";
                if (transaction_status === "settlement") {
                    // Untuk non-credit card (VA, QRIS, dll) - payment sukses
                    paymentStatus = "Dikirim";
                }
                else if (transaction_status === "deny") {
                    paymentStatus = "Gagal";
                }
                else if (transaction_status === "cancel" ||
                    transaction_status === "expire") {
                    paymentStatus = "Gagal";
                }
                else if (transaction_status === "pending") {
                    paymentStatus = "Menunggu Pembayaran";
                }
                const existingOrder = yield prisma.order.findUnique({
                    where: { order_code: order_id }
                });
                // STEP 3: Update order di database
                const order = yield prisma.order.update({
                    where: { id: existingOrder === null || existingOrder === void 0 ? void 0 : existingOrder.id },
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
                    order_id: order.order_code || order_id,
                    status: paymentStatus,
                    payment_type,
                };
            }
            catch (error) {
                console.error("Error handling callback:", error);
                throw error;
            }
        });
    }
}
