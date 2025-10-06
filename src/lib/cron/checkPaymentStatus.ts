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
cron.schedule("*/2 * * * *", async () => {
  try {
    const pendingOrders = await prisma.order.findMany({
      where: { status: "Menunggu Pembayaran" },
    });

    for (const order of pendingOrders) {
      const createdAt = dayjs(order.created_at);
      const nowString = dayjs().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
          const timeNow = nowString + "Z";
            const timeNowDayjs = dayjs(timeNow);
        const diffMinutes = timeNowDayjs.diff(createdAt, "minute");
      if (diffMinutes >= 11) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "Gagal" },
        });
        continue;
      }
    }
  } catch (err) {
    console.error("[CRON ERROR]", err);
  }
});
