import { TableService } from "./tables.service.js";

export class TableController {
  private tableService: TableService;
  constructor() {
    this.tableService = new TableService();
  }
  async findAll(req: any, res: any) {
    try {
      const tables = await this.tableService.findAll();
      res.status(200).json({
        message: "Tables retrieved successfully",
        data: tables,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
