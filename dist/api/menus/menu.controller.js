var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MenuService } from "./menu.service.js";
export class MenuController {
    constructor() {
        this.menuService = new MenuService();
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menus = yield this.menuService.findAll();
                res.status(200).json({
                    message: "Menus retrieved successfully",
                    data: menus,
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
                const menu = yield this.menuService.findById(id);
                res.status(200).json({
                    message: "Menu retrieved successfully",
                    data: menu,
                });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    findByCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryId = parseInt(req.params.categoryId);
            try {
                const menus = yield this.menuService.findByCategory(categoryId);
                res.status(200).json({
                    message: "Menus by category retrieved successfully",
                    data: menus,
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
                const Menu = req.body;
                Menu.category_id = parseInt(req.body.category_id);
                Menu.current_price = parseFloat(req.body.current_price);
                Menu.current_cogs = parseFloat(req.body.current_cogs);
                let creatMenu = Object.assign({}, Menu);
                if (req.file) {
                    const imagePath = req.file.path.split("uploads")[1].replace(/\\/g, "/");
                    creatMenu.image_url = `uploads${imagePath}`;
                }
                const createdMenu = yield this.menuService.create(creatMenu);
                res.status(201).json({
                    message: "Menu created successfully",
                    data: createdMenu,
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
                const textData = req.body;
                if (textData.current_price) {
                    textData.current_price = parseFloat(req.body.current_price);
                }
                if (textData.current_cogs) {
                    textData.current_cogs = parseFloat(req.body.current_cogs);
                }
                if (textData.category_id) {
                    textData.category_id = parseInt(req.body.category_id);
                }
                let newData = Object.assign({}, textData);
                if (req.file) {
                    const imagePath = req.file.path.split("uploads")[1].replace(/\\/g, "/");
                    newData.image_url = `uploads${imagePath}`; // Assuming req.file.path contains the image URL
                }
                const updatedMenu = yield this.menuService.update(id, newData);
                res.status(200).json({
                    message: "Menu updated successfully",
                    data: updatedMenu,
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
                const deletedMenu = yield this.menuService.delete(id);
                res.status(200).json({
                    message: "Menu deleted successfully",
                    data: deletedMenu,
                });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
}
