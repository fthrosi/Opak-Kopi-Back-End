import prisma from "../../config/db.js";
import { Prisma } from "@prisma/client";

export class UserRepository {
  async findAll() {
    return await prisma.user.findMany({
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
  }
  async findById(id: number) {
    return await prisma.user.findUnique({
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
  }
  async findByRole(role: string) {
    return await prisma.user.findMany({
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
  }

  async findAllCustomersWithStats() {
    return await prisma.user.findMany({
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
  }

  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    });
  }
  async update(id: number, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data,
      include: {
        role: true,
      },
    });
  }
  async delete(id: number, data: Prisma.UserUpdateInput) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }
  async createFavoriteMenu(userId: number, menuId: number) {
    return await prisma.favoriteMenu.create({
      data: {
        user_id: userId,
        menu_id: menuId,
      },
    });
  }
  async getallFavoriteMenus(userId: number) {
    return await prisma.favoriteMenu.findMany({
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
  }
  async deleteFavoriteMenu(userId: number, menuId: number) {
    return await prisma.favoriteMenu.delete({
      where: {
        user_id_menu_id: {
          user_id: userId,
          menu_id: menuId,
        },
      },
    });
  }
}
