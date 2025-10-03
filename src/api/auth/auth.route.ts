import { AuthController } from "./auth.controller.js";
import { Router } from "express";
import { validateLoginBody, validateRegisterBody } from "../../middleware/auth.js";

const authController = new AuthController();
const authRouter = Router();
authRouter.post("/login", validateLoginBody, (req, res) => authController.login(req, res));
authRouter.post("/register", validateRegisterBody, (req, res) => authController.register(req, res));
authRouter.post("/logout", (req, res) => authController.logout(req, res));
authRouter.post("/refresh-token", (req, res) => authController.refreshToken(req, res));
authRouter.get('/verify-email', (req, res) => authController.verifyEmail(req, res));
authRouter.post('/request-password-reset', (req, res) => authController.requestPasswordReset(req, res));
authRouter.post('/verify-otp', (req, res) => authController.verifyOTP(req, res));
authRouter.post('/reset-password', (req, res) => authController.resetPassword(req, res));

export default authRouter;
