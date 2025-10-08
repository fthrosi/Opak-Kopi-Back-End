import { ReviewController } from "./review.controller.js";
import { Router } from "express";
import { validateToken, validateRole } from "../../middleware/auth.js";
const reviewRouter = Router();
const reviewController = new ReviewController();
// Route spesifik harus ditempatkan sebelum route dengan parameter
reviewRouter.get("/ratings", reviewController.getMenuRatings.bind(reviewController));
reviewRouter.get("/:menuId", reviewController.getReviewsByMenuId.bind(reviewController));
reviewRouter.post("/", validateToken, validateRole(["Pelanggan"]), reviewController.createReview.bind(reviewController));
export default reviewRouter;
