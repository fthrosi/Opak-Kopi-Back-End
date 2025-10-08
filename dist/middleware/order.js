var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserService } from "../api/users/user.service.js";
export function updateOrderBody(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const db = new UserService();
        if (req.body.status === "Dibatalkan") {
            if (!req.body.cancellation_reason) {
                return res.status(400).json({ error: "Cancellation reason is required" });
            }
        }
        const user = yield db.getUserById(Number(userId));
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (req.body.status !== "Dibatalkan" && user.role.name !== "Kasir") {
            return res.status(400).json({ error: "This role is not allowed to process orders" });
        }
        next();
    });
}
