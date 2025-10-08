var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../../config/db.js";
export class ReviewRepository {
    findByMenuId(menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviews = yield prisma.rating_riviews.findMany({
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
            const avgRating = yield prisma.rating_riviews.aggregate({
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
        });
    }
    getMenuRatings(menuIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereCondition = menuIds ? { menu_id: { in: menuIds } } : {};
            return yield prisma.rating_riviews.groupBy({
                by: ['menu_id'],
                where: whereCondition,
                _avg: {
                    rating: true,
                },
                _count: {
                    rating: true,
                },
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.rating_riviews.create({
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
        });
    }
}
