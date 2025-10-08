var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FeedbackService } from "./feedback.service.js";
export class FeedbackController {
    constructor() {
        this.feedbackService = new FeedbackService();
    }
    createFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                const data = req.body;
                const status = "Dikirim";
                const feedbackData = Object.assign(Object.assign({}, data), { user_id: userId, status: status });
                const feedback = yield this.feedbackService.createFeedback(feedbackData);
                res.status(201).json({
                    message: "Feedback created successfully",
                    feedback: feedback,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getAllFeedbacks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const feedbacks = yield this.feedbackService.getAllFeedbacks();
                res.status(200).json({
                    message: "All feedbacks retrieved successfully",
                    feedbacks: feedbacks,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getFeedbackByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
                const feedbacks = yield this.feedbackService.getFeedbackByUser(userId);
                res.status(200).json({
                    message: "Feedbacks retrieved successfully",
                    feedbacks: feedbacks,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const data = req.body;
                const updatedFeedback = yield this.feedbackService.updateFeedback(id, data);
                if (!updatedFeedback) {
                    return res.status(404).json({ message: "Feedback not found" });
                }
                res.status(200).json({
                    message: "Feedback updated successfully",
                    feedback: updatedFeedback,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    deleteFeedback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                yield this.feedbackService.deleteFeedback(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
