var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MenuRepository } from "./menu.repository.js";
import fs from "fs/promises";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);
export class MenuService {
    constructor() {
        this.menuRepository = new MenuRepository();
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menus = yield this.menuRepository.findAll();
                menus.forEach((menu) => {
                    menu.image_url = `${process.env.BASE_URL}/${menu.image_url}`;
                });
                return menus;
            }
            catch (error) {
                throw new Error("Failed to retrieve menus");
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const menu = yield this.menuRepository.findById(id);
            if (!menu) {
                throw new Error("Menu not found");
            }
            return menu;
        });
    }
    findByCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const menus = yield this.menuRepository.findByCategory(categoryId);
            return menus;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdMenu = yield this.menuRepository.create(data);
            if (!createdMenu) {
                throw new Error("Menu creation failed");
            }
            return createdMenu;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentMenu = yield this.menuRepository.findById(id);
            if (!currentMenu) {
                throw new Error("Menu not found");
            }
            if (data.image_url && currentMenu.image_url) {
                try {
                    yield fs.unlink(currentMenu.image_url);
                }
                catch (error) {
                    throw new Error("Failed to delete old image");
                }
            }
            if (data.category_id) {
                data.category = { connect: { id: data.category_id } };
                delete data.category_id;
            }
            const updatedMenu = yield this.menuRepository.update(id, data);
            if (!updatedMenu) {
                throw new Error("Menu update failed");
            }
            return updatedMenu;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nowString = dayjs()
                    .tz("Asia/Jakarta")
                    .format("YYYY-MM-DD HH:mm:ss");
                const delete_at = nowString + "Z";
                return yield this.menuRepository.update(id, { delete_at });
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
