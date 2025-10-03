import { FeedbackRepository } from "./feedback.repository.js";
import { Prisma } from "@prisma/client";


export class FeedbackService {
    private feedbackRepository: FeedbackRepository;
    constructor() {
        this.feedbackRepository = new FeedbackRepository();
    }

    async createFeedback(data: Prisma.KritikSaranCreateInput) {
        try {
            return await this.feedbackRepository.createFeedback(data);
        } catch (error: string | any) {
            throw new Error(error);
        }
        
    }

    async getFeedbackById(id: number) {
        try {
            return await this.feedbackRepository.getFeedbackById(id);
        } catch (error: string | any) {
            throw new Error(error);
        }
    }

    async getFeedbackByUser(userId: number) {
        try {
            return await this.feedbackRepository.getFeedbackByUser(userId);
        } catch (error: string | any) {
            throw new Error(error);
        }
    }

    async getAllFeedbacks() {
        try {
            return await this.feedbackRepository.getAllFeedbacks();
        } catch (error: string | any) {
            throw new Error(error);
        }
    }

    async updateFeedback(id: number, data: Prisma.KritikSaranUpdateInput) {
        try {
            const currentFeedback = await this.feedbackRepository.getFeedbackById(id);
            if (!currentFeedback) {
                throw new Error("Feedback not found");
            }
            return await this.feedbackRepository.updateFeedback(id, data);
        } catch (error: string | any) {
            throw new Error(error);
        }
    }

    async deleteFeedback(id: number) {
        try {
            const currentFeedback = await this.feedbackRepository.getFeedbackById(id);
            if (!currentFeedback) {
                throw new Error("Feedback not found");
            }
            return await this.feedbackRepository.deleteFeedback(id);
        } catch (error: string | any) {
            throw new Error(error);
        }
    }
}