import { DashboardRepository } from "./dashboard.repository.js";
import dayjs from "dayjs";

export class DashboardService {
  private dashboardRepository: DashboardRepository;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getDashboardData() {
    const currentYear = dayjs().year();

    try {
      const summary = await this.dashboardRepository.getTotalCounts();

      const monthlyData = await this.dashboardRepository.getMonthlyRevenue(
        currentYear
      );
      const monthlyRevenue = this.processMonthlyRevenue(monthlyData);

      const topMenus = await this.getTopMenusByCategory();

      return {
        summary,
        monthlyRevenue,
        topMenusByCategory: topMenus,
      };
    } catch (error) {
      throw error;
    }
  }

  private processMonthlyRevenue(data: any[]) {
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

  private async getTopMenusByCategory() {
    const topMenusData = await this.dashboardRepository.getTopMenusByCategory();
    const menuIds = topMenusData
      .map((item) => item.menu_id)
      .filter((id): id is number => id !== null && id !== undefined);
    const menuDetails = await this.dashboardRepository.getMenuDetails(menuIds);

    const menusWithQuantity = topMenusData
      .filter((item) => item.menu_id !== null)
      .map((item) => {
        const menu = menuDetails.find((m) => m.id === item.menu_id);
        return {
          ...menu,
          totalSold: item._sum.quantity || 0,
          totalRevenue: item._sum.subtotal || 0,
        };
      })
      .filter((item) => item.id);

    const groupedByCategory: Record<string, any[]> = {};

    menusWithQuantity.forEach((menu) => {
      const categoryName = menu.category?.name || "Lainnya";
      if (!groupedByCategory[categoryName]) {
        groupedByCategory[categoryName] = [];
      }
      groupedByCategory[categoryName].push(menu);
    });

    const result = Object.keys(groupedByCategory).map((categoryName) => ({
      categoryName,
      categoryId: groupedByCategory[categoryName][0]?.category?.id || null,
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
    }));
    return result;
  }
  async getTopSellingMenus(limit: number) {
    try {
      const topMenusData = await this.dashboardRepository.getTopSellingMenus(
        limit
      );
      let menuIds = topMenusData
        .map((item) => item.menu_id)
        .filter((id): id is number => id !== null && id !== undefined);

      if (menuIds.length === 0) {
        menuIds = [1, 2, 3];
      }
      const menuDetails = await this.dashboardRepository.getMenuDetails(
        menuIds
      );

      return topMenusData.map((item) => {
        const menu = menuDetails.find((m) => m.id === item.menu_id);
        return {
          ...menu,
          image_url: menu?.image_url
            ? `${process.env.BASE_URL}/${menu.image_url}`
            : null,
          totalSold: item._sum.quantity || 0,
          totalRevenue: item._sum.subtotal || 0,
        };
      });
    } catch (error) {
      throw error;
    }
  }
}
