var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ReportService } from "./report.service.js";
export class ReportController {
    constructor() {
        this.reportService = new ReportService();
    }
    getSalesReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const report = yield this.reportService.getSalesReport(startDate, endDate);
                res.status(200).json(report);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getMenuReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const report = yield this.reportService.getMenuReport(startDate, endDate);
                res.status(200).json(report);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getPromoReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const report = yield this.reportService.getPromoReport(startDate, endDate);
                res.status(200).json(report);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getReservationReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                const report = yield this.reportService.getReservasiReport(startDate, endDate);
                res.status(200).json(report);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
