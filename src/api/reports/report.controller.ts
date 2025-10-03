import { ReportService } from "./report.service.js";
import { Request, Response } from "express";
import { dateRange } from "../../types/report.types.js";

export class ReportController {
  private reportService: ReportService;
  constructor() {
    this.reportService = new ReportService();
  }

  async getSalesReport(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      const report = await this.reportService.getSalesReport(
        startDate as string | undefined,
        endDate as string | undefined
      );
      res.status(200).json(report);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getMenuReport(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const report = await this.reportService.getMenuReport(
        startDate as string | undefined,
        endDate as string | undefined
      );
      res.status(200).json(report);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getPromoReport(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      
      const report = await this.reportService.getPromoReport(
        startDate as string | undefined,
        endDate as string | undefined
      );
      res.status(200).json(report);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
  async getReservationReport(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const report = await this.reportService.getReservasiReport(
        startDate as string | undefined,
        endDate as string | undefined
      );
      res.status(200).json(report);
    } catch (error: string | any) {
      res.status(500).json({ error: error.message });
    }
  }
}
