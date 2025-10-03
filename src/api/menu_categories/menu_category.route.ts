import { MenuCategoryController } from "./menu_category.controller.js";
import { Router } from "express";
import { validateToken, validateRole } from "../../middleware/auth.js";

const menuCategoryController = new MenuCategoryController();
const menuCategoryRouter = Router();

menuCategoryRouter.get("/", (req, res) => menuCategoryController.findAll(req, res));
menuCategoryRouter.get("/with-count", (req, res) => menuCategoryController.findAllWithCount(req, res));
menuCategoryRouter.get("/:id",validateToken,validateRole(["Owner"]), (req, res) => menuCategoryController.findById(req, res));
menuCategoryRouter.post("/add",validateToken,validateRole(["Owner"]), (req, res) => menuCategoryController.create(req, res));
menuCategoryRouter.put("/update/:id",validateToken,validateRole(["Owner"]), (req, res) => menuCategoryController.update(req, res));
menuCategoryRouter.put("/delete/:id",validateToken,validateRole(["Owner"]), (req, res) => menuCategoryController.delete(req, res));

export default menuCategoryRouter;