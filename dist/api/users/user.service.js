var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserRepository } from "./user.repository.js";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
export class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.findAll();
            if (users) {
                users.forEach((user) => {
                    user.img_url = `${process.env.BASE_URL}/${user.img_url}`;
                });
            }
            if (!users || users.length === 0) {
                throw new Error("No users found");
            }
            return users;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(id);
            if (user) {
                user.img_url = `${process.env.BASE_URL}/${user.img_url}`;
            }
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        });
    }
    getUsersByRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.findByRole(role);
            if (users) {
                users.forEach((user) => {
                    user.img_url = `${process.env.BASE_URL}/${user.img_url}`;
                });
            }
            if (!users || users.length === 0) {
                throw new Error("No users found");
            }
            return users;
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const verification_At = new Date();
            const defaultPassword = "password123";
            const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
            const newUserData = Object.assign(Object.assign({}, data), { email_verified_at: verification_At, password: hashedPassword, status: "Aktif", role_id: 2 });
            const user = yield this.userRepository.create(newUserData);
            if (!user) {
                throw new Error("User creation failed");
            }
            return user;
        });
    }
    findAllCustomersWithStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customers = yield this.userRepository.findAllCustomersWithStats();
                const customersWithStats = customers.map((customer) => {
                    const totalTransactions = customer.orders_as_customer.reduce((sum, order) => sum + (order.total_price || 0), 0);
                    const lastOrderDate = customer.orders_as_customer.length > 0 ? customer.orders_as_customer[0].created_at : null;
                    return {
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone,
                        img_url: customer.img_url
                            ? `${process.env.BASE_URL}/${customer.img_url}`
                            : null,
                        poin: customer.poin,
                        status: customer.status,
                        role: customer.role,
                        total_orders: customer._count.orders_as_customer,
                        total_transactions: totalTransactions,
                        last_order_date: lastOrderDate,
                        created_at: customer.created_at,
                    };
                });
                return customersWithStats;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield this.userRepository.findById(id);
            if (!currentUser) {
                throw { status: 404, message: "User not found" };
            }
            if (data.img_url && currentUser.img_url) {
                const oldImagePath = currentUser.img_url;
                try {
                    yield fs.unlink(oldImagePath);
                }
                catch (error) {
                    throw { status: 500, message: "Failed to delete old image" };
                }
            }
            const user = yield this.userRepository.update(id, data);
            const payload = {
                userId: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                img: `${process.env.BASE_URL}/${user.img_url}`,
                poin: user.poin,
                role: user.role,
                status: user.status,
            };
            return payload;
        });
    }
    updateEmail(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield this.userRepository.findById(id);
            if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.email) === data.email) {
                throw { status: 400, message: "Email Already exists" };
            }
            if (currentUser) {
                const passwordCheck = yield bcrypt.compare(data.password, currentUser.password);
                if (!passwordCheck) {
                    throw { status: 400, message: "Password is incorrect" };
                }
                const user = yield this.userRepository.update(id, {
                    email: data.email,
                });
                const payload = {
                    userId: user.id,
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    img: `${process.env.BASE_URL}/${user.img_url}`,
                    poin: user.poin,
                    role: user.role,
                    status: user.status,
                };
                return payload;
            }
        });
    }
    changePassword(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield this.userRepository.findById(id);
            if (!currentUser) {
                throw { status: 404, message: "User not found" };
            }
            const passwordCheck = yield bcrypt.compare(data.currentPassword, currentUser.password);
            if (!passwordCheck) {
                throw { status: 400, message: "Current password is incorrect" };
            }
            const hashedNewPassword = yield bcrypt.hash(data.newPassword, 10);
            const updatedUser = yield this.userRepository.update(id, {
                password: hashedNewPassword,
            });
            if (!updatedUser) {
                throw { status: 500, message: "Failed to update password" };
            }
            const payload = {
                userId: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                phone: updatedUser.phone,
                img: `${process.env.BASE_URL}/${updatedUser.img_url}`,
                poin: updatedUser.poin,
                role: updatedUser.role,
                status: updatedUser.status,
            };
            return payload;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowString = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
            const delete_at = nowString + "Z";
            const deleted = yield this.userRepository.delete(id, { delete_at });
            if (!deleted) {
                throw new Error("User deletion failed");
            }
            return deleted;
        });
    }
    createFavoriteMenu(userId, menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const favoriteMenu = yield this.userRepository.createFavoriteMenu(userId, menuId);
            if (!favoriteMenu) {
                throw new Error("Failed to create favorite menu");
            }
            return favoriteMenu;
        });
    }
    getAllFavoriteMenus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const favoriteMenus = yield this.userRepository.getallFavoriteMenus(userId);
                favoriteMenus.forEach((menu) => {
                    menu.menu.image_url = `${process.env.BASE_URL}/${menu.menu.image_url}`;
                });
                return favoriteMenus;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    deleteFavoriteMenu(userId, menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.userRepository.deleteFavoriteMenu(userId, menuId);
            if (!deleted) {
                throw new Error("Failed to delete favorite menu");
            }
            return deleted;
        });
    }
}
