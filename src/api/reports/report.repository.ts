import prisma from "../../config/db.js";

export class ReportRepository {
  async getSalesReport(start: string,end: string ) {
    const report = await prisma.order.findMany({
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
  }

  async getMenuReport(start: string, end: string) {
    const report = await prisma.order.findMany({
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
  }

  async getPromoReport(start: string, end: string) {
    const report = await prisma.order.groupBy({
      by: ["promo_id"],
      where: {
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
  }

  async findActiveRange() {
    const report = await prisma.promo.findMany({
      where: {
        status: "Aktif",
      },
    });
    return report;
  }

  async getReservasiReport(start: string, end: string) {
    const report = await prisma.reservations.findMany({
      where: {
        reservation_time: {
          gte: start,
          lte: end,
        },
      },
    });
    return report;
  }
}
