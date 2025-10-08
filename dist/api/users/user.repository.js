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
export class UserRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findMany({
                where: {
                    delete_at: null,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    img_url: true,
                    poin: true,
                    status: true,
                    role: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    img_url: true,
                    poin: true,
                    password: true,
                    status: true,
                    role: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        });
    }
    findByRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findMany({
                where: {
                    delete_at: null,
                    role: {
                        name: role,
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    img_url: true,
                    poin: true,
                    role: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
        });
    }
    findAllCustomersWithStats() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findMany({
                where: {
                    role: {
                        name: "Pelanggan",
                    },
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    img_url: true,
                    poin: true,
                    status: true,
                    created_at: true,
                    role: {
                        select: {
                            name: true,
                        },
                    },
                    // Hitung total transaksi dan pesanan
                    _count: {
                        select: {
                            orders_as_customer: true, // Total pesanan
                        },
                    },
                    orders_as_customer: {
                        select: {
                            id: true,
                            total_price: true,
                            created_at: true,
                        },
                        orderBy: {
                            created_at: "desc",
                        },
                    },
                },
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.create({
                data,
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.update({
                where: { id },
                data,
                include: {
                    role: true,
                },
            });
        });
    }
    delete(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.update({
                where: { id },
                data,
            });
        });
    }
    createFavoriteMenu(userId, menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.favoriteMenu.create({
                data: {
                    user_id: userId,
                    menu_id: menuId,
                },
            });
        });
    }
    getallFavoriteMenus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.favoriteMenu.findMany({
                where: { user_id: userId },
                include: {
                    menu: {
                        select: {
                            id: true,
                            name: true,
                            current_price: true,
                            current_cogs: true,
                            description: true,
                            image_url: true,
                            category: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    }
    deleteFavoriteMenu(userId, menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.favoriteMenu.delete({
                where: {
                    user_id_menu_id: {
                        user_id: userId,
                        menu_id: menuId,
                    },
                },
            });
        });
    }
}
