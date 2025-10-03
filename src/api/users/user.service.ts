import { Prisma } from "@prisma/client";
import { UserRepository } from "./user.repository.js";
import fs from "fs/promises";
import bcrypt from "bcrypt";
import { passwordChange } from "../../types/user.js";
import dayjs from "dayjs";
export class UserService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }
  async getAllUsers() {
    const users = await this.userRepository.findAll();
    if (users) {
      users.forEach((user) => {
        user.img_url = `${process.env.BASE_URL}/${user.img_url}`;
      });
    }
    if (!users || users.length === 0) {
      throw new Error("No users found");
    }
    return users;
  }
  async getUserById(id: number) {
    const user = await this.userRepository.findById(id);
    if (user) {
      user.img_url = `${process.env.BASE_URL}/${user.img_url}`;
    }
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  async getUsersByRole(role: string) {
    const users = await this.userRepository.findByRole(role);

    if (users) {
      users.forEach((user) => {
        user.img_url = `${process.env.BASE_URL}/${user.img_url}`;
      });
    }
    if (!users || users.length === 0) {
      throw new Error("No users found");
    }
    return users;
  }
  async createUser(data: Prisma.UserCreateInput) {
    const verification_At = new Date();
    const defaultPassword = "password123";
    const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
    const newUserData = {
      ...data,
      email_verified_at: verification_At,
      password: hashedPassword,
      status: "Aktif",
      role_id: 2,
    };
    const user = await this.userRepository.create(newUserData);
    if (!user) {
      throw new Error("User creation failed");
    }
    return user;
  }
  async findAllCustomersWithStats() {
    try {
      const customers = await this.userRepository.findAllCustomersWithStats();
      const customersWithStats = customers.map((customer) => {
        const totalTransactions = customer.orders_as_customer.reduce(
          (sum, order) => sum + (order.total_price || 0),
          0
        );
        const lastOrderDate =
          customer.orders_as_customer.length > 0 ? customer.orders_as_customer[0].created_at : null;

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
    } catch (error) {
      throw error;
    }
  }
  async updateUser(id: number, data: Prisma.UserUpdateInput) {
    const currentUser = await this.userRepository.findById(id);
    if (!currentUser) {
      throw { status: 404, message: "User not found" };
    }
    if (data.img_url && currentUser.img_url) {
      const oldImagePath = currentUser.img_url;
      try {
        await fs.unlink(oldImagePath);
      } catch (error) {
        throw { status: 500, message: "Failed to delete old image" };
      }
    }
    const user = await this.userRepository.update(id, data);
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
  async updateEmail(id: number, data: Prisma.UserUpdateInput) {
    const currentUser = await this.userRepository.findById(id);
    if (currentUser?.email === data.email) {
      throw { status: 400, message: "Email Already exists" };
    }
    if (currentUser) {
      const passwordCheck = await bcrypt.compare(
        data.password as string,
        currentUser.password as string
      );
      if (!passwordCheck) {
        throw { status: 400, message: "Password is incorrect" };
      }
      const user = await this.userRepository.update(id, {
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
  }
  async changePassword(id: number, data: passwordChange) {
    const currentUser = await this.userRepository.findById(id);
    if (!currentUser) {
      throw { status: 404, message: "User not found" };
    }
    const passwordCheck = await bcrypt.compare(
      data.currentPassword,
      currentUser.password as string
    );
    if (!passwordCheck) {
      throw { status: 400, message: "Current password is incorrect" };
    }
    const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);
    const updatedUser = await this.userRepository.update(id, {
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
  }
  async deleteUser(id: number) {
     const nowString = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
        const delete_at = nowString + "Z";
    const deleted = await this.userRepository.delete(id,{ delete_at });
    if (!deleted) {
      throw new Error("User deletion failed");
    }
    return deleted;
  }
  async createFavoriteMenu(userId: number, menuId: number) {
    const favoriteMenu = await this.userRepository.createFavoriteMenu(
      userId,
      menuId
    );
    if (!favoriteMenu) {
      throw new Error("Failed to create favorite menu");
    }
    return favoriteMenu;
  }
  async getAllFavoriteMenus(userId: number) {
    try {
      const favoriteMenus = await this.userRepository.getallFavoriteMenus(
        userId
      );
      favoriteMenus.forEach((menu) => {
        menu.menu.image_url = `${process.env.BASE_URL}/${menu.menu.image_url}`;
      });
      return favoriteMenus;
    } catch (error: string | any) {
      throw new Error(error);
    }
  }
  async deleteFavoriteMenu(userId: number, menuId: number) {
    const deleted = await this.userRepository.deleteFavoriteMenu(
      userId,
      menuId
    );
    if (!deleted) {
      throw new Error("Failed to delete favorite menu");
    }
    return deleted;
  }
}
