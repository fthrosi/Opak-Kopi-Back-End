var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../../config/db.js";
export class ReservationRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.reservations.findMany({
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
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.reservations.findUnique({
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
        });
    }
    findByUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.reservations.findMany({
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
        });
    }
    getReservasiByRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.reservations.findMany({
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
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.reservations.create({
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
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.reservations.update({
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
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.reservations.delete({
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
        });
    }
}
