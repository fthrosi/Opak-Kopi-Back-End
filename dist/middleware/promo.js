var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function validateCreatePromoBody(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, amount_value, description, promo_type, percent_value } = req.body;
        if (!name || !description || !promo_type) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (promo_type === "percent" && !percent_value) {
            return res.status(400).json({ error: 'Percent value is required for percent promo type' });
        }
        if (promo_type === "amount" && !amount_value) {
            return res.status(400).json({ error: 'Minimum purchase is required for amount promo type' });
        }
        next();
    });
}
