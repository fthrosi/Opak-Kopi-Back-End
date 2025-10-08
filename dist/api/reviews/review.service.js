var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ReviewRepository } from "./review.repository.js";
import { OrderService } from "../orders/order.service.js";
export class ReviewService {
    constructor() {
        this.reviewRepository = new ReviewRepository();
        this.orderService = new OrderService();
    }
    getReviewsByMenuId(menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.reviewRepository.findByMenuId(menuId);
                return result;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getMenuRatings(menuIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.reviewRepository.getMenuRatings(menuIds);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    createReviews(userId, reviewsData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdReviews = [];
                for (const reviewData of reviewsData) {
                    const { menuId, orderItemId, rating, comment } = reviewData;
                    const data = {
                        rating: rating,
                        comment: comment || "",
                        users: { connect: { id: userId } },
                        menus: { connect: { id: menuId } },
                        order_items: { connect: { id: orderItemId } }
                    };
                    const createdReview = yield this.reviewRepository.create(data);
                    if (!createdReview) {
                        throw new Error(`Review creation failed for menu ${menuId}`);
                    }
                    // Update is_rated menjadi true di tabel orders
                    yield this.orderService.markOrderAsRated(orderItemId);
                    createdReviews.push(createdReview);
                }
                return createdReviews;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    createSingleReview(userId, reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { menuId, orderItemId, rating, comment } = reviewData;
                const data = {
                    rating: rating,
                    comment: comment || "",
                    users: { connect: { id: userId } },
                    menus: { connect: { id: menuId } },
                    order_items: { connect: { id: orderItemId } }
                };
                const createdReview = yield this.reviewRepository.create(data);
                if (!createdReview) {
                    throw new Error("Review creation failed");
                }
                // Update is_rated menjadi true di tabel orders
                yield this.orderService.markOrderAsRated(orderItemId);
                return createdReview;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
