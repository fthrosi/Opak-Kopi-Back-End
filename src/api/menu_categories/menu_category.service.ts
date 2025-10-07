import { MenuCategoryRepository } from "./menu_category.repository.js";
import { MenuService } from "../menus/menu.service.js";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { stat } from "fs";
dayjs.extend(utc);
dayjs.extend(timezone);

export class MenuCategoryService {
  private menuCategoryRepository: MenuCategoryRepository;
  private menuService: MenuService;
  constructor() {
    this.menuCategoryRepository = new MenuCategoryRepository();
    this.menuService = new MenuService();
  }

  async findAll() {
    try {
      const kategori = await this.menuCategoryRepository.findAll();
      return kategori;
    } catch (error) {
      throw new Error("Failed to retrieve menu categories");
    }
  }

  async findById(id: number) {
    const category = await this.menuCategoryRepository.findById(id);
    if (!category) {
      throw new Error("Menu category not found");
    }
    return category;
  }
  async findAllWithCount() {
    try {
      const categories = await this.menuCategoryRepository.findAllWithCount();
      return categories;
    } catch (error) {
      throw error;
    }
  }

  async create(data: Prisma.menu_categoriesCreateInput) {
    const createdCategory = await this.menuCategoryRepository.create(data);
    if (!createdCategory) {
      throw new Error("Menu category creation failed");
    }
    return createdCategory;
  }

  async update(id: number, data: Prisma.menu_categoriesUpdateInput) {
    const updatedCategory = await this.menuCategoryRepository.update(id, data);
    if (!updatedCategory) {
      throw new Error("Menu category not found");
    }
    return updatedCategory;
  }

  async delete(id: number) {
    const menu = await this.menuService.findByCategory(id);
    if (menu && menu.length > 0) {
      throw {status: 400, message: "Kategori tidak dapat dihapus karena memiliki menu terkait" };
    }
    const nowString = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    const delete_at = nowString + "Z";
    const deletedCategory = await this.menuCategoryRepository.update(id, { delete_at });
    if (!deletedCategory) {
      throw new Error("Menu category not found");
    }
    return deletedCategory;
  }
}
