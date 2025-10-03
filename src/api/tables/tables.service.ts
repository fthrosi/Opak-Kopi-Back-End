import { Prisma } from "@prisma/client";
import { TableRepository } from "./tables.repository.js";

export class TableService {
  private tableRepository: TableRepository;
  constructor() {
    this.tableRepository = new TableRepository();
  }
  async findAll() {
    const tables = await this.tableRepository.findAll();
    if (!tables) {
      throw new Error("No tables found");
    }
    return tables;
  }
}