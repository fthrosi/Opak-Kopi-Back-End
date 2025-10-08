var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AuthRepository } from "./auth.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../../config/mailer.js"; // Assuming you have a mailer config file
export class AuthService {
    constructor() {
        this.authRepository = new AuthRepository();
    }
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield this.authRepository.findByEmail(email);
            if (!user) {
                throw { status: 404, message: "Email not found" };
            }
            if (user.status !== "Aktif") {
                throw {
                    status: 403,
                    message: "Akun tidak aktif. Silakan hubungi admin.",
                };
            }
            if (!bcrypt.compareSync(password, user.password)) {
                throw { status: 400, message: "Password Salah" };
            }
            const payload = {
                userId: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                img: `${process.env.BASE_URL}/${user.img_url}`,
                poin: user.poin,
                role: user.role,
            };
            const secretKey = process.env.JWT_SECRET;
            const accessToken = jwt.sign(payload, secretKey, { expiresIn: "5m" });
            const refreshToken = crypto.randomBytes(64).toString("hex");
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);
            const agent = req.headers["user-agent"] || "unknown";
            const ip = req.ip || "unknown";
            const userId = user.id;
            yield this.authRepository.createRefreshToken(userId, refreshToken, expiryDate, agent, ip);
            return {
                accessToken,
                refreshToken,
                payload,
            };
        });
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.authRepository.findByEmail(data.email);
            if (existingUser) {
                throw new Error("Email already exists");
            }
            const hashedPassword = yield bcrypt.hash(data.password, 10);
            const verificationToken = crypto.randomBytes(32).toString("hex");
            const role_id = 3;
            const newUserData = Object.assign(Object.assign({}, data), { password: hashedPassword, verification_token: verificationToken, role_id: role_id, status: "Aktif" });
            const user = yield this.authRepository.createUser(newUserData);
            const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
            yield transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: data.email,
                subject: "Aktifkan Akun Opak Kopi Anda",
                html: `
        <h2>Selamat Datang!</h2>
        <p>Satu langkah lagi untuk menyelesaikan pendaftaran Anda. Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda:</p>
        <a href="${verificationLink}" style="background-color: #AF8F6F; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-size: 16px;">
          Verifikasi Email
        </a>
        <p>Link ini akan aktif selama 24 jam.</p>
      `,
            });
            return user;
        });
    }
    logout(token, ip, agent) {
        return __awaiter(this, void 0, void 0, function* () {
            const findRefreshToken = yield this.authRepository.findRefreshToken(token, ip, agent);
            if (!findRefreshToken) {
                throw new Error("Refresh token not found");
            }
            const id = findRefreshToken.id;
            const logout = yield this.authRepository.deleteRefreshToken(id);
            // This is a placeholder as the actual implementation may vary
            return logout;
        });
    }
    refreshToken(token, ip, agent) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = yield this.authRepository.findRefreshToken(token, ip, agent);
            if (!refreshToken) {
                throw new Error("Invalid refresh token");
            }
            if (refreshToken.user.status !== "Aktif") {
                throw new Error("Akun tidak aktif. Silakan hubungi admin.");
            }
            if (refreshToken.ip_address !== ip || refreshToken.user_agent !== agent) {
                throw new Error("IP or User Agent does not match");
            }
            const secretKey = process.env.JWT_SECRET;
            const payload = {
                userId: refreshToken.user.id,
                email: refreshToken.user.email,
                name: refreshToken.user.name,
                phone: refreshToken.user.phone,
                img: `${process.env.BASE_URL}/${refreshToken.user.img_url}`,
                poin: refreshToken.user.poin,
                role: refreshToken.user.role,
            };
            const accessToken = jwt.sign(payload, secretKey, { expiresIn: "5m" });
            return {
                accessToken,
                payload,
            };
        });
    }
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authRepository.findByVerificationToken(token);
            if (!user) {
                throw new Error("Invalid verification token");
            }
            if (user.email_verified_at) {
                throw new Error("Email already verified");
            }
            const updatedUser = yield this.authRepository.activateUser(user.id);
            return updatedUser;
        });
    }
    requestPasswordReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authRepository.findByEmail(email);
            if (!user) {
                throw new Error("Email tidak terdaftar");
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiryTime = new Date();
            expiryTime.setMinutes(expiryTime.getMinutes() + 15);
            const id = Number(user.id);
            yield this.authRepository.saveResetToken(id, otp, expiryTime);
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Reset Password Opak Kopi",
                html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #AF8F6F;">Reset Password Opak Kopi</h2>
        <p>Kami menerima permintaan untuk reset password akun Anda.</p>
        <p>Gunakan kode OTP berikut untuk reset password:</p>
        <h1 style="color: #AF8F6F; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>Kode OTP berlaku selama 15 menit.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      </div>
    `,
            };
            yield transporter.sendMail(mailOptions);
            return { message: "Kode OTP telah dikirim ke email Anda" };
        });
    }
    verifyOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authRepository.verifyResetToken(email, otp);
            if (!user) {
                throw new Error("OTP tidak valid atau sudah expired");
            }
            const resetToken = crypto.randomBytes(32).toString("hex");
            const newExpiryTime = new Date();
            newExpiryTime.setMinutes(newExpiryTime.getMinutes() + 10);
            yield this.authRepository.updateResetToken(user.id, resetToken, newExpiryTime);
            return {
                message: "OTP valid, silakan reset password",
                resetToken,
            };
        });
    }
    resetPassword(resetToken, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authRepository.findByResetToken(resetToken);
            if (!user) {
                throw new Error("Token reset tidak valid atau sudah expired");
            }
            const hashedPassword = yield bcrypt.hash(newPassword, 10);
            yield this.authRepository.resetPassword(user.id, hashedPassword);
            return { message: "Password berhasil diubah" };
        });
    }
}
