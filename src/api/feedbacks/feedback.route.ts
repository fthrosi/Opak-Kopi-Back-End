import { FeedbackController } from "./feedback.controller.js";
import { Router } from "express";
import { validateCreateFeedbackBody } from "../../middleware/feedback.js";
import { validateToken,validateRole } from "../../middleware/auth.js";

const feedBackRouter = Router();
const feedbackController = new FeedbackController();

feedBackRouter.post("/add", validateToken, validateCreateFeedbackBody, (req, res) => feedbackController.createFeedback(req, res));
feedBackRouter.get("/all", validateToken, (req, res) => feedbackController.getAllFeedbacks(req, res));
feedBackRouter.get("/user", validateToken,validateRole(["Pelanggan"]), (req, res) => feedbackController.getFeedbackByUser(req, res));
feedBackRouter.put("/update/:id", validateToken, validateRole(["Owner"]), (req, res) => feedbackController.updateFeedback(req, res));
feedBackRouter.delete("/delete/:id", validateToken, (req, res) => feedbackController.deleteFeedback(req, res));

export default feedBackRouter;
