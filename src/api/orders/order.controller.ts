import { OrderService } from "./order.service.js";
import { Request, Response } from "express";
import { CustomRequest } from "../../middleware/auth.js";
import { Order, UserInfo } from "../../types/order.types.js";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }
  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await this.orderService.getAllOrders();
      res.status(200).json({
        message: "Orders fetched successfully",
        data: orders,
      });
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getOrderByUser(req: CustomRequest, res: Response) {
    const user_id = Number(req.user?.userId);
    try {
      const orders = await this.orderService.getOrderByUser(user_id);
      res.status(200).json({
        message: "Orders by user fetched successfully",
        data: orders,
      });
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getOrderById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const order = await this.orderService.getOrderById(id);
      res.status(200).json({
        message: "Order fetched successfully",
        data: order,
      });
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }

  }
  async getDailyOrders(req: Request, res: Response) {
    try {
      const orders = await this.orderService.getDailyOrders();
      res.status(200).json({
        message: "Daily orders fetched successfully",
        data: orders,
      });
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getOrdersByRange(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const orders = await this.orderService.getOrdersByRange(
        startDate as string | undefined,
        endDate as string | undefined
      );
      res.status(200).json({
        message: "Orders retrieved successfully",
        data: orders,
        range: { startDate, endDate },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
  async create(req: CustomRequest, res: Response) {
    try {
      const inputData: Order = req.body;
      const newOrder = await this.orderService.create(inputData);
      res.status(201).json(newOrder);
    } catch (error: string | any) {
      res.status(500).json({ error });
    }
  }
  async update(req: CustomRequest, res: Response) {
    const id = parseInt(req.params.id);
    let userInfo: UserInfo | null = null;
    if (req.user?.role.name === "Kasir") {
      userInfo = {
        userId: Number(req.user.userId),
        role: req.user?.role.name,
      };
    }
    const data = req.body;
    try {
      await this.orderService.getOrderById(id);
      const updatedOrder = await this.orderService.updateOrder(
        id,
        data,
        userInfo
      );
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json({
        message: "Order updated successfully",
        data: updatedOrder,
      });
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const deletedOrder = await this.orderService.deleteOrder(id);
      if (!deletedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(204).send({
        message: "Order deleted successfully",
      });
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getHistoryPointByUser(req: CustomRequest, res: Response) {
    const id_user = Number(req.user?.userId);
    try {
      const historyPoints = await this.orderService.getHistoryPointByUser(
        id_user
      );
      res.status(200).json({
        message: "History points by user fetched successfully",
        data: historyPoints,
      });
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
}
