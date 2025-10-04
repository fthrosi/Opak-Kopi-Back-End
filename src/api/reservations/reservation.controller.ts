import { ReservationService } from "./reservation.service.js";
import { Request, Response } from "express";
import { CustomRequest } from "../../middleware/auth.js";
import crypto from "crypto";

export class ReservationController {
  private reservationService: ReservationService;
  constructor() {
    this.reservationService = new ReservationService();
  }
  async findAll(req: Request, res: Response) {
    try {
      const reservations = await this.reservationService.findAll();
      res.json(reservations);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async findById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const reservation = await this.reservationService.findById(id);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      res.json(reservation);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async findByUser(req: CustomRequest, res: Response) {
    const user_id = Number(req.user?.userId);
    try {
      const reservations = await this.reservationService.findByUser(user_id);
      res.json(reservations);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getReservationsByRange(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const reservations = await this.reservationService.getReservasiByRange(
        startDate as string | undefined,
        endDate as string | undefined
      );
      res.status(200).json({
        message: "Reservations retrieved successfully",
        data: reservations,
        range: { startDate, endDate },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
  async Checkin(req: Request, res: Response) {
    const rest_id = parseInt(req.params.id);
    const { checkinCode } = req.body;
    try {
      const result = await this.reservationService.checkin(
        rest_id,
        checkinCode
      );
      res.status(200).json(result);
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      res.status(status).json({ error: message });
    }
  }
  async create(req: CustomRequest, res: Response) {
    const user_id = req.user?.userId;
    const data = req.body;
    const status = "Dikirim";
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    const reservation_code = `RES-${code}`;
    const checkin_code = `CHK-${crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;
    const newData = {
      ...data,
      user_id,
      reservation_code,
      checkin_code,
      status,
    };
    try {
      const reservation = await this.reservationService.create(newData);
      res.status(201).json(reservation);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const data = req.body;
    try {
      const currentReservation = await this.reservationService.findById(id);
      if (!currentReservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      const reservation = await this.reservationService.update(id, data);
      res.json(reservation);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const currentReservation = await this.reservationService.findById(id);
      if (!currentReservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      await this.reservationService.delete(id);
      res.status(204).send();
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
}
