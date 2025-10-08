var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cron from "node-cron";
import dayjs from "dayjs";
import prisma from "../../config/db.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);
// Set timezone ke Asia/Jakarta
dayjs.tz.setDefault("Asia/Jakarta");
// Jalankan setiap 2 menit
cron.schedule("*/2 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingOrders = yield prisma.order.findMany({
            where: { status: "Menunggu Pembayaran" },
        });
        for (const order of pendingOrders) {
            const createdAt = dayjs(order.created_at);
            const nowString = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
            const timeNow = nowString + "Z";
            const timeNowDayjs = dayjs(timeNow);
            const diffMinutes = timeNowDayjs.diff(createdAt, "minute");
            if (diffMinutes >= 11) {
                yield prisma.order.update({
                    where: { id: order.id },
                    data: { status: "Gagal" },
                });
                continue;
            }
        }
    }
    catch (err) {
        console.error("[CRON ERROR]", err);
    }
}));
