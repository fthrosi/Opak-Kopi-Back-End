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
export class DashboardRepository {
    // Bagian 1: Summary counts
    getTotalCounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const [totalMenus, totalOrders, totalCustomers] = yield Promise.all([
                // Total menu aktif
                prisma.menu.count({
                    where: { delete_at: null },
                }),
                // Total pesanan
                prisma.order.count(),
                // Total customer (role = Pelanggan)
                prisma.user.count({
                    where: {
                        role: { name: "Pelanggan" },
                        delete_at: null,
                    },
                }),
            ]);
            return { totalMenus, totalOrders, totalCustomers };
        });
    }
    // Bagian 2: Pendapatan per bulan dalam 1 tahun
    getMonthlyRevenue(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const startOfYear = `${year}-01-01 00:00:00Z`;
            const endOfYear = `${year}-12-31 23:59:59Z`;
            return yield prisma.order.findMany({
                where: {
                    created_at: {
                        gte: startOfYear,
                        lte: endOfYear,
                    },
                    status: "Selesai",
                },
                select: {
                    total_price: true,
                    created_at: true,
                },
            });
        });
    }
    // Bagian 3: Top 2 menu per kategori
    getTopMenusByCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.orderItem.groupBy({
                by: ["menu_id"],
                where: {
                    menu_id: { not: null },
                    order: {
                        status: "Selesai",
                    },
                },
                _sum: {
                    quantity: true,
                    subtotal: true,
                },
                orderBy: {
                    _sum: {
                        quantity: "desc",
                    },
                },
            });
        });
    }
    getMenuDetails(menuIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.menu.findMany({
                where: {
                    id: { in: menuIds },
                    delete_at: null,
                },
                select: {
                    id: true,
                    name: true,
                    image_url: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        });
    }
}
