import { ReviewRepository } from "./review.repository.js";
import { OrderService } from "../orders/order.service.js";
import { Prisma } from "@prisma/client";
import type { rating } from "../../types/rating.js";

export class ReviewService {
  private reviewRepository: ReviewRepository;
  private orderService: OrderService;

  constructor() {
    this.reviewRepository = new ReviewRepository();
    this.orderService = new OrderService();
  }

  async getReviewsByMenuId(menuId: number) {
    try {
      const result = await this.reviewRepository.findByMenuId(menuId);
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getMenuRatings(menuIds?: number[]) {
    try {
      return await this.reviewRepository.getMenuRatings(menuIds);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createReviews(userId: number, reviewsData: any[]) {
    try {
        const createdReviews = [];
        
        for (const reviewData of reviewsData) {
          const {menuId, orderItemId, rating, comment } = reviewData;
          
          const data = {
            rating: rating,
            comment: comment || "",
            users: { connect: { id: userId } },
            menus: { connect: { id: menuId } },
            order_items: { connect: { id: orderItemId } }
          };

          const createdReview = await this.reviewRepository.create(data);
          if (!createdReview) {
            throw new Error(`Review creation failed for menu ${menuId}`);
          }

          // Update is_rated menjadi true di tabel orders
          await this.orderService.markOrderAsRated(orderItemId);
          
          createdReviews.push(createdReview);
        }
        
        return createdReviews;
    } catch (error: any) {
        throw new Error(error.message);
    }
  }

  async createSingleReview(userId: number, reviewData: any) {
    try {
        const {menuId, orderItemId, rating, comment } = reviewData;
        
        const data = {
          rating: rating,
          comment: comment || "",
          users: { connect: { id: userId } },
          menus: { connect: { id: menuId } },
          order_items: { connect: { id: orderItemId } }
        };

        const createdReview = await this.reviewRepository.create(data);
        if (!createdReview) {
          throw new Error("Review creation failed");
        }

        // Update is_rated menjadi true di tabel orders
        await this.orderService.markOrderAsRated(orderItemId);
        
        return createdReview;
    } catch (error: any) {
        throw new Error(error.message);
    }
  }
}