import { PromoService } from "./promo.service.js";
import { Request, Response } from "express";
export class PromoController {
  private promoService: PromoService;

  constructor() {
    this.promoService = new PromoService();
  }

  async findAll(req: Request, res: Response) {
    try {
      const promos = await this.promoService.findAll();
      res.status(200).json({
        message: "Promos retrieved successfully",
        data: promos,
      });
    } catch (error: string | any) {
      res.status(500).json({ message: error.message });
    }
  }
  async findAllWithClaimCount(req: Request, res: Response) {
    try {
      const promos = await this.promoService.findAllWithClaimCount();
      res.status(200).json({
        message: "Promos with claim count retrieved successfully",
        data: promos,
      });
    } catch (error: string | any) {
      res.status(500).json({ error });
    }
  }
  async findById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const promo = await this.promoService.findById(id);
      res.status(200).json({
        message: "Promo retrieved successfully",
        data: promo,
      });
    } catch (error: string | any) {
      res.status(404).json({ message: error.message });
    }
  }
  async findByType(req: Request, res: Response) {
    const type = req.params.type;
    try {
      const promos = await this.promoService.findByType(type);
      res.status(200).json({
        message: "Promos by type retrieved successfully",
        data: promos,
      });
    } catch (error: string | any) {
      res.status(404).json({ message: error.message });
    }
  }
  async findByCode(req: Request, res: Response) {
    const code = req.params.code;
    // Ambil menuIds dari query parameter
    const menuIds = req.query.menuIds
      ? (req.query.menuIds as string).split(",").map((id) => parseInt(id))
      : undefined;

    try {
      const promo = await this.promoService.findByCode(code, menuIds);
      res.status(200).json({
        message: "Promo retrieved successfully",
        data: promo,
      });
    } catch (error: string | any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      res.status(status).json({ error: message });
    }
  }
  async findByStatus(req: Request, res: Response) {
    const status = req.params.status;
    try {
      const promos = await this.promoService.findByStatus(status);
      res.status(200).json({
        message: "Promos by status retrieved successfully",
        data: promos,
      });
    } catch (error: string | any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      res.status(status).json({ error: message });
    }
  }
  async create(req: Request, res: Response) {
    try {
      const datas = req.body;

      if (datas.promo_type === "percent") {
        datas.amount_value = 0;
        datas.percent_value = parseFloat(datas.percent_value);
      }
      if (datas.promo_type === "amount") {
        datas.percent_value = 0;
        datas.amount_value = parseFloat(datas.amount_value);
      }
      if (datas.start_date) {
        datas.start_date = new Date(datas.start_date);
      }
      if (datas.end_date) {
        datas.end_date = new Date(datas.end_date);
      }

      if (datas.minimum_purchase) {
        datas.minimum_purchase = parseFloat(datas.minimum_purchase);
      }
      const newData = { ...datas };
      if (req.file) {
        const imagePath = req.file.path.split("uploads")[1].replace(/\\/g, "/");
        newData.img_url = `uploads${imagePath}`; // Assuming req.file.path contains the image URL
      }
      const createdPromo = await this.promoService.create(newData);
      res.status(201).json({
        message: "Promo created successfully",
        data: createdPromo,
      });
    } catch (error: string | any) {
      res.status(400).json({ error });
    }
  }
  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const textData = req.body;
      if (textData.promo_type === "percent") {
        textData.amount_value = null;
        textData.percent_value = parseFloat(req.body.percent_value);
      }
      if (textData.promo_type === "amount") {
        textData.percent_value = null;
        textData.amount_value = parseFloat(req.body.amount_value);
      }
      if (textData.start_date) {
        textData.start_date = new Date(req.body.start_date);
      }
      if (textData.end_date) {
        textData.end_date = new Date(req.body.end_date);
      }
      if (textData.minimum_purchase) {
        textData.minimum_purchase = parseFloat(req.body.minimum_purchase);
      }
      let newData = { ...textData };
      if (req.file) {
        const imagePath = req.file.path.split("uploads")[1].replace(/\\/g, "/");
        newData.img_url = `uploads${imagePath}`;
      }
      const updatedPromo = await this.promoService.update(id, newData);
      res.status(200).json({
        message: "Promo updated successfully",
        data: updatedPromo,
      });
    } catch (error: string | any) {
      res.status(404).json({ message: error.message });
    }
  }
  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    try {
      const deletedPromo = await this.promoService.delete(id);
      res.status(200).json({
        message: "Promo deleted successfully",
        data: deletedPromo,
      });
    } catch (error: string | any) {
      res.status(404).json({ message: error.message });
    }
  }
}
