var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PromoRepository } from "./promo.repository.js";
import fs from "fs/promises";
import crypto from "crypto";
import dayjs from "dayjs";
export class PromoService {
    constructor() {
        this.promoRepository = new PromoRepository();
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const promos = yield this.promoRepository.findAll();
            if (!promos || promos.length === 0) {
                throw new Error("No promos found");
            }
            return promos;
        });
    }
    findAllWithClaimCount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promos = yield this.promoRepository.findAllWithClaimCount();
                promos.forEach((promo) => {
                    promo.img_url = `${process.env.BASE_URL}/${promo.img_url}`;
                });
                return promos;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promos = yield this.promoRepository.findByStatus(status);
                return promos;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const promo = yield this.promoRepository.findById(id);
            if (!promo) {
                throw new Error("Promo not found");
            }
            return promo;
        });
    }
    findByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const promos = yield this.promoRepository.findByType(type);
            if (!promos || promos.length === 0) {
                throw new Error("No promos found for this type");
            }
            return promos;
        });
    }
    findByCode(code, menuIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promo = yield this.promoRepository.findByCode(code);
                const date = new Date();
                if (promo) {
                    if (promo.end_date < date) {
                        throw { status: 400, message: "Promo has expired" };
                    }
                    else if (promo.start_date > date) {
                        throw { status: 400, message: "Promo is not active yet" };
                    }
                    const promoMenus = yield this.promoRepository.getPromoMenus(promo.id);
                    if (promoMenus && promoMenus.length > 0) {
                        const menus = promoMenus.map((promoMenu) => promoMenu.menu);
                        const promoMenuIds = menus.map((menu) => menu.id);
                        if (menuIds && menuIds.length > 0) {
                            const isValidMenus = promoMenuIds.every((menuId) => menuIds.includes(menuId));
                            if (!isValidMenus) {
                                throw {
                                    status: 400,
                                    message: `Promo hanya dapat digunakan jika ada menu: ${menus
                                        .map((m) => m.name)
                                        .join(" , ")}`,
                                };
                            }
                        }
                        promo.menus = menus;
                    }
                    else {
                        promo.menus = [];
                    }
                }
                if (!promo) {
                    throw { status: 404, message: "Promo not found" };
                }
                return promo;
            }
            catch (error) {
                throw error;
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                data.status = "Aktif";
                let menu_id;
                if (!data.promo_code) {
                    const code = crypto.randomBytes(3).toString("hex").toUpperCase();
                    const promoCode = `PRO-${code}`;
                    data.promo_code = promoCode;
                }
                if (data.menu_id) {
                    menu_id = data.menu_id;
                    data.minimum_purchase = null;
                    delete data.menu_id;
                }
                const createdPromo = yield this.promoRepository.create(data);
                if (!createdPromo) {
                    throw new Error("Promo creation failed");
                }
                if (menu_id) {
                    const newMenuIds = JSON.parse(menu_id);
                    for (const menuId of newMenuIds) {
                        try {
                            const createdPromoMenu = yield this.promoRepository.createPromoMenu({
                                menu: { connect: { id: menuId } },
                                promo: { connect: { id: createdPromo.id } },
                            });
                        }
                        catch (error) {
                            throw error;
                        }
                    }
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentPromo = yield this.promoRepository.findById(id);
                if (data.img_url && (currentPromo === null || currentPromo === void 0 ? void 0 : currentPromo.img_url)) {
                    try {
                        yield fs.unlink(currentPromo.img_url);
                    }
                    catch (error) {
                        throw new Error("Failed to delete old image");
                    }
                }
                if (data.minimum_purchase) {
                    try {
                        const deletedPromoMenu = yield this.promoRepository.deletePromoMenus(id);
                    }
                    catch (error) {
                        throw error;
                    }
                }
                if (data.menu_id) {
                    const existingPromoMenus = yield this.promoRepository.getPromoMenus(id);
                    const existingMenuIds = existingPromoMenus.map((pm) => pm.menu.id);
                    const newMenuIds = JSON.parse(data.menu_id);
                    const menuIdsToAdd = newMenuIds.filter((menuId) => !existingMenuIds.includes(menuId));
                    const menuIdsToRemove = existingMenuIds.filter((menuId) => !newMenuIds.includes(menuId));
                    if (menuIdsToAdd.length !== 0) {
                        for (const menuId of menuIdsToAdd) {
                            try {
                                const createdPromoMenu = yield this.promoRepository.createPromoMenu({
                                    menu: { connect: { id: menuId } },
                                    promo: { connect: { id } },
                                });
                            }
                            catch (error) {
                                throw error;
                            }
                        }
                    }
                    if (menuIdsToRemove.length !== 0) {
                        for (const menuId of menuIdsToRemove) {
                            try {
                                const deletedPromoMenu = yield this.promoRepository.deletePromoMenus(id, menuId);
                            }
                            catch (error) {
                                throw error;
                            }
                        }
                    }
                }
                if ("menu_id" in data) {
                    data.minimum_purchase = null;
                    delete data.menu_id;
                }
                const updatedPromo = yield this.promoRepository.update(id, data);
                return updatedPromo;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowString = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
            const delete_at = nowString + "Z";
            const deletedPromo = yield this.promoRepository.update(id, { delete_at });
            if (!deletedPromo) {
                throw new Error("Promo deletion failed");
            }
            return deletedPromo;
        });
    }
    createPromoMenu(id_menu, id_promo) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                menu: {
                    connect: {
                        id: id_menu,
                    },
                },
                promo: {
                    connect: {
                        id: id_promo,
                    },
                },
            };
            const createdPromoMenu = yield this.promoRepository.createPromoMenu(data);
            if (!createdPromoMenu) {
                throw new Error("Promo menu creation failed");
            }
            return createdPromoMenu;
        });
    }
}
