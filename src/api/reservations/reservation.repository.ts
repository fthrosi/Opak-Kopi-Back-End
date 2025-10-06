import prisma from "../../config/db.js";
import { Prisma } from '@prisma/client';

export class ReservationRepository {
  async findAll() {
    return await prisma.reservations.findMany({
      select: {
        id: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        reservation_code: true,
        reservation_time: true,
        number_of_guest: true,
        status: true,
        cancellation_reason: true,
        created_at: true,
        update_at: true,
        checkin_code: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
  async findById(id: number) {
    return await prisma.reservations.findUnique({
      where: { id },
      select: {
        id: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        reservation_code: true,
        reservation_time: true,
        number_of_guest: true,
        status: true,
        cancellation_reason: true,
        created_at: true,
        update_at: true,
        checkin_code: true,
      },
    });
  }
  async findByUser(id:number){
    return await prisma.reservations.findMany({
      where: { user_id: id },
      select: {
        id: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        reservation_code: true,
        reservation_time: true,
        number_of_guest: true,
        status: true,
        cancellation_reason: true,
        created_at: true,
        update_at: true,
        checkin_code: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
  async getReservasiByRange(startDate: string, endDate: string) {
    return await prisma.reservations.findMany({
      where: {
        reservation_time: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        reservation_code: true,
        reservation_time: true,
        number_of_guest: true,
        status: true,
        cancellation_reason: true,
        created_at: true,
        update_at: true,
        checkin_code: true,
      },
      orderBy: { created_at: "desc" },
    });
  }
  async create(data: Prisma.reservationsCreateInput) {
    return await prisma.reservations.create({
      data,
      select: {
        id: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        reservation_code: true,
        reservation_time: true,
        number_of_guest: true,
        status: true,
        cancellation_reason: true,
        created_at: true,
        update_at: true,
      },
    });
  }
  async update(id: number, data: Prisma.reservationsUpdateInput) {
    return await prisma.reservations.update({
      where: { id },
      data,
      select: {
        id: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        reservation_code: true,
        reservation_time: true,
        number_of_guest: true,
        status: true,
        cancellation_reason: true,
        created_at: true,
        update_at: true,
      },
    });
  }
  async delete(id: number) {
    return await prisma.reservations.delete({
      where: { id },
      select: {
        id: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
        reservation_code: true,
        reservation_time: true,
        number_of_guest: true,
        status: true,
        cancellation_reason: true,
        created_at: true,
        update_at: true,
      },
    });
  }
}   