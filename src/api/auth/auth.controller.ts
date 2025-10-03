import { AuthService } from "./auth.service.js";
import e, { Request, Response } from "express";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response) {
    try {
      const token = await this.authService.login(req);
      const { accessToken, refreshToken, payload } = token;
      // Set the access token in a cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        maxAge: 5 * 60 * 1000, // 5 minutes
      });
      // Set the refresh token in a cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      res.status(200).json({
        message: "Login successful",
        user: payload,
      });
    } catch (error: string | any) {
      const { status, message } = error;
      res.status(status || 400).json({ error: message || "An error occurred" });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({
        message: "Registration successful",
      });
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const ip = req.ip || "unknown";
    const agent = req.headers["user-agent"] || "unknown";
    try {
      await this.authService.logout(refreshToken, ip, agent);
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(204).send();
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
      }
      const ip = req.ip || "unknown";
      const agent = req.headers["user-agent"] || "unknown";
      const newTokens = await this.authService.refreshToken(
        refreshToken,
        ip,
        agent
      );
      res.cookie("accessToken", newTokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 5 * 60 * 1000, // 5 minutes
      });
      res.status(200).json({
        message: "Token refreshed successfully",
        user: newTokens.payload,
      });
    } catch (error: string | any) {
      res.status(401).json({ error: error.message });
    }
  }
  async verifyEmail(req: Request, res: Response) {
    try {
      const token = req.query.token as string;
      const user = await this.authService.verifyEmail(token);
      res.status(200).json({
        message: "Email verified successfully",
        user,
      });
    } catch (error: string | any) {
      res.status(400).json({ error: error.message });
    }
  }
  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email diperlukan" });
      }

      const result = await this.authService.requestPasswordReset(email);
      res.status(200).json(result);
    } catch (error: any) {
      console.error(error );
      res.status(400).json({ error : error.message }); // BENAR: Mengirim string pesan error
    }
  }
  async verifyOTP(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ error: "Email dan OTP diperlukan" });
      }

      const result = await this.authService.verifyOTP(email, otp);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error});
    }
  }
  async resetPassword(req: Request, res: Response) {
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

      const result = await this.authService.resetPassword(
        resetToken,
        newPassword
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ error });
    }
  }
}
