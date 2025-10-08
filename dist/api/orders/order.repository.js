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
export class OrderRepository {
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.order.findMany({
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    cashier: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    table: {
                        select: {
                            id: true,
                            number: true,
                        },
                    },
                    promo: {
                        select: {
                            id: true,
                            promo_code: true,
                            name: true,
                            promo_type: true,
                            percent_value: true,
                            amount_value: true,
                        },
                    },
                    order_items: {
                        select: {
                            id: true,
                            menu: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                            name_menu: true,
                            quantity: true,
                            price_at_transaction: true,
                            cogs_at_transaction: true,
                            subtotal: true,
                        },
                    },
                },
            });
        });
    }
    getOrderById(id_order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.order.findUnique({
                where: { id: id_order },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    cashier: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    table: {
                        select: {
                            id: true,
                            number: true,
                        },
                    },
                    promo: {
                        select: {
                            id: true,
                            promo_code: true,
                            name: true,
                            promo_type: true,
                            percent_value: true,
                            amount_value: true,
                        },
                    },
                    order_items: {
                        select: {
                            id: true,
                            menu: {
                                select: {
                                    id: true,
                                    name: true,
                                    image_url: true,
                                },
                            },
                            name_menu: true,
                            quantity: true,
                            price_at_transaction: true,
                            cogs_at_transaction: true,
                            subtotal: true,
                        },
                    },
                    point_history: {
                        select: {
                            id: true,
                            type: true,
                            amount: true,
                        },
                    },
                },
            });
        });
    }
    getOrderByUser(id_user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.order.findMany({
                where: {
                    customer_id: id_user,
                },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    cashier: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    table: {
                        select: {
                            id: true,
                            number: true,
                        },
                    },
                    promo: {
                        select: {
                            id: true,
                            promo_code: true,
                            name: true,
                            promo_type: true,
                            percent_value: true,
                            amount_value: true,
                        },
                    },
                    order_items: {
                        select: {
                            id: true,
                            menu: {
                                select: {
                                    id: true,
                                    name: true,
                                    image_url: true,
                                },
                            },
                            name_menu: true,
                            quantity: true,
                            price_at_transaction: true,
                            cogs_at_transaction: true,
                            subtotal: true,
                        },
                    },
                },
                orderBy: {
                    created_at: "desc",
                },
            });
        });
    }
    getOrderByOrderCode(order_code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.order.findUnique({
                where: { order_code },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    cashier: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    table: {
                        select: {
                            id: true,
                            number: true,
                        },
                    },
                    promo: {
                        select: {
                            id: true,
                            promo_code: true,
                            name: true,
                            promo_type: true,
                            percent_value: true,
                            amount_value: true,
                        },
                    },
                    order_items: {
                        select: {
                            id: true,
                            menu: {
                                select: {
                                    id: true,
                                    name: true,
                                    image_url: true,
                                },
                            },
                            name_menu: true,
                            quantity: true,
                            price_at_transaction: true,
                            cogs_at_transaction: true,
                            subtotal: true,
                        },
                    },
                    point_history: {
                        select: {
                            id: true,
                            type: true,
                            amount: true,
                        },
                    },
                },
            });
        });
    }
    getDailyOrders(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.order.findMany({
                where: {
                    created_at: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    cashier: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    table: {
                        select: {
                            id: true,
                            number: true,
                        },
                    },
                    promo: {
                        select: {
                            id: true,
                            promo_code: true,
                            name: true,
                            promo_type: true,
                            percent_value: true,
                            amount_value: true,
                        },
                    },
                    order_items: {
                        select: {
                            id: true,
                            menu: {
                                select: {
                                    id: true,
                                    name: true,
                                    image_url: true,
                                },
                            },
                            name_menu: true,
                            quantity: true,
                            price_at_transaction: true,
                            cogs_at_transaction: true,
                            subtotal: true,
                        },
                    },
                    point_history: {
                        select: {
                            id: true,
                            type: true,
                            amount: true,
                        },
                    },
                },
                orderBy: {
                    created_at: "desc",
                },
            });
        });
    }
    getOrdersByRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.order.findMany({
                where: {
                    created_at: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    cashier: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    table: {
                        select: {
                            id: true,
                            number: true,
                        },
                    },
                    promo: {
                        select: {
                            id: true,
                            promo_code: true,
                            name: true,
                            promo_type: true,
                            percent_value: true,
                            amount_value: true,
                        },
                    },
                    order_items: {
                        select: {
                            id: true,
                            menu: {
                                select: {
                                    id: true,
                                    name: true,
                                    image_url: true,
                                },
                            },
                            name_menu: true,
                            quantity: true,
                            price_at_transaction: true,
                            cogs_at_transaction: true,
                            subtotal: true,
                        },
                    },
                },
                orderBy: { created_at: "desc" },
            });
        });
    }
    createOrder(data, Items) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield prisma.order.create({
                data: Object.assign(Object.assign({}, data), { order_items: {
                        create: Items.map((item) => (Object.assign({}, item))),
                    } }),
                include: {
                    customer: true,
                    order_items: true,
                },
            });
            return order;
        });
    }
    updateOrder(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.order.update({
                where: { id },
                data,
            });
        });
    }
    deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.orderItem.delete({
                where: { id },
            });
        });
    }
    deleteOrderItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.orderItem.delete({
                where: { id },
            });
        });
    }
    createHistoryPoint(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.pointHistory.create({
                data,
            });
        });
    }
    getHistoryPointByUser(id_user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.pointHistory.findMany({
                where: { user_id: id_user },
                orderBy: { created_at: "desc" },
            });
        });
    }
    markAsRated(orderItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Dapatkan order_id dari order_item_id
            const orderItem = yield prisma.orderItem.findUnique({
                where: { id: orderItemId },
                select: { order_id: true },
            });
            if (!orderItem) {
                throw new Error(`Order item with id ${orderItemId} not found`);
            }
            // Update is_rated menjadi true di tabel orders
            return yield prisma.order.update({
                where: { id: orderItem.order_id },
                data: { is_rated: true },
            });
        });
    }
}
