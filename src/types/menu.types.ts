import { Prisma } from "@prisma/client";

export type MenuUpdateInputWithCategoryId = Prisma.MenuUpdateInput & {
  category_id?: number;
};