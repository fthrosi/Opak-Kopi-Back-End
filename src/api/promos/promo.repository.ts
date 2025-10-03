import prisma from "../../config/db.js";
import { Prisma } from "@prisma/client";

export class PromoRepository {
  async findAll() {
    return await prisma.promo.findMany({
      where: { delete_at: null },
      select: {
        id: true,
        promo_code: true,
        name: true,
        description: true,
        img_url: true,
        promo_type: true,
        percent_value: true,
        amount_value: true,
        status: true,
        minimum_purchase: true,
        start_date: true,
        end_date: true,
        promo_menus: {
          select: {
            menu: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
  async findById(id: number) {
    return await prisma.promo.findUnique({
      where: { id },
      select: {
        id: true,
        promo_code: true,
        name: true,
        description: true,
        img_url: true,
        promo_type: true,
        percent_value: true,
        amount_value: true,
        status: true,
        minimum_purchase: true,
        start_date: true,
        end_date: true,
        promo_menus: {
          select: {
            menu: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
  async findByType(type: string) {
    return await prisma.promo.findMany({
      where: { promo_type: type, delete_at: null },
      select: {
        id: true,
        promo_code: true,
        name: true,
        description: true,
        img_url: true,
        promo_type: true,
        percent_value: true,
        amount_value: true,
        status: true,
        minimum_purchase: true,
        start_date: true,
        end_date: true,
        promo_menus: {
          select: {
            menu: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
  async findByCode(promoCode: string) {
    return await prisma.promo.findFirst({
      where: { promo_code: promoCode },
      select: {
        id: true,
        promo_code: true,
        name: true,
        description: true,
        img_url: true,
        promo_type: true,
        percent_value: true,
        amount_value: true,
        status: true,
        minimum_purchase: true,
        start_date: true,
        end_date: true,
        promo_menus: {
          select: {
            menu: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
  async findByStatus(status: string) {
    return await prisma.promo.findMany({
      where: { status, delete_at: null },
      select: {
        id: true,
        promo_code: true,
        name: true,
        description: true,
        img_url: true,
        promo_type: true,
        percent_value: true,
        amount_value: true,
        status: true,
        minimum_purchase: true,
        start_date: true,
        end_date: true,
        promo_menus: {
          select: {
            menu: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
  async create(data: Prisma.PromoCreateInput) {
    return await prisma.promo.create({
      data,
    });
  }
  async update(id: number, data: Prisma.PromoUpdateInput) {
    return await prisma.promo.update({
      where: { id },
      data,
    });
  }
  async delete(id: number, data: Prisma.PromoUpdateInput) {
    return await prisma.promo.update({
      where: { id },
      data
    });
  }
  async findAllWithClaimCount() {
    return await prisma.promo.findMany({
      where: { delete_at: null },
      select: {
        id: true,
        promo_code: true,
        name: true,
        description: true,
        img_url: true,
        promo_type: true,
        percent_value: true,
        amount_value: true,
        status: true,
        minimum_purchase: true,
        start_date: true,
        end_date: true,
        promo_menus: {
          select: {
            menu: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        // Hitung total klaim dari relasi orders
        _count: {
          select: { orders: true },
        },
      },
    });
  }
  async createPromoMenu(data: Prisma.PromoMenuCreateInput) {
    return await prisma.promoMenu.create({
      data,
    });
  }
  async getPromoMenus(id: number) {
    return await prisma.promoMenu.findMany({
      where: { promo_id: id },
      select: {
        menu: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  async deletePromoMenus(promoId: number, menuIds?: number) {
    return await prisma.promoMenu.deleteMany({
      where: { promo_id: promoId, menu_id: menuIds },
    });
  }
}
