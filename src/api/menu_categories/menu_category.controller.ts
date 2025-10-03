import { MenuCategoryService } from "./menu_category.service.js";
import { Request, Response } from "express";

export class MenuCategoryController {
    private menuCategoryService: MenuCategoryService;

    constructor() {
        this.menuCategoryService = new MenuCategoryService();
    }

    async findAll(req: Request, res: Response) {
        try {
            const categories = await this.menuCategoryService.findAll();
            res.status(200).json({
                message: "Menu categories retrieved successfully",
                data: categories,
            });
        } catch (error : string | any) {
            res.status(500).json({ message: error.message });
        }
    }
    async findAllWithCount(req: Request, res: Response) {
        try {
            const categories = await this.menuCategoryService.findAllWithCount();
            res.status(200).json({
                message: "Menu categories with count retrieved successfully",
                data: categories,
            });
        } catch (error : string | any) {
            res.status(500).json({ message: error.message });
        }
    }
    async findById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        try {
            const category = await this.menuCategoryService.findById(id);
            res.status(200).json({
                message: "Menu category retrieved successfully",
                data: category,
            });
        } catch (error : string | any) {
            res.status(404).json({ message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const createdCategory = await this.menuCategoryService.create(req.body);
            res.status(201).json({
                message: "Menu category created successfully",
                data: createdCategory,
            });
        } catch (error : string | any) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        try {
            const updatedCategory = await this.menuCategoryService.update(id, req.body);
            res.status(200).json({
                message: "Menu category updated successfully",
                data: updatedCategory,
            });
        } catch (error : string | any) {
            res.status(404).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        try {
            const deletedCategory = await this.menuCategoryService.delete(id);
            res.status(200).json({
                message: "Menu category deleted successfully",
                data: deletedCategory,
            });
        } catch (error : string | any) {
            res.status(404).json({ message: error.message });
        }
    }
}