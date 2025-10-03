import { Prisma } from "@prisma/client";
import { AuthRepository } from "./auth.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Request } from "express";
import transporter from "../../config/mailer.js"; // Assuming you have a mailer config file

export class AuthService {
  private authRepository: AuthRepository;
  constructor() {
    this.authRepository = new AuthRepository();
  }
  async login(req: Request) {
    const { email, password } = req.body;
    const user = await this.authRepository.findByEmail(email);
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
    // Generate JWT token
    const secretKey = process.env.JWT_SECRET as string;
    const accessToken = jwt.sign(payload, secretKey, { expiresIn: "5m" });
    // Generate refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // Set expiry to 30 days

    const agent = req.headers["user-agent"] || "unknown";
    const ip = req.ip || "unknown";
    const userId = user.id;
    await this.authRepository.createRefreshToken(
      userId,
      refreshToken,
      expiryDate,
      agent,
      ip
    );
    return {
      accessToken,
      refreshToken,
      payload,
    };
  }
  async register(data: Prisma.UserCreateInput) {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const role_id = 3;
    const newUserData = {
      ...data,
      password: hashedPassword,
      verification_token: verificationToken,
      role_id: role_id,
      status: "Aktif",
    };
    const user = await this.authRepository.createUser(newUserData);
    const verificationLink = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
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
  }
  async logout(token: string, ip: string, agent: string) {
    const findRefreshToken = await this.authRepository.findRefreshToken(
      token,
      ip,
      agent
    );
    if (!findRefreshToken) {
      throw new Error("Refresh token not found");
    }
    const id = findRefreshToken.id;
    const logout = await this.authRepository.deleteRefreshToken(id);
    // This is a placeholder as the actual implementation may vary
    return logout;
  }
  async refreshToken(token: string, ip: string, agent: string) {
    const refreshToken = await this.authRepository.findRefreshToken(
      token,
      ip,
      agent
    );
    if (!refreshToken) {
      throw new Error("Invalid refresh token");
    }
    if (refreshToken.user.status !== "Aktif") {
      throw new Error("Akun tidak aktif. Silakan hubungi admin.");
    }
    if (refreshToken.ip_address !== ip || refreshToken.user_agent !== agent) {
      throw new Error("IP or User Agent does not match");
    }
    const secretKey = process.env.JWT_SECRET as string;
    const payload = {
      userId: refreshToken.user.id,
      email: refreshToken.user.email,
      name: refreshToken.user.name,
      phone: refreshToken.user.phone,
      img: refreshToken.user.img_url,
      poin: refreshToken.user.poin,
      role: refreshToken.user.role,
    };
    const accessToken = jwt.sign(payload, secretKey, { expiresIn: "5m" });
    return {
      accessToken,
      payload,
    };
  }
  async verifyEmail(token: string) {
    const user = await this.authRepository.findByVerificationToken(token);
    if (!user) {
      throw new Error("Invalid verification token");
    }
    if (user.email_verified_at) {
      throw new Error("Email already verified");
    }
    const updatedUser = await this.authRepository.activateUser(user.id);
    return updatedUser;
  }
  async requestPasswordReset(email: string) {
    // Cek apakah email terdaftar
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new Error("Email tidak terdaftar");
    }

    // Generate OTP 6 digit
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry time (15 menit)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 15);

    const id = Number(user.id);
    // Simpan OTP ke database
    await this.authRepository.saveResetToken(id, otp, expiryTime);

    // Kirim email
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

    await transporter.sendMail(mailOptions);

    return { message: "Kode OTP telah dikirim ke email Anda" };
  }
  async verifyOTP(email: string, otp: string) {
    // Verifikasi OTP saja tanpa reset password
    const user = await this.authRepository.verifyResetToken(email, otp);
    if (!user) {
      throw new Error("OTP tidak valid atau sudah expired");
    }

    // Generate token sementara untuk halaman reset password
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Simpan token sementara dengan expiry baru (10 menit)
    const newExpiryTime = new Date();
    newExpiryTime.setMinutes(newExpiryTime.getMinutes() + 10);

    await this.authRepository.updateResetToken(
      user.id,
      resetToken,
      newExpiryTime
    );

    return {
      message: "OTP valid, silakan reset password",
      resetToken,
    };
  }
  async resetPassword(resetToken: string, newPassword: string) {
  // Cari user dengan reset token
  const user = await this.authRepository.findByResetToken(resetToken);
  if (!user) {
    throw new Error("Token reset tidak valid atau sudah expired");
  }
  
  // Hash password baru
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // Update password dan hapus token
  await this.authRepository.resetPassword(user.id, hashedPassword);
  
  return { message: "Password berhasil diubah" };
}
}
