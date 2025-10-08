var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ReservationService } from "./reservation.service.js";
import crypto from "crypto";
export class ReservationController {
    constructor() {
        this.reservationService = new ReservationService();
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reservations = yield this.reservationService.findAll();
                res.json(reservations);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const reservation = yield this.reservationService.findById(id);
                if (!reservation) {
                    return res.status(404).json({ message: "Reservation not found" });
                }
                res.json(reservation);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    findByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user_id = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            try {
                const reservations = yield this.reservationService.findByUser(user_id);
                res.json(reservations);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getReservationsByRange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const reservations = yield this.reservationService.getReservasiByRange(startDate, endDate);
                res.status(200).json({
                    message: "Reservations retrieved successfully",
                    data: reservations,
                    range: { startDate, endDate },
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message || "Internal server error" });
            }
        });
    }
    Checkin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rest_id = parseInt(req.params.id);
            const { checkinCode } = req.body;
            try {
                const result = yield this.reservationService.checkin(rest_id, checkinCode);
                res.status(200).json(result);
            }
            catch (error) {
                const status = error.status || 500;
                const message = error.message || "Internal server error";
                res.status(status).json({ error: message });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            const data = req.body;
            const status = "Dikirim";
            const code = crypto.randomBytes(4).toString("hex").toUpperCase();
            const reservation_code = `RES-${code}`;
            const checkin_code = `CHK-${crypto
                .randomBytes(3)
                .toString("hex")
                .toUpperCase()}`;
            const newData = Object.assign(Object.assign({}, data), { user_id,
                reservation_code,
                checkin_code,
                status });
            try {
                const reservation = yield this.reservationService.create(newData);
                res.status(201).json(reservation);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            const data = req.body;
            try {
                const currentReservation = yield this.reservationService.findById(id);
                if (!currentReservation) {
                    return res.status(404).json({ error: "Reservation not found" });
                }
                const reservation = yield this.reservationService.update(id, data);
                res.json(reservation);
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
                const currentReservation = yield this.reservationService.findById(id);
                if (!currentReservation) {
                    return res.status(404).json({ error: "Reservation not found" });
                }
                yield this.reservationService.delete(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
