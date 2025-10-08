var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ReviewService } from "./review.service.js";
export class ReviewController {
    constructor() {
        this.reviewService = new ReviewService();
    }
    getReviewsByMenuId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const menuId = parseInt(req.params.menuId);
            try {
                const reviews = yield this.reviewService.getReviewsByMenuId(menuId);
                res.status(200).json({
                    message: "Reviews retrieved successfully",
                    data: reviews,
                });
            }
            catch (error) {
                const status = error.status || 500;
                const message = error.message || "Internal server error";
                res.status(status).json({ error: message });
            }
        });
    }
    getMenuRatings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menuIds = req.query.menuIds
                    ? req.query.menuIds.split(",").map((id) => parseInt(id))
                    : undefined;
                const ratings = yield this.reviewService.getMenuRatings(menuIds);
                res.status(200).json({
                    message: "Menu ratings retrieved successfully",
                    data: ratings,
                });
            }
            catch (error) {
                const status = error.status || 500;
                const message = error.message || "Internal server error";
                res.status(status).json({ error: message });
            }
        });
    }
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            try {
                const data = req.body;
                // Cek apakah data adalah array (bulk create) atau object (single create)
                if (Array.isArray(data)) {
                    // Bulk create - kirim array reviews
                    const reviews = yield this.reviewService.createReviews(userId, data);
                    res.status(201).json({
                        message: `${reviews.length} reviews created successfully`,
                        data: reviews,
                    });
                }
                else {
                    // Single create - kirim satu review
                    const review = yield this.reviewService.createSingleReview(userId, data);
                    res.status(201).json({
                        message: "Review created successfully",
                        data: review,
                    });
                }
            }
            catch (error) {
                const status = error.status || 400;
                const message = error.message || "Internal server error";
                res.status(status).json({ error: message });
            }
        });
    }
}
