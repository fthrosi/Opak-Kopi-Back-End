import { ReservationRepository } from "./reservation.repository.js";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { NotificationService } from "../../socket/notification.service.js";
dayjs.extend(utc);
dayjs.extend(timezone);

export class ReservationService {
  private reservationRepository: ReservationRepository;

  constructor() {
    this.reservationRepository = new ReservationRepository();
  }
  async findAll() {
    try {
      return await this.reservationRepository.findAll();
    } catch (error: string | any) {
      throw new Error(error.message);
    }
  }
  async findById(id: number) {
    try {
      return await this.reservationRepository.findById(id);
    } catch (error: string | any) {
      throw new Error(error.message);
    }
  }
  async findByUser(userId: number) {
    try {
      return await this.reservationRepository.findByUser(userId);
    } catch (error: string | any) {
      throw new Error(error.message);
    }
  }
  async getReservasiByRange(startDate?: string, endDate?: string) {
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
        dayjs(endDate)
          .tz("Asia/Jakarta")
          .endOf("day")
          .format("YYYY-MM-DD 23:59:59") + "Z";
    } else {
      const now = dayjs().tz("Asia/Jakarta");
      start = now.startOf("month").format("YYYY-MM-DD 00:00:00") + "Z";
      end = now.endOf("month").format("YYYY-MM-DD 23:59:59") + "Z";
    }
    return await this.reservationRepository.getReservasiByRange(start, end);
  }
  async checkin(reservationId: number, checkinCode: string) {
    try {
      const reservation = await this.reservationRepository.findById(
        reservationId
      );
      if (!reservation) {
        throw { status: 404, message: "Reservation Tidak Ditemukan" };
      }
      if (reservation.checkin_code !== checkinCode) {
        throw { status: 400, message: "Kode check-in tidak valid" };
      }
      const nowString = dayjs()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD HH:mm:ss");
      const update_at = nowString + "Z";
      const data = {
        status: "Selesai",
        update_at: update_at,
      };
      return await this.reservationRepository.update(reservationId, data);
    } catch (error: string | any) {
      throw new Error(error.message);
    }
  }
  async create(data: Prisma.reservationsCreateInput) {
    try {
      if (data.reservation_time) {
        data.reservation_time = data.reservation_time + "Z";
      }

      // Set created_at dan update_at manual dengan approach yang sama seperti reservation_time
      const nowString = dayjs()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD HH:mm:ss");
      data.created_at = nowString + "Z"; // Tambah Z sama seperti reservation_time
      data.update_at = nowString + "Z";
      const reservation = await this.reservationRepository.create(data);
      NotificationService.sendNewReservationNotification(reservation);
      return reservation;
    } catch (error: string | any) {
      throw new Error(error.message);
    }
  }
  async update(id: number, data: Prisma.reservationsUpdateInput) {
    try {
      const currentReservation = await this.reservationRepository.findById(id);
      if (!currentReservation) {
        throw new Error("Reservation not found");
      }
      const reservation = await this.reservationRepository.update(id, data);
      NotificationService.sendReservationStatusUpdateNotification(reservation);
      return reservation;
    } catch (error: string | any) {
      throw new Error(error.message);
    }
  }
  async delete(id: number) {
    try {
      const currentReservation = await this.reservationRepository.findById(id);
      if (!currentReservation) {
        throw new Error("Reservation not found");
      }
      return await this.reservationRepository.delete(id);
    } catch (error: string | any) {
      throw new Error(error.message);
    }
  }
}
