import prisma from "../../config/db.js";
import { Prisma } from "@prisma/client";

export class FeedbackRepository {
    async createFeedback(data: Prisma.KritikSaranCreateInput) {
        return await prisma.kritikSaran.create({
            data,
        });
    }
    async getFeedbackByUser(userId:number){
        return await prisma.kritikSaran.findMany({
            where: { user_id: userId },
            select: {
                id: true,
                topic: true,
                message: true,
                status: true,
                created_at: true,
            },
        });
    }
    async getFeedbackById(id: number) {
        return await prisma.kritikSaran.findUnique({
            where: { id },
            select: {
                id: true,
                user : {
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
    }
    async getAllFeedbacks() {
        return await prisma.kritikSaran.findMany({
            select: {
                id: true,
                user : {
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
    }

    async updateFeedback(id: number, data: Prisma.KritikSaranUpdateInput) {
        return await prisma.kritikSaran.update({
            where: { id },
            data,
        });
    }

    async deleteFeedback(id: number) {
        return await prisma.kritikSaran.delete({
            where: { id },
        });
    }
}