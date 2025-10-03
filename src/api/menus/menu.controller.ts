import { Menu } from "@prisma/client";
import { MenuService } from "./menu.service.js";
import { Request, Response } from "express";
import { text } from "stream/consumers";

export class MenuController {
  private menuService: MenuService;
  constructor() {
    this.menuService = new MenuService();
  }
  async findAll(req: Request, res: Response) {
    try {
      const menus = await this.menuService.findAll();
      res.status(200).json({
        message: "Menus retrieved successfully",
        data: menus,
      });
    } catch (error: string | any) {
      res.status(500).json({ message: error.message });
    }
  }
  async findById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const menu = await this.menuService.findById(id);
      res.status(200).json({
        message: "Menu retrieved successfully",
        data: menu,
      });
    } catch (error: string | any) {
      res.status(404).json({ message: error.message });
    }
  }
  async findByCategory(req: Request, res: Response) {
    const categoryId = parseInt(req.params.categoryId);
    try {
      const menus = await this.menuService.findByCategory(categoryId);
      res.status(200).json({
        message: "Menus by category retrieved successfully",
        data: menus,
      });
    } catch (error: string | any) {
      res.status(404).json({ message: error.message });
    }
  }
  async create(req: Request, res: Response) {
    try {
      const Menu = req.body;
      Menu.category_id = parseInt(req.body.category_id);
      Menu.current_price = parseFloat(req.body.current_price);
      Menu.current_cogs = parseFloat(req.body.current_cogs);
      let creatMenu = { ...Menu };
      if (req.file) {
        const imagePath = req.file.path.split("uploads")[1].replace(/\\/g, "/");
        creatMenu.image_url = `uploads${imagePath}`;
      }
      const createdMenu = await this.menuService.create(creatMenu);
      res.status(201).json({
        message: "Menu created successfully",
        data: createdMenu,
      });
    } catch (error: string | any) {
      res.status(400).json({ message: error.message });
    }
  }
  async update(req: Request, res: Response) {
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

      let newData = { ...textData };
      if (req.file) {
        const imagePath = req.file.path.split("uploads")[1].replace(/\\/g, "/");
        newData.image_url = `uploads${imagePath}`; // Assuming req.file.path contains the image URL
      }
      const updatedMenu = await this.menuService.update(id, newData);
      res.status(200).json({
        message: "Menu updated successfully",
        data: updatedMenu,
      });
    } catch (error: string | any) {
      res.status(404).json({ message: error.message });
    }
  }
  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const deletedMenu = await this.menuService.delete(id);
      res.status(200).json({
        message: "Menu deleted successfully",
        data: deletedMenu,
      });
    } catch (error: string | any) {
      res.status(404).json({ message: error.message });
    }
  }
}
