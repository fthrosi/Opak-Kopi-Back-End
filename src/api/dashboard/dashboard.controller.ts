import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service.js";

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  async getDashboard(req: Request, res: Response) {
    try {
      const dashboardData = await this.dashboardService.getDashboardData();

      res.status(200).json({
        message: "Dashboard data retrieved successfully",
        data: dashboardData,
      });
    } catch (error: any) {
        console.error("Error in getDashboard:", error);
      res.status(500).json({ 
        error: error.message || "Internal server error" 
      });
    }
  }
}