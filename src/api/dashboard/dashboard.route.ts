import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";
import { validateToken, validateRole } from "../../middleware/auth.js";

const dashboardController = new DashboardController();
const dashboardRouter = Router();

dashboardRouter.get("/", validateToken, validateRole(["Owner"]), (req, res) =>
  dashboardController.getDashboard(req, res)
);
dashboardRouter.get("/top-menus", (req, res) =>
  dashboardController.getTopSellingMenus(req, res)
);

export default dashboardRouter;
