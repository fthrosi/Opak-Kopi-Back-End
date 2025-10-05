import prisma from "../../config/db.js";
import { Prisma } from "@prisma/client";

export class OrderRepository {
  async getAllOrders() {
    return await prisma.order.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        cashier: {
          select: {
            id: true,
            name: true,
          },
        },
        table: {
          select: {
            id: true,
            number: true,
          },
        },
        promo: {
          select: {
            id: true,
            promo_code: true,
            name: true,
            promo_type: true,
            percent_value: true,
            amount_value: true,
          },
        },
        order_items: {
          select: {
            id: true,
            menu: {
              select: {
                id: true,
                name: true,
              },
            },
            name_menu: true,
            quantity: true,
            price_at_transaction: true,
            cogs_at_transaction: true,
            subtotal: true,
          },
        },
      },
    });
  }
  async getOrderById(id_order: number) {
    return await prisma.order.findUnique({
      where: { id: id_order },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        cashier: {
          select: {
            id: true,
            name: true,
          },
        },
        table: {
          select: {
            id: true,
            number: true,
          },
        },
        promo: {
          select: {
            id: true,
            promo_code: true,
            name: true,
            promo_type: true,
            percent_value: true,
            amount_value: true,
          },
        },
        order_items: {
          select: {
            id: true,
            menu: {
              select: {
                id: true,
                name: true,
                image_url: true,
              },
            },
            name_menu: true,
            quantity: true,
            price_at_transaction: true,
            cogs_at_transaction: true,
            subtotal: true,
          },
        },
        point_history: {
          select: {
            id: true,
            type: true,
            amount: true,
          },
        },
      },
    });
  }
  async getOrderByUser(id_user: number) {
    return await prisma.order.findMany({
      where: {
        customer_id: id_user,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        cashier: {
          select: {
            id: true,
            name: true,
          },
        },
        table: {
          select: {
            id: true,
            number: true,
          },
        },
        promo: {
          select: {
            id: true,
            promo_code: true,
            name: true,
            promo_type: true,
            percent_value: true,
            amount_value: true,
          },
        },
        order_items: {
          select: {
            id: true,
            menu: {
              select: {
                id: true,
                name: true,
                image_url: true,
              },
            },
            name_menu: true,
            quantity: true,
            price_at_transaction: true,
            cogs_at_transaction: true,
            subtotal: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
  async getOrderByOrderCode(order_code: string) {
    return await prisma.order.findUnique({
      where: { order_code },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        cashier: {
          select: {
            id: true,
            name: true,
          },
        },
        table: {
          select: {
            id: true,
            number: true,
          },
        },
        promo: {
          select: {
            id: true,
            promo_code: true,
            name: true,
            promo_type: true,
            percent_value: true,
            amount_value: true,
          },
        },
        order_items: {
          select: {
            id: true,
            menu: {
              select: {
                id: true,
                name: true,
                image_url: true,
              },
            },
            name_menu: true,
            quantity: true,
            price_at_transaction: true,
            cogs_at_transaction: true,
            subtotal: true,
          },
        },
        point_history: {
          select: {
            id: true,
            type: true,
            amount: true,
          },
        },
      },
    });
  }
  async getDailyOrders(startDate: string, endDate: string) {
    return await prisma.order.findMany({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        cashier: {
          select: {
            id: true,
            name: true,
          },
        },
        table: {
          select: {
            id: true,
            number: true,
          },
        },
        promo: {
          select: {
            id: true,
            promo_code: true,
            name: true,
            promo_type: true,
            percent_value: true,
            amount_value: true,
          },
        },
        order_items: {
          select: {
            id: true,
            menu: {
              select: {
                id: true,
                name: true,
                image_url: true,
              },
            },
            name_menu: true,
            quantity: true,
            price_at_transaction: true,
            cogs_at_transaction: true,
            subtotal: true,
          },
        },
        point_history: {
          select: {
            id: true,
            type: true,
            amount: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
  async getOrdersByRange(startDate: string, endDate: string) {
    return await prisma.order.findMany({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        cashier: {
          select: {
            id: true,
            name: true,
          },
        },
        table: {
          select: {
            id: true,
            number: true,
          },
        },
        promo: {
          select: {
            id: true,
            promo_code: true,
            name: true,
            promo_type: true,
            percent_value: true,
            amount_value: true,
          },
        },
        order_items: {
          select: {
            id: true,
            menu: {
              select: {
                id: true,
                name: true,
                image_url: true,
              },
            },
            name_menu: true,
            quantity: true,
            price_at_transaction: true,
            cogs_at_transaction: true,
            subtotal: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
  }
  async createOrder(
    data: Prisma.OrderCreateInput,
    Items: Prisma.OrderItemCreateWithoutOrderInput[]
  ) {
    const order = await prisma.order.create({
      data: {
        ...data,
        order_items: {
          create: Items.map((item) => ({
            ...item,
          })),
        },
      },
      include: {
        customer: true,
        order_items: true,
      },
    });
    return order;
  }
  async updateOrder(id: number, data: Prisma.OrderUpdateInput) {
    return await prisma.order.update({
      where: { id },
      data,
    });
  }
  async deleteOrder(id: number) {
    return await prisma.orderItem.delete({
      where: { id },
    });
  }
  async deleteOrderItem(id: number) {
    return await prisma.orderItem.delete({
      where: { id },
    });
  }
  async createHistoryPoint(data: Prisma.PointHistoryCreateInput) {
    return await prisma.pointHistory.create({
      data,
    });
  }
  async getHistoryPointByUser(id_user: number) {
    return await prisma.pointHistory.findMany({
      where: { user_id: id_user },
    });
  }

  async markAsRated(orderItemId: number) {
    // Dapatkan order_id dari order_item_id
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      select: { order_id: true },
    });

    if (!orderItem) {
      throw new Error(`Order item with id ${orderItemId} not found`);
    }

    // Update is_rated menjadi true di tabel orders
    return await prisma.order.update({
      where: { id: orderItem.order_id },
      data: { is_rated: true },
    });
  }
}
