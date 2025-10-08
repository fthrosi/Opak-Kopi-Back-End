var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PromoService } from "./promo.service.js";
export class PromoController {
    constructor() {
        this.promoService = new PromoService();
    }
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promos = yield this.promoService.findAll();
                res.status(200).json({
                    message: "Promos retrieved successfully",
                    data: promos,
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    findAllWithClaimCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promos = yield this.promoService.findAllWithClaimCount();
                res.status(200).json({
                    message: "Promos with claim count retrieved successfully",
                    data: promos,
                });
            }
            catch (error) {
                res.status(500).json({ error });
            }
        });
    }
    findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const promo = yield this.promoService.findById(id);
                res.status(200).json({
                    message: "Promo retrieved successfully",
                    data: promo,
                });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    findByType(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = req.params.type;
            try {
                const promos = yield this.promoService.findByType(type);
                res.status(200).json({
                    message: "Promos by type retrieved successfully",
                    data: promos,
                });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    findByCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = req.params.code;
            const menuIds = req.query.menuIds
                ? req.query.menuIds.split(",").map((id) => parseInt(id))
                : undefined;
            try {
                const promo = yield this.promoService.findByCode(code, menuIds);
                res.status(200).json({
                    message: "Promo retrieved successfully",
                    data: promo,
                });
            }
            catch (error) {
                const status = error.status || 500;
                const message = error.message || "Internal server error";
                res.status(status).json({ error: message });
            }
        });
    }
    findByStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = req.params.status;
            try {
                const promos = yield this.promoService.findByStatus(status);
                res.status(200).json({
                    message: "Promos by status retrieved successfully",
                    data: promos,
                });
            }
            catch (error) {
                const status = error.status || 500;
                const message = error.message || "Internal server error";
                res.status(status).json({ error: message });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const newData = Object.assign({}, datas);
                if (req.file) {
                    const imagePath = req.file.path.split("uploads")[1].replace(/\\/g, "/");
                    newData.img_url = `uploads${imagePath}`; // Assuming req.file.path contains the image URL
                }
                const createdPromo = yield this.promoService.create(newData);
                res.status(201).json({
                    message: "Promo created successfully",
                    data: createdPromo,
                });
            }
            catch (error) {
                res.status(400).json({ error });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                let newData = Object.assign({}, textData);
                if (req.file) {
                    const imagePath = req.file.path.split("uploads")[1].replace(/\\/g, "/");
                    newData.img_url = `uploads${imagePath}`;
                }
                const updatedPromo = yield this.promoService.update(id, newData);
                res.status(200).json({
                    message: "Promo updated successfully",
                    data: updatedPromo,
                });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            try {
                const deletedPromo = yield this.promoService.delete(id);
                res.status(200).json({
                    message: "Promo deleted successfully",
                    data: deletedPromo,
                });
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
}
