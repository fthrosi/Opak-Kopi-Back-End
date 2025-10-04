import {
  sendNotificationToUser,
  sendNotificationToRole,
  getSocketIO,
} from "./index.js";

export class NotificationService {
  static sendNewOrderNotification(order: any) {
    const io = getSocketIO();
    const allSockets = Array.from(io.sockets.sockets.keys());

    // Log semua rooms dan anggotanya
    const rooms = io.sockets.adapter.rooms;
    for (const [roomName, socketSet] of rooms) {
      if (typeof roomName === "string" && !roomName.includes("/")) {
        const members = Array.from(socketSet);
      }
    }
    const notification = {
      id: Date.now(),
      type: "NEW_ORDER",
      title: "Pesanan Baru",
      message: `Pesanan baru #${order.order_code} telah masuk`,
      data: {
        orderId: order.id,
        orderNumber: order.order_code,
        customerName: order.user?.name || "Pelanggan",
        total: order.total_price,
        timestamp: new Date(),
      },
    };

    sendNotificationToRole("Kasir", "notification", notification);
    return true;
  }


  static sendNewReservationNotification(reservation: any) {
    const notification = {
      id: Date.now(),
      type: "NEW_RESERVATION",
      title: "Reservasi Baru",
      message: `Reservasi baru #${reservation.reservation_code} telah masuk`,
      data: {
        reservationId: reservation.id,
        reservationCode: reservation.reservation_code,
        customerName: reservation.user?.name || "Pelanggan",
        guestCount: reservation.number_of_guest,
        reservationTime: reservation.reservation_time,
        timestamp: new Date(),
      },
    };
    sendNotificationToRole("Kasir", "notification", notification);

    return true;
  }

  static sendOrderStatusUpdateNotification(order: any) {
    if (!order.customer_id) return false;

    const notification = {
      id: Date.now(),
      type: "ORDER_STATUS_UPDATE",
      title: "Update Status Pesanan",
      message: `Pesanan #${order.order_code} status telah berubah menjadi ${order.status}`,
      data: {
        orderId: order.id,
        orderNumber: order.order_code,
        status: order.status,
        timestamp: new Date(),
      },
    };
    return sendNotificationToUser(order.customer_id, "notification", notification);
  }

  static sendReservationStatusUpdateNotification(reservation: any) {
    if (!reservation.users.id) return false;

    const notification = {
      id: Date.now(),
      type: "RESERVATION_STATUS_UPDATE",
      title: "Update Status Reservasi",
      message: `Reservasi #${reservation.reservation_code} status telah berubah menjadi ${reservation.status}`,
      data: {
        reservationId: reservation.id,
        reservationCode: reservation.reservation_code,
        status: reservation.status,
        timestamp: new Date(),
      },
    };

    return sendNotificationToUser(
      reservation.users.id,
      "notification",
      notification
    );
  }
}
