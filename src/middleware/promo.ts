import { Request,Response,NextFunction } from "express";

export async function validateCreatePromoBody(req: Request, res: Response, next: NextFunction) {
    const { name,amount_value, description, promo_type,percent_value } = req.body;
    if (!name || !description || !promo_type ) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if( promo_type === "percent" && !percent_value) {
        return res.status(400).json({ error: 'Percent value is required for percent promo type' });
    }
    if( promo_type === "amount" && !amount_value) {
        return res.status(400).json({ error: 'Minimum purchase is required for amount promo type' });
    }
    next();
}