import { UserService } from "./user.service.js";
import { Request, Response } from "express";
import { CustomRequest } from "../../middleware/auth.js";
import { parse } from "path";
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({
        message: "Users retrieved successfully",
        users,
      });
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUsersByRole(req: Request, res: Response) {
    try {
      const users = await this.userService.getUsersByRole(req.params.role);
      res.json(users);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req: CustomRequest, res: Response) {
    const userId = Number(req.user?.userId);
    try {
      const textData = req.body;
      let newData = { ...textData };
      if (req.file) {
        const imagePath = req.file.path.split("uploads")[1].replace(/\\/g, "/");
        newData.img_url = `uploads${imagePath}`;
      }
      const user = await this.userService.updateUser(userId, newData);
      res.status(200).json({
        message: "User updated successfully",
        data: user,
      });
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async updateEmail(req: CustomRequest, res: Response) {
    const userId = Number(req.user?.userId);
    try {
      const textData = req.body;
      let newData = { ...textData };
      const user = await this.userService.updateEmail(userId, newData);
      res.status(200).json({
        message: "Email updated successfully",
        data: user,
      });
    } catch (error: string | any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      res.status(status).json({ error: message });
    }
  }
  async changePassword(req: CustomRequest, res: Response) {
    const userId = Number(req.user?.userId);
    try {
      const textData = req.body;
      let newData = { ...textData };
      const result = await this.userService.changePassword(userId, newData);
      res.status(200).json({
        message: "Password changed successfully",
        data: result,
      });
    } catch (error: string | any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      res.status(status).json({ error: message });
    }
  }
  async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    try {
      await this.userService.deleteUser(userId);
      res.status(204).send();
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async createFavoriteMenu(req: CustomRequest, res: Response) {
    const userId = Number(req.user?.userId);
    const menuId = Number(req.params.id);
    try {
      const favoriteMenu = await this.userService.createFavoriteMenu(
        userId,
        menuId
      );
      res.status(201).json(favoriteMenu);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getAllFavoriteMenus(req: CustomRequest, res: Response) {
    const userId = Number(req.user?.userId);
    try {
      const favoriteMenus = await this.userService.getAllFavoriteMenus(userId);
      res.status(200).json(favoriteMenus);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async deleteFavoriteMenu(req: CustomRequest, res: Response) {
    const userId = Number(req.user?.userId);
    const menuId = Number(req.params.id);
    try {
      await this.userService.deleteFavoriteMenu(userId, menuId);
      res.status(204).send();
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getAllCustomersWithStats(req: Request, res: Response) {
    try {
      const customers = await this.userService.findAllCustomersWithStats();
      res.status(200).json({
        message: "Customers with statistics retrieved successfully",
        data: customers,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
  async updateStatus(req: Request, res: Response) {
    const userId = Number(req.params.id);
    const { status } = req.body;
    try {
      const updatedUser = await this.userService.updateUser(userId, { status });
      res.status(200).json({
        message: "User status updated successfully",
        data: updatedUser,
      });
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
}
