import cron from "node-cron";
import dayjs from "dayjs";
import prisma from "../../config/db.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Jakarta");

cron.schedule("*/2 * * * *", async () => {
  try {
    const now = dayjs().tz("Asia/Jakarta");
    const startOfDay = now.startOf("day").toDate();
    const endOfDay = now.endOf("day").toDate();

    const reservationsToday = await prisma.reservations.findMany({
      where: {
        reservation_time: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: "Diterima",
      },
    });

    for (const order of reservationsToday) {
      const reservation_time = dayjs(order.reservation_time);
      const nowString = dayjs()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD HH:mm:ss");
      const timeNow = nowString + "Z";
      const timeNowDayjs = dayjs(timeNow);
      const diffMinutes = timeNowDayjs.diff(reservation_time, "minute");
      if (diffMinutes >= 15) {
        await prisma.reservations.update({
          where: { id: order.id },
          data: { status: "Tidak Hadir" },
        });
        console.log(`[CRON] Reservation ID ${order.id} marked as "Tidak Hadir" (${diffMinutes} minutes late)`);
        continue;
      }
    }
  } catch (err) {
    console.error("[CRON ERROR]", err);
  }
});
