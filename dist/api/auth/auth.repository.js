var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../../config/db.js";
export class AuthRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findFirst({
                where: { email },
                include: {
                    role: true,
                },
            });
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.create({
                data,
            });
        });
    }
    createRefreshToken(userId, token, expiryDate, agent, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.refreshToken.create({
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
        });
    }
    findRefreshToken(token, ip, agent) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.refreshToken.findFirst({
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
        });
    }
    deleteRefreshToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.refreshToken.deleteMany({
                where: {
                    id,
                },
            });
        });
    }
    findByVerificationToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findFirst({
                where: {
                    verification_token: token,
                },
            });
        });
    }
    activateUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.update({
                where: { id },
                data: {
                    email_verified_at: new Date(),
                    verification_token: null,
                },
            });
        });
    }
    saveResetToken(id, otp, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.update({
                where: { id },
                data: {
                    verification_token: otp,
                    expires_at: expiry,
                },
            });
        });
    }
    verifyResetToken(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.user.findFirst({
                where: {
                    email,
                    verification_token: token,
                    expires_at: {
                        gt: new Date(),
                    },
                },
            });
            return user;
        });
    }
    resetPassword(userId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.update({
                where: { id: userId },
                data: {
                    password: newPassword,
                    verification_token: null,
                    expires_at: null,
                },
            });
        });
    }
    findByResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findFirst({
                where: {
                    verification_token: token,
                    expires_at: {
                        gt: new Date(),
                    },
                },
            });
        });
    }
    updateResetToken(userId, token, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.update({
                where: { id: userId },
                data: {
                    verification_token: token,
                    expires_at: expiry,
                },
            });
        });
    }
}
