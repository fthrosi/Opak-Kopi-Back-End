var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MenuCategoryRepository } from "./menu_category.repository.js";
import { MenuService } from "../menus/menu.service.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);
export class MenuCategoryService {
    constructor() {
        this.menuCategoryRepository = new MenuCategoryRepository();
        this.menuService = new MenuService();
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const kategori = yield this.menuCategoryRepository.findAll();
                return kategori;
            }
            catch (error) {
                throw new Error("Failed to retrieve menu categories");
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.menuCategoryRepository.findById(id);
            if (!category) {
                throw new Error("Menu category not found");
            }
            return category;
        });
    }
    findAllWithCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.menuCategoryRepository.findAllWithCount();
                return categories;
            }
            catch (error) {
                throw error;
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdCategory = yield this.menuCategoryRepository.create(data);
            if (!createdCategory) {
                throw new Error("Menu category creation failed");
            }
            return createdCategory;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCategory = yield this.menuCategoryRepository.update(id, data);
            if (!updatedCategory) {
                throw new Error("Menu category not found");
            }
            return updatedCategory;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const menu = yield this.menuService.findByCategory(id);
            if (menu && menu.length > 0) {
                throw { status: 400, message: "Kategori tidak dapat dihapus karena memiliki menu terkait" };
            }
            const nowString = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
            const delete_at = nowString + "Z";
            const deletedCategory = yield this.menuCategoryRepository.update(id, { delete_at });
            if (!deletedCategory) {
                throw new Error("Menu category not found");
            }
            return deletedCategory;
        });
    }
}
