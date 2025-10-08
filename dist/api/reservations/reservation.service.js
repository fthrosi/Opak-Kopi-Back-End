var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ReservationRepository } from "./reservation.repository.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { NotificationService } from "../../socket/notification.service.js";
dayjs.extend(utc);
dayjs.extend(timezone);
export class ReservationService {
    constructor() {
        this.reservationRepository = new ReservationRepository();
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.reservationRepository.findAll();
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.reservationRepository.findById(id);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    findByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.reservationRepository.findByUser(userId);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getReservasiByRange(startDate, endDate) {
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
            return yield this.reservationRepository.getReservasiByRange(start, end);
        });
    }
    checkin(reservationId, checkinCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservation = yield this.reservationRepository.findById(reservationId);
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
                return yield this.reservationRepository.update(reservationId, data);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const reservation = yield this.reservationRepository.create(data);
                NotificationService.sendNewReservationNotification(reservation);
                return reservation;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentReservation = yield this.reservationRepository.findById(id);
                if (!currentReservation) {
                    throw new Error("Reservation not found");
                }
                const reservation = yield this.reservationRepository.update(id, data);
                NotificationService.sendReservationStatusUpdateNotification(reservation);
                return reservation;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentReservation = yield this.reservationRepository.findById(id);
                if (!currentReservation) {
                    throw new Error("Reservation not found");
                }
                return yield this.reservationRepository.delete(id);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
