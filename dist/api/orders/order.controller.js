var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OrderService } from "./order.service.js";
export class OrderController {
    constructor() {
        this.orderService = new OrderService();
    }
    getAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.orderService.getAllOrders();
                res.status(200).json({
                    message: "Orders fetched successfully",
                    data: orders,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getOrderByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user_id = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            try {
                const orders = yield this.orderService.getOrderByUser(user_id);
                res.status(200).json({
                    message: "Orders by user fetched successfully",
                    data: orders,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getOrderById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const order = yield this.orderService.getOrderById(id);
                res.status(200).json({
                    message: "Order fetched successfully",
                    data: order,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getDailyOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.orderService.getDailyOrders();
                res.status(200).json({
                    message: "Daily orders fetched successfully",
                    data: orders,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getOrdersByRange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const orders = yield this.orderService.getOrdersByRange(startDate, endDate);
                res.status(200).json({
                    message: "Orders retrieved successfully",
                    data: orders,
                    range: { startDate, endDate },
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message || "Internal server error" });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const inputData = req.body;
                const newOrder = yield this.orderService.create(inputData);
                res.status(201).json(newOrder);
            }
            catch (error) {
                console.error("Error in create order:", error);
                res.status(500).json({ error });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const id = parseInt(req.params.id);
            let userInfo = null;
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role.name) === "Kasir") {
                userInfo = {
                    userId: Number(req.user.userId),
                    role: (_b = req.user) === null || _b === void 0 ? void 0 : _b.role.name,
                };
            }
            const data = req.body;
            try {
                yield this.orderService.getOrderById(id);
                const updatedOrder = yield this.orderService.updateOrder(id, data, userInfo);
                if (!updatedOrder) {
                    return res.status(404).json({ error: "Order not found" });
                }
                res.status(200).json({
                    message: "Order updated successfully",
                    data: updatedOrder,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const deletedOrder = yield this.orderService.deleteOrder(id);
                if (!deletedOrder) {
                    return res.status(404).json({ error: "Order not found" });
                }
                res.status(204).send({
                    message: "Order deleted successfully",
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getHistoryPointByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id_user = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            try {
                const historyPoints = yield this.orderService.getHistoryPointByUser(id_user);
                res.status(200).json({
                    message: "History points by user fetched successfully",
                    data: historyPoints,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
