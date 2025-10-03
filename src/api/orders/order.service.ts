import { OrderRepository } from "./order.repository.js";
import { MenuRepository } from "../menus/menu.repository.js";
import { PromoRepository } from "../promos/promo.repository.js";
import { UserRepository } from "../users/user.repository.js";
import { Prisma } from "@prisma/client";
import { Order, UserInfo } from "../../types/order.types.js";
import crypto from "crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);

export class OrderService {
  private orderRepository: OrderRepository;
  private menuRepository: MenuRepository;
  private promoRepository: PromoRepository;
  private userRepository: UserRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.menuRepository = new MenuRepository();
    this.promoRepository = new PromoRepository();
    this.userRepository = new UserRepository();
  }
  async getAllOrders() {
    try {
      return await this.orderRepository.getAllOrders();
    } catch (error) {
      throw new Error("Error fetching orders");
    }
  }
  async getOrderById(id: number) {
    try {
      return await this.orderRepository.getOrderById(id);
    } catch (error) {
      throw new Error("Error fetching order");
    }
  }
  async getOrderByUser(id_user: number) {
    try {
      const orders = await this.orderRepository.getOrderByUser(id_user);
      orders.forEach((order) => {
        const orderItems = order.order_items;
        orderItems.forEach((item) => {
          if (item.menu && item.menu.image_url) {
            item.menu.image_url = `${process.env.BASE_URL}/${item.menu.image_url}`;
          }
        });
      });
      return orders;
    } catch (error) {
      throw new Error("Error fetching orders by user");
    }
  }
  async getDailyOrders() {
    const today = dayjs().tz("Asia/Jakarta");
    const startOfDay = today.startOf("day").format("YYYY-MM-DD HH:mm:ss") + "Z";
    const endOfDay = today.endOf("day").format("YYYY-MM-DD HH:mm:ss") + "Z";

    return await this.orderRepository.getDailyOrders(startOfDay, endOfDay);
  }
  async getOrdersByRange(startDate?: string, endDate?: string) {
    let start, end;

    if (
      startDate &&
      endDate &&
      startDate.trim() !== "" &&
      endDate.trim() !== ""
    ) {
      start =
        dayjs(startDate)
          .tz("Asia/Jakarta")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00") + "Z";
      end =
        dayjs(endDate).tz("Asia/Jakarta").endOf("day").format("YYYY-MM-DD 23:59:59") +
        "Z";
    } else {
      const now = dayjs().tz("Asia/Jakarta");
      start = now.startOf("month").format("YYYY-MM-DD 00:00:00") + "Z";
      end = now.endOf("month").format("YYYY-MM-DD 23:59:59") + "Z";
    }
    return await this.orderRepository.getOrdersByRange(start, end);
  }
  async create(data: Order) {
    const { userId, ...orderData } = data;
    let total = 0;
    const orderItems = [];
    let diskon = 0;
    let point_value_used = 0;
    let customer_name = orderData?.customer_name || "";
    let cashier_name = "";
    let totalPrice = 0;
    let status = "";
    let user = null;
    const code = crypto.randomBytes(4).toString("hex");
    const order_code = `ORD-${code.toUpperCase()}`;

    if (userId) {
      user = await this.userRepository.findById(Number(userId));
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      user.role.name === "Pelanggan"
        ? (customer_name = user.name)
        : (cashier_name = user.name);
      if (orderData.point_use && orderData.point_use < (user.poin ?? 0)) {
        if ((user.poin || 0) < orderData.point_use) {
          throw new Error("Insufficient points");
        }
        point_value_used = orderData.point_use * 100;
      }
    }
    status = user
      ? user.role.name === "Pelanggan"
        ? "Dikirim"
        : "Diproses"
      : "Dikirim";

    for (const item of orderData.order_items) {
      const menu = await this.menuRepository.findById(item.menu_id);
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
      promo = await this.promoRepository.findById(Number(orderData.promo_id));
      if (!promo) {
        throw new Error(`Promo with ID ${orderData.promo_id} not found`);
      }
      diskon =
        promo.promo_type === "percent"
          ? ((promo.percent_value ?? 0) / 100) * total
          : promo.amount_value ?? 0;
    }

    totalPrice = total - diskon - point_value_used;

    const nowString = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    const createdAt = nowString + "Z";
    const updatedAt = nowString + "Z";
    const OrderDatas: Prisma.OrderCreateInput = {
      total_price: totalPrice,
      order_code: order_code,
      customer_name: customer_name,
      cashier_name: cashier_name,
      status: status,
      table: {
        connect: { id: data.table_id },
      },
      promo_value: diskon ?? 0,
      points_value_used: point_value_used ?? 0,
      note: data.note ?? "",
      created_at: createdAt,
      updated_at: updatedAt,
    };

    user
      ? user?.role.name === "Pelanggan"
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
      const order = await this.orderRepository.createOrder(
        OrderDatas,
        orderItems
      );
      if (user) {
        let point_user = user.poin;
        if (data.point_use && data.point_use < (user.poin ?? 0)) {
          const historyPoint: Prisma.PointHistoryCreateInput = {
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
          point_user = (point_user ?? 0) - data.point_use;
          await this.userRepository.update(user.id, {
            poin: point_user,
          });
          await this.orderRepository.createHistoryPoint(historyPoint);
        }
      }
      return order;
    } catch (error: string | any) {
      throw new Error(`Error creating order: ${error}`);
    }
  }
  async updateOrder(
    id: number,
    data: Prisma.OrderUpdateInput,
    userInfo: UserInfo | null
  ) {
    let cashier = null;
    if (userInfo) {
      cashier = await this.userRepository.findById(Number(userInfo?.userId));
    }
    const nowString = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    const updatedAt = nowString + "Z";
    const newData = {
      ...data,
      cashier_id: cashier?.id,
      cashier_name: cashier?.name,
      updated_at: updatedAt,
    };
    try {
      const currentOrder = await this.orderRepository.getOrderById(id);
      if (!currentOrder) {
        throw new Error("Order not found");
      }
      const update = await this.orderRepository.updateOrder(id, newData);
      if (update.status === "Selesai") {
        const user = await this.userRepository.findById(
          Number(update.customer_id)
        );
        if (update.total_price > 15000 && user) {
          const earned = Math.floor(update.total_price / 1000);
          const historyPoint: Prisma.PointHistoryCreateInput = {
            user: {
              connect: {
                id: user?.id,
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
          user.poin = (user.poin ?? 0) + earned;
          await this.userRepository.update(user.id, {
            poin: user.poin,
          });
          await this.orderRepository.createHistoryPoint(historyPoint);
        }
      }
      return update;
    } catch (error) {
      throw new Error("Error updating order");
    }
  }
  async deleteOrder(id: number) {
    try {
      const currentOrder = await this.orderRepository.getOrderById(id);
      if (!currentOrder) {
        throw new Error("Order not found");
      }
      return await this.orderRepository.deleteOrder(id);
    } catch (error) {
      throw new Error("Error deleting order");
    }
  }
  async deleteOrderItem(id: number) {
    try {
      return await this.orderRepository.deleteOrderItem(id);
    } catch (error) {
      throw new Error("Error deleting order item");
    }
  }

  async markOrderAsRated(orderItemId: number) {
    try {
      return await this.orderRepository.markAsRated(orderItemId);
    } catch (error) {
      throw new Error("Error marking order as rated");
    }
  }
  async getHistoryPointByUser(id_user: number) {
    try {
      return await this.orderRepository.getHistoryPointByUser(id_user);
    } catch (error) {
      throw new Error("Error fetching history points by user");
    }
  }
}
