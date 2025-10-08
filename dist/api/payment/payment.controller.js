var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PaymentService } from "./payment.service.js";
export class PaymentController {
    constructor() {
        this.paymentService = new PaymentService();
    }
    createPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentData = req.body;
                // Validasi input wajib
                if (!paymentData.orderId) {
                    res.status(400).json({
                        status: "error",
                        message: "orderId is required",
                    });
                    return;
                }
                if (!paymentData.amount || paymentData.amount <= 0) {
                    res.status(400).json({
                        status: "error",
                        message: "amount must be greater than 0",
                    });
                    return;
                }
                if (!paymentData.customerDetails) {
                    res.status(400).json({
                        status: "error",
                        message: "customerDetails is required",
                    });
                    return;
                }
                if (!paymentData.items || paymentData.items.length === 0) {
                    res.status(400).json({
                        status: "error",
                        message: "items cannot be empty",
                    });
                    return;
                }
                // Validasi total amount sesuai dengan items
                const totalAmount = paymentData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                if (totalAmount !== paymentData.amount) {
                    res.status(400).json({
                        status: "error",
                        message: `Amount mismatch. Expected: ${totalAmount}, Got: ${paymentData.amount}`,
                    });
                    return;
                }
                // Panggil service untuk buat payment
                const result = yield this.paymentService.createPayment(paymentData);
                res.status(200).json({
                    status: "success",
                    message: "Payment created successfully",
                    data: result,
                });
            }
            catch (error) {
                console.error("Create payment error:", error);
                res.status(500).json({
                    status: "error",
                    message: error.message || "Error creating payment",
                });
            }
        });
    }
    handleCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = req.body;
                console.log("=== Midtrans Callback Received ===");
                console.log("Order ID:", notification.order_id);
                console.log("Status:", notification.transaction_status);
                console.log("Payment Type:", notification.payment_type);
                console.log("==================================");
                // Validasi notification dari Midtrans
                if (!notification.order_id || !notification.transaction_status) {
                    res.status(400).json({
                        status: "error",
                        message: "Invalid notification data",
                    });
                    return;
                }
                // Process callback
                const result = yield this.paymentService.handleCallback(notification);
                // PENTING: Midtrans expect 200 OK response
                res.status(200).json({
                    status: "success",
                    message: "Notification processed successfully",
                    data: result,
                });
            }
            catch (error) {
                console.error("Callback error:", error);
                // PENTING: Tetap return 200 OK
                // Jika return error, Midtrans akan retry berkali-kali
                // Log error untuk investigation nanti
                res.status(200).json({
                    status: "error",
                    message: error.message || "Error processing payment callback",
                });
            }
        });
    }
    checkStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.params;
                if (!orderId) {
                    res.status(400).json({
                        status: "error",
                        message: "orderId parameter is required"
                    });
                    return;
                }
                console.log('Checking status for order:', orderId);
                const status = yield this.paymentService.checkTransactionStatus(orderId);
                res.status(200).json({
                    status: "success",
                    data: status
                });
            }
            catch (error) {
                console.error('Check status error:', error);
                // Handle specific Midtrans errors
                if (error.message.includes('404')) {
                    res.status(404).json({
                        status: "error",
                        message: "Transaction not found",
                    });
                    return;
                }
                res.status(500).json({
                    status: "error",
                    message: error.message || "Error checking transaction status",
                });
            }
        });
    }
}
