var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserService } from "./user.service.js";
export class UserController {
    constructor() {
        this.userService = new UserService();
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.getAllUsers();
                res.status(200).json({
                    message: "Users retrieved successfully",
                    users,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUserById(Number(req.params.id));
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                res.json(user);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getUsersByRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.getUsersByRole(req.params.role);
                res.json(users);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            try {
                const textData = req.body;
                let newData = Object.assign({}, textData);
                if (req.file) {
                    const imagePath = req.file.path.split("uploads")[1].replace(/\\/g, "/");
                    newData.img_url = `uploads${imagePath}`;
                }
                const user = yield this.userService.updateUser(userId, newData);
                res.status(200).json({
                    message: "User updated successfully",
                    data: user,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            try {
                const textData = req.body;
                let newData = Object.assign({}, textData);
                const user = yield this.userService.updateEmail(userId, newData);
                res.status(200).json({
                    message: "Email updated successfully",
                    data: user,
                });
            }
            catch (error) {
                const status = error.status || 500;
                const message = error.message || "Internal server error";
                res.status(status).json({ error: message });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            try {
                const textData = req.body;
                let newData = Object.assign({}, textData);
                const result = yield this.userService.changePassword(userId, newData);
                res.status(200).json({
                    message: "Password changed successfully",
                    data: result,
                });
            }
            catch (error) {
                const status = error.status || 500;
                const message = error.message || "Internal server error";
                res.status(status).json({ error: message });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(req.params.id);
            try {
                yield this.userService.deleteUser(userId);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    createFavoriteMenu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            const menuId = Number(req.params.id);
            try {
                const favoriteMenu = yield this.userService.createFavoriteMenu(userId, menuId);
                res.status(201).json(favoriteMenu);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getAllFavoriteMenus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            try {
                const favoriteMenus = yield this.userService.getAllFavoriteMenus(userId);
                res.status(200).json(favoriteMenus);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    deleteFavoriteMenu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = Number((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
            const menuId = Number(req.params.id);
            try {
                yield this.userService.deleteFavoriteMenu(userId, menuId);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getAllCustomersWithStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customers = yield this.userService.findAllCustomersWithStats();
                res.status(200).json({
                    message: "Customers with statistics retrieved successfully",
                    data: customers,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message || "Internal server error" });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.createUser(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = Number(req.params.id);
            const { status } = req.body;
            try {
                const updatedUser = yield this.userService.updateUser(userId, { status });
                res.status(200).json({
                    message: "User status updated successfully",
                    data: updatedUser,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
