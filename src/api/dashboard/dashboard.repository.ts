import prisma from "../../config/db.js";
import { Prisma } from "@prisma/client";

export class DashboardRepository {
  // Bagian 1: Summary counts
  async getTotalCounts() {
    const [totalMenus, totalOrders, totalCustomers] = await Promise.all([
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
  }

  // Bagian 2: Pendapatan per bulan dalam 1 tahun
  async getMonthlyRevenue(year: number) {
    const startOfYear = `${year}-01-01 00:00:00Z`;
    const endOfYear = `${year}-12-31 23:59:59Z`;

    return await prisma.order.findMany({
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
  }

  // Bagian 3: Top 2 menu per kategori
  async getTopMenusByCategory() {
    return await prisma.orderItem.groupBy({
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
  }

  async getMenuDetails(menuIds: number[]) {
    return await prisma.menu.findMany({
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
  }

  async getTopSellingMenus(limit: number) {
    return await prisma.orderItem.groupBy({
      by: ["menu_id"],
      _sum: {
        quantity: true,
        subtotal: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: limit,
    });
  }
}
