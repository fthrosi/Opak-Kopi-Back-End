import prisma from "../../config/db.js";
import { Prisma } from "@prisma/client";

export class ReviewRepository {
  async findByMenuId(menuId: number) {
    const reviews = await prisma.rating_riviews.findMany({
      where: { menu_id: menuId },
      select: {
        id: true,
        users: {
          select: {
            id: true,
            name: true,
            img_url: true,
          },
        },
        rating: true,
        comment: true,
        created_at: true,
      },
    });

    const avgRating = await prisma.rating_riviews.aggregate({
      where: { menu_id: menuId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      reviews,
      avgRating: avgRating._avg.rating || 0,
      totalReviews: avgRating._count.rating || 0,
    };
  }

  async getMenuRatings(menuIds?: number[]) {
    const whereCondition = menuIds ? { menu_id: { in: menuIds } } : {};
    
    return await prisma.rating_riviews.groupBy({
      by: ['menu_id'],
      where: whereCondition,
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });
  }

  async create(data: Prisma.rating_riviewsCreateInput) {
    return await prisma.rating_riviews.create({
      data,
      select: {
        id: true,
        users: {
          select: {
            id: true,
            name: true,
            img_url: true,
          },
        },
        menus: {
          select: {
            id: true,
            name: true,
            image_url: true,
          },
        },
        rating: true,
        comment: true,
        created_at: true,
      },
    });
  }
}
