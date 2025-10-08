var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AuthService } from "./auth.service.js";
export class AuthController {
    constructor() {
        this.authService = new AuthService();
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.authService.login(req);
                const { accessToken, refreshToken, payload } = token;
                // Set the access token in a cookie
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: true, // Use secure cookies in production
                    maxAge: 5 * 60 * 1000, // 5 minutes
                    path: "/",
                    sameSite: "none",
                });
                // Set the refresh token in a cookie
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true, // Use secure cookies in production
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                    path: "/",
                    sameSite: "none",
                });
                res.status(200).json({
                    message: "Login successful",
                    user: payload,
                });
            }
            catch (error) {
                const { status, message } = error;
                res.status(status || 400).json({ error: message || "An error occurred" });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authService.register(req.body);
                res.status(201).json({
                    message: "Registration successful",
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const ip = req.ip || "unknown";
            const agent = req.headers["user-agent"] || "unknown";
            try {
                yield this.authService.logout(refreshToken, ip, agent);
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    return res.status(401).json({ error: "No refresh token provided" });
                }
                const ip = req.ip || "unknown";
                const agent = req.headers["user-agent"] || "unknown";
                const newTokens = yield this.authService.refreshToken(refreshToken, ip, agent);
                res.cookie("accessToken", newTokens.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 5 * 60 * 1000, // 5 minutes
                });
                res.status(200).json({
                    message: "Token refreshed successfully",
                    user: newTokens.payload,
                });
            }
            catch (error) {
                res.status(401).json({ error: error.message });
            }
        });
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.query.token;
                const user = yield this.authService.verifyEmail(token);
                res.status(200).json({
                    message: "Email verified successfully",
                    user,
                });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    requestPasswordReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    return res.status(400).json({ error: "Email diperlukan" });
                }
                const result = yield this.authService.requestPasswordReset(email);
                res.status(200).json(result);
            }
            catch (error) {
                console.error(error);
                res.status(400).json({ error: error.message }); // BENAR: Mengirim string pesan error
            }
        });
    }
    verifyOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                if (!email || !otp) {
                    return res.status(400).json({ error: "Email dan OTP diperlukan" });
                }
                const result = yield this.authService.verifyOTP(email, otp);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({ error });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { resetToken, newPassword } = req.body;
                if (!resetToken || !newPassword) {
                    return res.status(400).json({
                        error: "Token reset dan password baru diperlukan",
                    });
                }
                if (newPassword.length < 6) {
                    return res.status(400).json({
                        error: "Password harus minimal 6 karakter",
                    });
                }
                const result = yield this.authService.resetPassword(resetToken, newPassword);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(400).json({ error });
            }
        });
    }
}
