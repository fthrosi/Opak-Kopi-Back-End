var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DashboardRepository } from "./dashboard.repository.js";
import dayjs from "dayjs";
export class DashboardService {
    constructor() {
        this.dashboardRepository = new DashboardRepository();
    }
    getDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentYear = dayjs().year();
            try {
                const summary = yield this.dashboardRepository.getTotalCounts();
                const monthlyData = yield this.dashboardRepository.getMonthlyRevenue(currentYear);
                const monthlyRevenue = this.processMonthlyRevenue(monthlyData);
                const topMenus = yield this.getTopMenusByCategory();
                return {
                    summary,
                    monthlyRevenue,
                    topMenusByCategory: topMenus,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    processMonthlyRevenue(data) {
        const months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];
        const monthlyRevenue = months.map((month, index) => ({
            month,
            revenue: 0,
        }));
        data.forEach((order) => {
            const monthIndex = dayjs(order.created_at).month();
            monthlyRevenue[monthIndex].revenue += order.total_price || 0;
        });
        return monthlyRevenue;
    }
    getTopMenusByCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const topMenusData = yield this.dashboardRepository.getTopMenusByCategory();
            const menuIds = topMenusData
                .map((item) => item.menu_id)
                .filter((id) => id !== null && id !== undefined);
            const menuDetails = yield this.dashboardRepository.getMenuDetails(menuIds);
            const menusWithQuantity = topMenusData
                .filter((item) => item.menu_id !== null)
                .map((item) => {
                const menu = menuDetails.find((m) => m.id === item.menu_id);
                return Object.assign(Object.assign({}, menu), { totalSold: item._sum.quantity || 0, totalRevenue: item._sum.subtotal || 0 });
            })
                .filter((item) => item.id);
            const groupedByCategory = {};
            menusWithQuantity.forEach((menu) => {
                var _a;
                const categoryName = ((_a = menu.category) === null || _a === void 0 ? void 0 : _a.name) || "Lainnya";
                if (!groupedByCategory[categoryName]) {
                    groupedByCategory[categoryName] = [];
                }
                groupedByCategory[categoryName].push(menu);
            });
            const result = Object.keys(groupedByCategory).map((categoryName) => {
                var _a, _b;
                return ({
                    categoryName,
                    categoryId: ((_b = (_a = groupedByCategory[categoryName][0]) === null || _a === void 0 ? void 0 : _a.category) === null || _b === void 0 ? void 0 : _b.id) || null,
                    topMenus: groupedByCategory[categoryName]
                        .sort((a, b) => b.totalSold - a.totalSold)
                        .slice(0, 2)
                        .map((menu) => ({
                        id: menu.id,
                        name: menu.name,
                        img_url: menu.image_url
                            ? `${process.env.BASE_URL}/${menu.image_url}`
                            : null,
                        totalSold: menu.totalSold,
                        totalRevenue: menu.totalRevenue,
                    })),
                });
            });
            return result;
        });
    }
}
