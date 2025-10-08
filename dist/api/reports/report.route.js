import { ReportController } from "./report.controller.js";
import { Router } from "express";
const routerReport = Router();
const reportController = new ReportController();
routerReport.get("/sales-report", (req, res) => reportController.getSalesReport(req, res));
routerReport.get("/menu-report", (req, res) => reportController.getMenuReport(req, res));
routerReport.get("/promo-report", (req, res) => reportController.getPromoReport(req, res));
routerReport.get("/reservation-report", (req, res) => reportController.getReservationReport(req, res));
export default routerReport;
