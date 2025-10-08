var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../../config/db.js";
export class MenuRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.menu.findMany({
                where: { delete_at: null },
                select: {
                    id: true,
                    name: true,
                    current_price: true,
                    current_cogs: true,
                    description: true,
                    image_url: true,
                    status: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.menu.findUnique({
                where: { id, delete_at: null },
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
            });
        });
    }
    findByCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.menu.findMany({
                where: { category_id: categoryId, delete_at: null },
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
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.menu.create({
                data,
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.menu.update({
                where: { id },
                data,
            });
        });
    }
    delete(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.menu.update({
                where: { id },
                data,
            });
        });
    }
}
