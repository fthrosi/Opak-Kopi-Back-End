import { FeedbackService } from "./feedback.service.js";
import { Request, Response } from "express";
import { CustomRequest } from "../../middleware/auth.js";
import { parse } from "path";

export class FeedbackController {
    private feedbackService: FeedbackService;

    constructor() {
        this.feedbackService = new FeedbackService();
    }

    async createFeedback(req: CustomRequest, res: Response) {
        try {
            const userId = req.user?.userId; 
            const data = req.body;
            const status = "Dikirim"
            const feedbackData = {
                ...data,
                user_id: userId,
                status: status
            };
            const feedback = await this.feedbackService.createFeedback(feedbackData);
            res.status(201).json({
                message: "Feedback created successfully",
                feedback: feedback,
            });
        } catch (error: string | any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllFeedbacks(req: Request, res: Response) {
        try {
            const feedbacks = await this.feedbackService.getAllFeedbacks();
            res.status(200).json({
                message: "All feedbacks retrieved successfully",
                feedbacks: feedbacks,
            });
        } catch (error: string | any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getFeedbackByUser(req: CustomRequest, res: Response) {
        try {
            const userId = Number(req.user?.userId);
            const feedbacks = await this.feedbackService.getFeedbackByUser(userId);
            res.status(200).json({
                message: "Feedbacks retrieved successfully",
                feedbacks: feedbacks,
            });
        } catch (error: string | any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateFeedback(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;
            const updatedFeedback = await this.feedbackService.updateFeedback(id, data);
            if (!updatedFeedback) {
                return res.status(404).json({ message: "Feedback not found" });
            }
            res.status(200).json({
                message: "Feedback updated successfully",
                feedback: updatedFeedback,
            });
        } catch (error: string | any) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteFeedback(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.feedbackService.deleteFeedback(id);
            res.status(204).send();
        } catch (error: string | any) {
            res.status(500).json({ error: error.message });
        }
    }
}