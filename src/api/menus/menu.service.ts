import { MenuRepository } from "./menu.repository.js";
import { Prisma } from "@prisma/client";
import type { MenuUpdateInputWithCategoryId } from "../../types/menu.types.js";
import fs from "fs/promises";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);

export class MenuService {
  private menuRepository: MenuRepository;
  constructor() {
    this.menuRepository = new MenuRepository();
  }
  async findById(id: number) {
    const menu = await this.menuRepository.findById(id);
    if (!menu) {
      throw new Error("Menu not found");
    }
    return menu;
  }
  async findByCategory(categoryId: number) {
    const menus = await this.menuRepository.findByCategory(categoryId);
    return menus;
  }
  async findAll() {
    try {
      const menus = await this.menuRepository.findAll();
      menus.forEach((menu) => {
        menu.image_url = `${process.env.BASE_URL}/${menu.image_url}`;
      });
      return menus;
    } catch (error) {
      throw new Error("Failed to retrieve menus");
    }
  }
  async create(data: Prisma.MenuCreateInput) {
    const createdMenu = await this.menuRepository.create(data);
    if (!createdMenu) {
      throw new Error("Menu creation failed");
    }
    return createdMenu;
  }
  async update(id: number, data: MenuUpdateInputWithCategoryId) {
    const currentMenu = await this.menuRepository.findById(id);
    if (!currentMenu) {
      throw new Error("Menu not found");
    }
    if (data.image_url && currentMenu.image_url) {
      try {
        await fs.unlink(currentMenu.image_url);
      } catch (error) {
        throw new Error("Failed to delete old image");
      }
    }
    if (data.category_id) {
      data.category = { connect: { id: data.category_id } };
      delete data.category_id;
    }
    const updatedMenu = await this.menuRepository.update(id, data);
    if (!updatedMenu) {
      throw new Error("Menu update failed");
    }
    return updatedMenu;
  }
  async delete(id: number) {
    try {
      const nowString = dayjs()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD HH:mm:ss");
      const delete_at = nowString + "Z";
      return await this.menuRepository.update(id, { delete_at });
    } catch (error : any) {
      throw new Error(error);
    }
  }
}
