var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DashboardService } from "./dashboard.service.js";
export class DashboardController {
    constructor() {
        this.dashboardService = new DashboardService();
    }
    getDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dashboardData = yield this.dashboardService.getDashboardData();
                res.status(200).json({
                    message: "Dashboard data retrieved successfully",
                    data: dashboardData,
                });
            }
            catch (error) {
                console.error("Error in getDashboard:", error);
                res.status(500).json({
                    error: error.message || "Internal server error"
                });
            }
        });
    }
}
