import prisma from "../../config/db.js";
import { Prisma } from "@prisma/client";

export class MenuRepository {
    async findAll(){
        return await prisma.menu.findMany({
            where: { delete_at: null },
            select: {
                id: true,
                name: true,
                current_price: true,
                current_cogs: true,
                description: true,
                image_url: true,
                status: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async findById(id: number) {
        return await prisma.menu.findUnique({
            where: { id, delete_at: null },
            select: {
                id: true,
                name: true,
                current_price: true,
                current_cogs: true,
                description: true,
                image_url: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async findByCategory(categoryId: number) {
        return await prisma.menu.findMany({
            where: { category_id: categoryId, delete_at: null },
            select: {
                id: true,
                name: true,
                current_price: true,
                current_cogs: true,
                description: true,
                image_url: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async create(data: Prisma.MenuCreateInput) {
        return await prisma.menu.create({
            data,
        });
    }
    async update(id: number, data: Prisma.MenuUpdateInput) {
        return await prisma.menu.update({
            where: { id },
            data,
        });
    }
    async delete(id: number,data: Prisma.MenuUpdateInput) {
        return await prisma.menu.update({
            where: { id },
            data,
        });
    }
}