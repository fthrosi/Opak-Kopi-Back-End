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
export class FeedbackRepository {
    createFeedback(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.kritikSaran.create({
                data,
            });
        });
    }
    getFeedbackByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.kritikSaran.findMany({
                where: { user_id: userId },
                select: {
                    id: true,
                    topic: true,
                    message: true,
                    status: true,
                    created_at: true,
                },
            });
        });
    }
    getFeedbackById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.kritikSaran.findUnique({
                where: { id },
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    topic: true,
                    message: true,
                    status: true,
                    created_at: true,
                },
            });
        });
    }
    getAllFeedbacks() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.kritikSaran.findMany({
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },
                    topic: true,
                    message: true,
                    status: true,
                    created_at: true,
                },
            });
        });
    }
    updateFeedback(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.kritikSaran.update({
                where: { id },
                data,
            });
        });
    }
    deleteFeedback(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.kritikSaran.delete({
                where: { id },
            });
        });
    }
}
