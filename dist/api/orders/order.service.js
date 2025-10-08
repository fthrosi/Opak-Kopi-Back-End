var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { OrderRepository } from "./order.repository.js";
import { MenuRepository } from "../menus/menu.repository.js";
import { PromoRepository } from "../promos/promo.repository.js";
import { UserRepository } from "../users/user.repository.js";
import crypto from "crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { PaymentService } from "../payment/payment.service.js";
import { NotificationService } from "../../socket/notification.service.js";
dayjs.extend(utc);
dayjs.extend(timezone);
export class OrderService {
    constructor() {
        this.orderRepository = new OrderRepository();
        this.menuRepository = new MenuRepository();
        this.promoRepository = new PromoRepository();
        this.paymentService = new PaymentService();
        this.userRepository = new UserRepository();
    }
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.orderRepository.getAllOrders();
            }
            catch (error) {
                throw new Error("Error fetching orders");
            }
        });
    }
    getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.orderRepository.getOrderById(id);
            }
            catch (error) {
                throw new Error("Error fetching order");
            }
        });
    }
    getOrderByUser(id_user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.orderRepository.getOrderByUser(id_user);
                orders.forEach((order) => {
                    const orderItems = order.order_items;
                    orderItems.forEach((item) => {
                        if (item.menu && item.menu.image_url) {
                            item.menu.image_url = `${process.env.BASE_URL}/${item.menu.image_url}`;
                        }
                    });
                });
                return orders;
            }
            catch (error) {
                throw new Error("Error fetching orders by user");
            }
        });
    }
    getOrderByOrderCode(order_code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.orderRepository.getOrderByOrderCode(order_code);
            }
            catch (error) {
                throw new Error("Error fetching order by order code");
            }
        });
    }
    getDailyOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const today = dayjs().tz("Asia/Jakarta");
            const startOfDay = today.startOf("day").format("YYYY-MM-DD HH:mm:ss") + "Z";
            const endOfDay = today.endOf("day").format("YYYY-MM-DD HH:mm:ss") + "Z";
            return yield this.orderRepository.getDailyOrders(startOfDay, endOfDay);
        });
    }
    getOrdersByRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            let start, end;
            if (startDate &&
                endDate &&
                startDate.trim() !== "" &&
                endDate.trim() !== "") {
                start =
                    dayjs(startDate)
                        .tz("Asia/Jakarta")
                        .startOf("day")
                        .format("YYYY-MM-DD 00:00:00") + "Z";
                end =
                    dayjs(endDate)
                        .tz("Asia/Jakarta")
                        .endOf("day")
                        .format("YYYY-MM-DD 23:59:59") + "Z";
            }
            else {
                const now = dayjs().tz("Asia/Jakarta");
                start = now.startOf("month").format("YYYY-MM-DD 00:00:00") + "Z";
                end = now.endOf("month").format("YYYY-MM-DD 23:59:59") + "Z";
            }
            return yield this.orderRepository.getOrdersByRange(start, end);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const { userId } = data, orderData = __rest(data, ["userId"]);
            let total = 0;
            const orderItems = [];
            let diskon = 0;
            let point_value_used = 0;
            let customer_name = (orderData === null || orderData === void 0 ? void 0 : orderData.customer_name) || "";
            let cashier_name = "";
            let totalPrice = 0;
            let status = "";
            let user = null;
            let isCode = true;
            let order_code = "";
            while (isCode) {
                const code = crypto.randomBytes(4).toString("hex");
                order_code = `ORD-${code.toUpperCase()}`;
                const code_check = yield this.orderRepository.getOrderByOrderCode(order_code);
                if (!code_check) {
                    isCode = false;
                }
            }
            if (userId) {
                user = yield this.userRepository.findById(Number(userId));
                if (!user) {
                    throw new Error(`User with ID ${userId} not found`);
                }
                user.role.name === "Pelanggan"
                    ? (customer_name = user.name)
                    : (cashier_name = user.name);
                if (orderData.point_use && orderData.point_use < ((_a = user.poin) !== null && _a !== void 0 ? _a : 0)) {
                    if ((user.poin || 0) < orderData.point_use) {
                        throw new Error("Insufficient points");
                    }
                    point_value_used = orderData.point_use * 100;
                }
            }
            status = user
                ? user.role.name === "Pelanggan"
                    ? "Menunggu Pembayaran"
                    : "Diproses"
                : "Menunggu Pembayaran";
            for (const item of orderData.order_items) {
                const menu = yield this.menuRepository.findById(item.menu_id);
                if (!menu) {
                    throw new Error(`Menu with ID ${item.menu_id} not found`);
                }
                const subtotal = menu.current_price * item.quantity;
                total += subtotal;
                orderItems.push({
                    menu: {
                        connect: { id: item.menu_id },
                    },
                    quantity: item.quantity,
                    name_menu: menu.name,
                    price_at_transaction: menu.current_price,
                    cogs_at_transaction: menu.current_cogs,
                    subtotal,
                });
            }
            let promo = null;
            if (orderData.promo_id) {
                promo = yield this.promoRepository.findById(Number(orderData.promo_id));
                if (!promo) {
                    throw new Error(`Promo with ID ${orderData.promo_id} not found`);
                }
                diskon =
                    promo.promo_type === "percent"
                        ? (((_b = promo.percent_value) !== null && _b !== void 0 ? _b : 0) / 100) * total
                        : (_c = promo.amount_value) !== null && _c !== void 0 ? _c : 0;
            }
            totalPrice = total - diskon - point_value_used;
            const nowString = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
            const createdAt = nowString + "Z";
            const updatedAt = nowString + "Z";
            const OrderDatas = {
                total_price: totalPrice,
                order_code: order_code,
                customer_name: customer_name,
                cashier_name: cashier_name,
                status: status,
                table: {
                    connect: { id: data.table_id },
                },
                promo_value: diskon !== null && diskon !== void 0 ? diskon : 0,
                points_value_used: point_value_used !== null && point_value_used !== void 0 ? point_value_used : 0,
                note: (_d = data.note) !== null && _d !== void 0 ? _d : "",
                created_at: createdAt,
                updated_at: updatedAt,
                payment_method: data.payment_method || "",
            };
            user
                ? (user === null || user === void 0 ? void 0 : user.role.name) === "Pelanggan"
                    ? (OrderDatas.customer = {
                        connect: { id: userId },
                    })
                    : (OrderDatas.cashier = {
                        connect: { id: userId },
                    })
                : "";
            user
                ? promo
                    ? (OrderDatas.promo = {
                        connect: { id: promo.id },
                    })
                    : ""
                : "";
            try {
                const order = yield this.orderRepository.createOrder(OrderDatas, orderItems);
                if (user) {
                    let point_user = user.poin;
                    if (data.point_use && data.point_use < ((_e = user.poin) !== null && _e !== void 0 ? _e : 0)) {
                        const historyPoint = {
                            user: {
                                connect: {
                                    id: user.id,
                                },
                            },
                            order: {
                                connect: {
                                    id: order.id,
                                },
                            },
                            amount: data.point_use,
                            type: "Pembelanjaan",
                        };
                        point_user = (point_user !== null && point_user !== void 0 ? point_user : 0) - data.point_use;
                        yield this.userRepository.update(user.id, {
                            poin: point_user,
                        });
                        yield this.orderRepository.createHistoryPoint(historyPoint);
                    }
                }
                if (data.payment_method !== "Tunai" && (user === null || user === void 0 ? void 0 : user.role.name) !== "Kasir") {
                    const paymentItems = order.order_items.map((item) => ({
                        id: String(item.menu_id),
                        name: item.name_menu,
                        price: item.price_at_transaction,
                        quantity: item.quantity,
                    }));
                    // 2. Tambahkan diskon sebagai item negatif jika ada
                    if (diskon > 0) {
                        paymentItems.push({
                            id: "PROMO_DISCOUNT",
                            name: promo ? `Diskon ${promo.name}` : "Diskon Promo",
                            price: -Math.round(diskon),
                            quantity: 1,
                        });
                    }
                    // 3. Tambahkan potongan poin sebagai item negatif jika ada
                    if (point_value_used > 0) {
                        paymentItems.push({
                            id: "POINTS_REDEMPTION",
                            name: "Potongan Poin",
                            price: -Math.round(point_value_used),
                            quantity: 1,
                        });
                    }
                    const paymentData = {
                        orderId: order.order_code,
                        amount: Math.round(order.total_price),
                        customerDetails: {
                            first_name: order.customer_name || "Guest",
                            email: ((_f = order.customer) === null || _f === void 0 ? void 0 : _f.email) || "guest@example.com",
                            phone: ((_g = order.customer) === null || _g === void 0 ? void 0 : _g.phone) || "",
                        },
                        items: paymentItems,
                    };
                    const payment = yield this.paymentService.createPayment(paymentData);
                    // Update order dengan payment URL
                    yield this.orderRepository.updateOrder(order.id, {
                        payment_url: payment.redirect_url,
                        payment_token: payment.token,
                        status: "Menunggu Pembayaran",
                    });
                    // // Tambahkan payment info ke order
                    return Object.assign(Object.assign({}, order), { payment_url: payment.redirect_url, payment_token: payment.token });
                }
                else {
                    yield this.orderRepository.updateOrder(order.id, {
                        status: "Diproses",
                    });
                    return order;
                }
            }
            catch (error) {
                throw new Error(`Error creating order: ${error.message}`);
            }
        });
    }
    updateOrder(id, data, userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let cashier = null;
            if (userInfo) {
                cashier = yield this.userRepository.findById(Number(userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId));
            }
            const nowString = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
            const updatedAt = nowString + "Z";
            const newData = Object.assign(Object.assign({}, data), { cashier_id: cashier === null || cashier === void 0 ? void 0 : cashier.id, cashier_name: cashier === null || cashier === void 0 ? void 0 : cashier.name, updated_at: updatedAt });
            try {
                const currentOrder = yield this.orderRepository.getOrderById(id);
                if (!currentOrder) {
                    throw new Error("Order not found");
                }
                const update = yield this.orderRepository.updateOrder(id, newData);
                if (update.status === "Selesai") {
                    const user = yield this.userRepository.findById(Number(update.customer_id));
                    if (update.total_price > 15000 && user) {
                        const earned = Math.floor(update.total_price / 1000);
                        const historyPoint = {
                            user: {
                                connect: {
                                    id: user === null || user === void 0 ? void 0 : user.id,
                                },
                            },
                            order: {
                                connect: {
                                    id: update.id,
                                },
                            },
                            amount: earned,
                            type: "Pendapatan",
                        };
                        user.poin = ((_a = user.poin) !== null && _a !== void 0 ? _a : 0) + earned;
                        yield this.userRepository.update(user.id, {
                            poin: user.poin,
                        });
                        yield this.orderRepository.createHistoryPoint(historyPoint);
                    }
                }
                NotificationService.sendOrderStatusUpdateNotification(update);
                return update;
            }
            catch (error) {
                throw new Error("Error updating order");
            }
        });
    }
    deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentOrder = yield this.orderRepository.getOrderById(id);
                if (!currentOrder) {
                    throw new Error("Order not found");
                }
                return yield this.orderRepository.deleteOrder(id);
            }
            catch (error) {
                throw new Error("Error deleting order");
            }
        });
    }
    deleteOrderItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.orderRepository.deleteOrderItem(id);
            }
            catch (error) {
                throw new Error("Error deleting order item");
            }
        });
    }
    markOrderAsRated(orderItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.orderRepository.markAsRated(orderItemId);
            }
            catch (error) {
                throw new Error("Error marking order as rated");
            }
        });
    }
    getHistoryPointByUser(id_user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.orderRepository.getHistoryPointByUser(id_user);
            }
            catch (error) {
                throw new Error("Error fetching history points by user");
            }
        });
    }
}
