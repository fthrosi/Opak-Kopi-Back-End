import { TableController } from "./tables.controller.js";
import { Router } from "express";
import { validateToken, validateRole } from "../../middleware/auth.js";



const tableRouter = Router();
const tableController = new TableController();



tableRouter.get("/", (req, res) => tableController.findAll(req, res));

export default tableRouter;
