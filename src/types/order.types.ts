export type Order = {
    userId?: number;
    customer_name: string;
    table_id?: number;
    promo_id?: number;
    point_use?: number;
    note?: string;
    payment_method?: string;
    order_items: {
        menu_id: number;
        quantity: number;
    }[];
};
export type UserInfo = {
    userId: number;
    role : string
}

