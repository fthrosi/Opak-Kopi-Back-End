import { PromoRepository } from "./promo.repository.js";
import { Prisma } from "@prisma/client";
import fs from "fs/promises";
import { PromoUpdateInputWithMenuIds } from "../../types/promo.types.js";
import { PromoCreateInputWithMenuIds } from "../../types/promo.types.js";
import crypto from "crypto";
import dayjs from "dayjs";

export class PromoService {
  private promoRepository: PromoRepository;
  constructor() {
    this.promoRepository = new PromoRepository();
  }
  async findAll() {
    const promos = await this.promoRepository.findAll();
    if (!promos || promos.length === 0) {
      throw new Error("No promos found");
    }
    return promos;
  }
  async findAllWithClaimCount() {
    try {
      const promos = await this.promoRepository.findAllWithClaimCount();
      promos.forEach((promo) => {
        promo.img_url = `${process.env.BASE_URL}/${promo.img_url}`;
      });
      return promos;
    } catch (error) {
      throw error;
    }
  }
  async findByStatus(status: string) {
    try {
      const promos = await this.promoRepository.findByStatus(status);
      return promos;
    } catch (error: string | any) {
      throw error;
    }
  }
  async findById(id: number) {
    const promo = await this.promoRepository.findById(id);
    if (!promo) {
      throw new Error("Promo not found");
    }
    return promo;
  }
  async findByType(type: string) {
    const promos = await this.promoRepository.findByType(type);
    if (!promos || promos.length === 0) {
      throw new Error("No promos found for this type");
    }
    return promos;
  }
  async findByCode(code: string, menuIds?: number[]) {
    try {
      const promo = await this.promoRepository.findByCode(code);
      const date = new Date();
      if (promo) {
        if (promo.end_date < date) {
          throw { status: 400, message: "Promo has expired" };
        } else if (promo.start_date > date) {
          throw { status: 400, message: "Promo is not active yet" };
        }
        const promoMenus = await this.promoRepository.getPromoMenus(promo.id);
        if (promoMenus && promoMenus.length > 0) {
          const menus = promoMenus.map((promoMenu) => promoMenu.menu);
          const promoMenuIds = menus.map((menu) => menu.id);

          if (menuIds && menuIds.length > 0) {
            const isValidMenus = menuIds.every((menuId) =>
              promoMenuIds.includes(menuId)
            );
            if (!isValidMenus) {
              const invalidMenus = menuIds.filter(
                (menuId) => !promoMenuIds.includes(menuId)
              );
              throw {
                status: 400,
                message: `Promo hanya dapat digunakan jika ada menu: ${menus
                  .map((m) => m.name)
                  .join(" , ")}`,
              };
            }
          } else {
            throw {
              status: 400,
              message: `Promo hanya berlaku untuk menu: ${menus
                .map((m) => m.name)
                .join(", ")}`,
            };
          }

          (promo as any).menus = menus;
        } else {
          (promo as any).menus = [];
        }
      }
      if (!promo) {
        throw { status: 404, message: "Promo not found" };
      }
      return promo;
    } catch (error: string | any) {
      throw error;
    }
  }
  async create(data: PromoCreateInputWithMenuIds) {
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
        delete (data as any).menu_id;
      }
      const createdPromo = await this.promoRepository.create(data);
      if (!createdPromo) {
        throw new Error("Promo creation failed");
      }
      if (menu_id) {
        const newMenuIds: number[] = JSON.parse(menu_id);
        for (const menuId of newMenuIds) {
          try {
            const createdPromoMenu = await this.promoRepository.createPromoMenu(
              {
                menu: { connect: { id: menuId } },
                promo: { connect: { id: createdPromo.id } },
              }
            );
          } catch (error) {
            throw error;
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }
  async update(id: number, data: PromoUpdateInputWithMenuIds) {
    try {
      const currentPromo = await this.promoRepository.findById(id);
      if (data.img_url && currentPromo?.img_url) {
        try {
          await fs.unlink(currentPromo.img_url);
        } catch (error) {
          throw new Error("Failed to delete old image");
        }
      }
      if (data.minimum_purchase) {
        try {
          const deletedPromoMenu = await this.promoRepository.deletePromoMenus(
            id
          );
        } catch (error) {
          throw error;
        }
      }
      if (data.menu_id) {
        const existingPromoMenus = await this.promoRepository.getPromoMenus(id);
        const existingMenuIds = existingPromoMenus.map((pm) => pm.menu.id);
        const newMenuIds: number[] = JSON.parse(data.menu_id);
        const menuIdsToAdd = newMenuIds.filter(
          (menuId) => !existingMenuIds.includes(menuId)
        );
        const menuIdsToRemove = existingMenuIds.filter(
          (menuId) => !newMenuIds.includes(menuId)
        );
        if (menuIdsToAdd.length !== 0) {
          for (const menuId of menuIdsToAdd) {
            try {
              const createdPromoMenu =
                await this.promoRepository.createPromoMenu({
                  menu: { connect: { id: menuId } },
                  promo: { connect: { id } },
                });
            } catch (error) {
              throw error;
            }
          }
        }
        if (menuIdsToRemove.length !== 0) {
          for (const menuId of menuIdsToRemove) {
            try {
              const deletedPromoMenu =
                await this.promoRepository.deletePromoMenus(id, menuId);
            } catch (error) {
              throw error;
            }
          }
        }
      }
      if ("menu_id" in data) {
        data.minimum_purchase = null;
        delete (data as any).menu_id;
      }
      const updatedPromo = await this.promoRepository.update(id, data);
      return updatedPromo;
    } catch (error) {
      throw error;
    }
  }
  async delete(id: number) {
    const nowString = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    const delete_at = nowString + "Z";
    const deletedPromo = await this.promoRepository.update(id, { delete_at });
    if (!deletedPromo) {
      throw new Error("Promo deletion failed");
    }
    return deletedPromo;
  }
  async createPromoMenu(id_menu: number, id_promo: number) {
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
    const createdPromoMenu = await this.promoRepository.createPromoMenu(data);
    if (!createdPromoMenu) {
      throw new Error("Promo menu creation failed");
    }
    return createdPromoMenu;
  }
}
