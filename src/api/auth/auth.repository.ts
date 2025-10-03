import { connect } from "http2";
import prisma from "../../config/db.js";
import { Prisma } from "@prisma/client";

export class AuthRepository {
  async findByEmail(email: string) {
    return await prisma.user.findFirst({
      where: { email },
      include: {
        role: true,
      },
    });
  }
  async createUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    });
  }
  async createRefreshToken(
    userId: number,
    token: string,
    expiryDate: Date,
    agent: string,
    ip: string
  ) {
    return await prisma.refreshToken.create({
      data: {
        user: {
          connect: { id: userId },
        },
        token: token,
        expires_at: expiryDate,
        user_agent: agent,
        ip_address: ip,
      },
    });
  }
  async findRefreshToken(token: string, ip: string, agent: string) {
    return await prisma.refreshToken.findFirst({
      where: {
        token,
        ip_address: ip,
        user_agent: agent,
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }
  async deleteRefreshToken(id: number) {
    return await prisma.refreshToken.deleteMany({
      where: {
        id,
      },
    });
  }
  async findByVerificationToken(token: string) {
    return await prisma.user.findFirst({
      where: {
        verification_token: token,
      },
    });
  }
  async activateUser(id: number) {
    return await prisma.user.update({
      where: { id },
      data: {
        email_verified_at: new Date(),
        verification_token: null,
      },
    });
  }
  async saveResetToken(id: number, otp: string, expiry: Date) {
    return await prisma.user.update({
      where: { id },
      data: {
        verification_token: otp,
        expires_at: expiry,
      },
    });
  }
  async verifyResetToken(email: string, token: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        verification_token: token,
        expires_at: {
          gt: new Date(),
        },
      },
    });
    return user;
  }
  async resetPassword(userId: number, newPassword: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword,
        verification_token: null,
        expires_at: null,
      },
    });
  }
  async findByResetToken(token: string) {
    return await prisma.user.findFirst({
      where: {
        verification_token: token,
        expires_at: {
          gt: new Date(),
        },
      },
    });
  }

  async updateResetToken(userId: number, token: string, expiry: Date) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        verification_token: token,
        expires_at: expiry,
      },
    });
  }
}
