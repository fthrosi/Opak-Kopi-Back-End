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
export class ReportRepository {
    getSalesReport(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield prisma.order.findMany({
                where: {
                    created_at: {
                        gte: start,
                        lte: end,
                    },
                    status: "Selesai",
                },
                include: {
                    order_items: true,
                },
            });
            return report;
        });
    }
    getMenuReport(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield prisma.order.findMany({
                where: {
                    created_at: {
                        gte: start,
                        lte: end,
                    },
                    status: "Selesai",
                },
                include: {
                    order_items: {
                        include: {
                            menu: {
                                select: {
                                    id: true,
                                    name: true,
                                    category: {
                                        select: {
                                            id: true,
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            return report;
        });
    }
    getPromoReport(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield prisma.order.groupBy({
                by: ["promo_id"],
                where: {
                    status: "Selesai",
                    promo_id: {
                        not: null,
                    },
                    created_at: {
                        gte: start,
                        lte: end,
                    },
                    // status: "Selesai",
                },
                _count: {
                    promo_id: true,
                },
                _sum: {
                    promo_value: true,
                },
            });
            return report;
        });
    }
    findActiveRange() {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield prisma.promo.findMany({
                where: {
                    status: "Aktif",
                },
            });
            return report;
        });
    }
    getReservasiReport(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield prisma.reservations.findMany({
                where: {
                    reservation_time: {
                        gte: start,
                        lte: end,
                    },
                },
            });
            return report;
        });
    }
}
