import prisma from "../../config/db.js";
import { Prisma } from '@prisma/client';


export class TableRepository {
  async findAll() {
    return await prisma.table.findMany({
      select: {
        id: true,
        number: true,
        status: true,
      },
    });
  }
}