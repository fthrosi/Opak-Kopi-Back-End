import { Router } from "express";
import { PaymentController } from "./payment.controller.js";
import { validateToken } from "../../middleware/auth.js";
const paymentRouter = Router();
const paymentController = new PaymentController();
paymentRouter.post("/", validateToken, (req, res) => paymentController.createPayment(req, res));
paymentRouter.post("/callback", (req, res) => paymentController.handleCallback(req, res));
paymentRouter.get("/status/:orderId", validateToken, (req, res) => paymentController.checkStatus(req, res));
export default paymentRouter;
