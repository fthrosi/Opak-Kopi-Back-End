var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MenuCategoryService } from "./menu_category.service.js";
export class MenuCategoryController {
    constructor() {
        this.menuCategoryService = new MenuCategoryService();
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.menuCategoryService.findAll();
                res.status(200).json({
                    message: "Menu categories retrieved successfully",
                    data: categories,
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    findAllWithCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.menuCategoryService.findAllWithCount();
                res.status(200).json({
                    message: "Menu categories with count retrieved successfully",
                    data: categories,
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const category = yield this.menuCategoryService.findById(id);
                res.status(200).json({
                    message: "Menu category retrieved successfully",
                    data: category,
                });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdCategory = yield this.menuCategoryService.create(req.body);
                res.status(201).json({
                    message: "Menu category created successfully",
                    data: createdCategory,
                });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const updatedCategory = yield this.menuCategoryService.update(id, req.body);
                res.status(200).json({
                    message: "Menu category updated successfully",
                    data: updatedCategory,
                });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const deletedCategory = yield this.menuCategoryService.delete(id);
                res.status(200).json({
                    message: "Menu category deleted successfully",
                    data: deletedCategory,
                });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
}
