import prisma from "../../config/db.js";
import { Prisma } from "@prisma/client";

export class MenuCategoryRepository {
  async findAll() {
    return await prisma.menu_categories.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
  async findAllWithCount() {
    return await prisma.menu_categories.findMany({
        where: { delete_at: null },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            menus: {
              where: {
                delete_at: null,
              },
            },
          },
        },
      },
    });
  }
  async findById(id: number) {
    return await prisma.menu_categories.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
  }
  async create(data: Prisma.menu_categoriesCreateInput) {
    return await prisma.menu_categories.create({
      data,
    });
  }
  async update(id: number, data: Prisma.menu_categoriesUpdateInput) {
    return await prisma.menu_categories.update({
      where: { id },
      data,
    });
  }
  async delete(id: number, data: Prisma.menu_categoriesUpdateInput) {
    return await prisma.menu_categories.update({
      where: { id },
      data,
    });
  }
}
