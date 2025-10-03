import { OrderController } from "./order.controller.js";
import { Router } from "express";
import { validateToken,validateRole } from "../../middleware/auth.js";
import { updateOrderBody } from "../../middleware/order.js";

const orderController = new OrderController();
const orderRouter = Router();

orderRouter.get("/all",validateToken,validateRole(["Kasir","Owner"]), (req,res) => orderController.getAllOrders(req, res));
orderRouter.get("/history",validateToken,validateRole(["Owner"]), (req,res) => orderController.getOrdersByRange(req, res));
orderRouter.get("/user",validateToken,validateRole(["Pelanggan"]), (req,res) => orderController.getOrderByUser(req, res));
orderRouter.get("/daily",validateToken,validateRole(["Kasir","Owner"]), (req,res) => orderController.getDailyOrders(req, res));
orderRouter.post("/add",(req,res) => orderController.create(req, res));
orderRouter.put("/update/:id",validateToken,validateRole(["Pelanggan","Kasir"]),updateOrderBody, (req,res) => orderController.update(req, res));
orderRouter.delete("/delete/:id",validateToken, (req,res) => orderController.delete(req, res));
orderRouter.get("/history-point",validateToken,validateRole(["Pelanggan"]), (req,res) => orderController.getHistoryPointByUser(req, res));
export default orderRouter;
