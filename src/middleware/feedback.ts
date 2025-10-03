import { Request,Response,NextFunction } from "express";
import { CustomRequest } from "./auth.js";
export async function validateCreateFeedbackBody(req: CustomRequest, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    const { topic,message } = req.body;

    if (!userId ) {
        return res.status(400).json({ error: 'You must login first' });
    }

    if (!topic || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    next();
}