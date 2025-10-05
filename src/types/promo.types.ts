import { Prisma } from "@prisma/client";

export type PromoCreateInputWithMenuIds = Prisma.PromoCreateInput & {
  menu_id?: string;
};
export type PromoUpdateInputWithMenuIds = Prisma.PromoUpdateInput & {
  menu_id?: string ;
};