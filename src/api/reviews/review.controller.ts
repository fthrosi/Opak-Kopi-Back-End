import { ReviewService } from "./review.service.js";
import { Request, Response } from "express";
import { CustomRequest } from "../../middleware/auth.js";

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  async getReviewsByMenuId(req: Request, res: Response) {
    const menuId = parseInt(req.params.menuId);
    try {
      const reviews = await this.reviewService.getReviewsByMenuId(menuId);
      res.status(200).json({
        message: "Reviews retrieved successfully",
        data: reviews,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      res.status(status).json({ error: message });
    }
  }

  async getMenuRatings(req: Request, res: Response) {
    try {
      const menuIds = req.query.menuIds
        ? (req.query.menuIds as string).split(",").map((id) => parseInt(id))
        : undefined;

      const ratings = await this.reviewService.getMenuRatings(menuIds);
      res.status(200).json({
        message: "Menu ratings retrieved successfully",
        data: ratings,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      res.status(status).json({ error: message });
    }
  }

  async createReview(req: CustomRequest, res: Response) {
    const userId = Number(req.user?.userId);
    try {
      const data = req.body;
      
      // Cek apakah data adalah array (bulk create) atau object (single create)
      if (Array.isArray(data)) {
        // Bulk create - kirim array reviews
        const reviews = await this.reviewService.createReviews(userId, data);
        res.status(201).json({
          message: `${reviews.length} reviews created successfully`,
          data: reviews,
        });
      } else {
        // Single create - kirim satu review
        const review = await this.reviewService.createSingleReview(userId, data);
        res.status(201).json({
          message: "Review created successfully",
          data: review,
        });
      }
    } catch (error: any) {
      const status = error.status || 400;
      const message = error.message || "Internal server error";
      res.status(status).json({ error: message });
    }
  }
}
