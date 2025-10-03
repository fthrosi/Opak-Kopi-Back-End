import { Request,Response,NextFunction } from "express";
import { UserService } from "../api/users/user.service.js";
import { CustomRequest } from "./auth.js";
export async function updateOrderBody(req: CustomRequest, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    const db = new UserService();
  if (req.body.status === "Dibatalkan"){
    if(!req.body.cancellation_reason) {
      return res.status(400).json({ error: "Cancellation reason is required" });
    }
  }
  const user = await db.getUserById(Number(userId));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if(req.body.status !== "Dibatalkan" && user.role.name !== "Kasir") {
    return res.status(400).json({ error: "This role is not allowed to process orders" });
  }
  next();
}