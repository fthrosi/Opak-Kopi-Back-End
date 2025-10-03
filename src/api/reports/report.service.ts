import { ReportRepository } from "./report.repository.js";
import {
  dateRange,
  dailyReportRow,
  dailyReportSummary,
  dailyReportResponse,
  menuReportResponse,
  menuReportRow,
  menuReportSummary,
  promoReportSummary,
  reservasiRow,
  reservasiSummary,
  reservasiResponse,
} from "../../types/report.types.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);

export class ReportService {
  private reportRepository: ReportRepository;
  constructor() {
    this.reportRepository = new ReportRepository();
  }
  async getSalesReport(
    startDate?: string,
    endDate?: string
  ): Promise<dailyReportResponse> {
    let start, end;
    if (
      startDate &&
      endDate &&
      startDate.trim() !== "" &&
      endDate.trim() !== ""
    ) {
      start =
        dayjs(startDate)
          .tz("Asia/Jakarta")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00") + "Z";
      end =
        dayjs(endDate)
          .tz("Asia/Jakarta")
          .endOf("day")
          .format("YYYY-MM-DD 23:59:59") + "Z";
    } else {
      const now = dayjs().tz("Asia/Jakarta");
      start = now.startOf("month").format("YYYY-MM-DD 00:00:00") + "Z";
      end = now.endOf("month").format("YYYY-MM-DD 23:59:59") + "Z";
    }
    const report = await this.reportRepository.getSalesReport(start, end);
    const dailyReportRecord: Record<string, dailyReportRow> = {};

    report.forEach((item) => {
      const date = item.created_at.toISOString().split("T")[0];
      if (!dailyReportRecord[date]) {
        dailyReportRecord[date] = {
          tanggal: date,
          jumlahTransaksi: 0,
          pendapatanKotor: 0,
          diskonPromo: 0,
          nilaiPoin: 0,
          hpp: 0,
          pendapatanBersih: 0,
        };
      }
      let grossRevenueFromItems = 0;
      let totalCogsFromItems = 0;

      item.order_items.forEach((item) => {
        grossRevenueFromItems += item.price_at_transaction * item.quantity;
        totalCogsFromItems += item.cogs_at_transaction * item.quantity;
      });

      dailyReportRecord[date].jumlahTransaksi += 1;
      dailyReportRecord[date].pendapatanKotor += grossRevenueFromItems;
      dailyReportRecord[date].diskonPromo += item.promo_value ?? 0;
      dailyReportRecord[date].nilaiPoin += item.points_value_used ?? 0;
      dailyReportRecord[date].hpp += totalCogsFromItems;
      dailyReportRecord[date].pendapatanBersih += item.total_price;
    });

    const summary: dailyReportSummary = {
      totalTransaksi: 0,
      totalPendapatanKotor: 0,
      totalDiskonPromo: 0,
      totalNilaiPoin: 0,
      totalHPP: 0,
      totalPendapatanBersih: 0,
    };

    const rows: dailyReportRow[] = Object.values(dailyReportRecord);
    rows.forEach((row) => {
      summary.totalTransaksi += row.jumlahTransaksi;
      summary.totalPendapatanKotor += row.pendapatanKotor;
      summary.totalDiskonPromo += row.diskonPromo;
      summary.totalNilaiPoin += row.nilaiPoin;
      summary.totalHPP += row.hpp;
      summary.totalPendapatanBersih += row.pendapatanBersih;
    });
    return {
      summary,
      rows,
    };
  }

  async getReservasiReport(
    startDate?: string,
    endDate?: string
  ): Promise<reservasiResponse> {
    let start, end;
    if (
      startDate &&
      endDate &&
      startDate.trim() !== "" &&
      endDate.trim() !== ""
    ) {
      start =
        dayjs(startDate)
          .tz("Asia/Jakarta")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00") + "Z";
      end =
        dayjs(endDate)
          .tz("Asia/Jakarta")
          .endOf("day")
          .format("YYYY-MM-DD 23:59:59") + "Z";
    } else {
      const now = dayjs().tz("Asia/Jakarta");
      start = now.startOf("month").format("YYYY-MM-DD 00:00:00") + "Z";
      end = now.endOf("month").format("YYYY-MM-DD 23:59:59") + "Z";
    }
    const report = await this.reportRepository.getReservasiReport(start, end);
    const reservasiRecord: Record<string, reservasiRow> = {};

    report.forEach((item) => {
      const date = item.reservation_time.toISOString().split("T")[0];
      if (!reservasiRecord[date]) {
        reservasiRecord[date] = {
          tanggal: date,
          jumlahReservasi: 0,
          jumlahDiterima: 0,
          jumlahDibatalkan: 0,
          jumlahDitolak: 0,
          jumlahHadir: 0,
          jumlahTidakHadir: 0,
        };
      }
      reservasiRecord[date].jumlahReservasi += 1;
      reservasiRecord[date].jumlahDiterima +=
        item.status === "Diterima" ? 1 : 0;
      reservasiRecord[date].jumlahDibatalkan +=
        item.status === "Dibatalkan" ? 1 : 0;
      reservasiRecord[date].jumlahDitolak += item.status === "Ditolak" ? 1 : 0;
      reservasiRecord[date].jumlahHadir += item.status === "Hadir" ? 1 : 0;
      reservasiRecord[date].jumlahTidakHadir +=
        item.status === "Tidak Hadir" ? 1 : 0;
    });

    const summary: reservasiSummary = {
      totalReservasi: 0,
      tingkatKehadiran: 0,
      tingkatTidakHadir: 0,
    };

    const rows: reservasiRow[] = Object.values(reservasiRecord);
    rows.forEach((row) => {
      summary.totalReservasi += row.jumlahReservasi;
      summary.tingkatKehadiran += row.jumlahHadir;
      summary.tingkatTidakHadir += row.jumlahTidakHadir;
    });

    summary.tingkatKehadiran =
      (summary.tingkatKehadiran / summary.totalReservasi) * 100 || 0;
    summary.tingkatTidakHadir =
      (summary.tingkatTidakHadir / summary.totalReservasi) * 100 || 0;

    return {
      summary,
      rows,
    };
  }

  async getMenuReport(
    startDate?: string,
    endDate?: string
  ): Promise<menuReportResponse> {
    let start, end;
    if (
      startDate &&
      endDate &&
      startDate.trim() !== "" &&
      endDate.trim() !== ""
    ) {
      start =
        dayjs(startDate)
          .tz("Asia/Jakarta")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00") + "Z";
      end =
        dayjs(endDate)
          .tz("Asia/Jakarta")
          .endOf("day")
          .format("YYYY-MM-DD 23:59:59") + "Z";
    } else {
      const now = dayjs().tz("Asia/Jakarta");
      start = now.startOf("month").format("YYYY-MM-DD 00:00:00") + "Z";
      end = now.endOf("month").format("YYYY-MM-DD 23:59:59") + "Z";
    }
    const report = await this.reportRepository.getMenuReport(start, end);
    const menuReportRecord: Record<string, menuReportRow> = {};

    report.forEach((item) => {
      item.order_items.forEach((orderItem) => {
        const menuName = orderItem.name_menu;
        const categoryName = orderItem.menu?.category?.name;

        if (!menuReportRecord[menuName]) {
          menuReportRecord[menuName] = {
            namaMenu: menuName,
            kategori: categoryName ? categoryName : "",
            jumlahTerjual: 0,
            pendapatanKotor: 0,
            hpp: 0,
            profitKotor: 0,
          };
        }

        menuReportRecord[menuName].jumlahTerjual += orderItem.quantity;
        menuReportRecord[menuName].pendapatanKotor += orderItem.subtotal;
        menuReportRecord[menuName].hpp +=
          orderItem.cogs_at_transaction * orderItem.quantity;
        menuReportRecord[menuName].profitKotor +=
          (orderItem.price_at_transaction - orderItem.cogs_at_transaction) *
          orderItem.quantity;
      });
    });

    const summary: menuReportSummary = {
      namaMenu: "",
      terjualTerbanyak: 0,
      nama: "",
      ProfitPalingBesar: 0,
    };

    const rows: menuReportRow[] = Object.values(menuReportRecord);
    rows.forEach((row) => {
      if (row.jumlahTerjual > summary.terjualTerbanyak) {
        summary.terjualTerbanyak = row.jumlahTerjual;
        summary.namaMenu = row.namaMenu;
      }
      if (row.profitKotor > summary.ProfitPalingBesar) {
        summary.ProfitPalingBesar = row.profitKotor;
        summary.nama = row.namaMenu;
      }
    });

    return {
      summary,
      rows,
    };
  }
  async getPromoReport(startDate?: string, endDate?: string) {
    let start, end;
    if (
      startDate &&
      endDate &&
      startDate.trim() !== "" &&
      endDate.trim() !== ""
    ) {
      start =
        dayjs(startDate)
          .tz("Asia/Jakarta")
          .startOf("day")
          .format("YYYY-MM-DD 00:00:00") + "Z";
      end =
        dayjs(endDate)
          .tz("Asia/Jakarta")
          .endOf("day")
          .format("YYYY-MM-DD 23:59:59") + "Z";
    } else {
      const now = dayjs().tz("Asia/Jakarta");
      start = now.startOf("month").format("YYYY-MM-DD 00:00:00") + "Z";
      end = now.endOf("month").format("YYYY-MM-DD 23:59:59") + "Z";
    }
    const promoUsageStats = await this.reportRepository.getPromoReport(
      start,
      end
    );

    const usageMap = new Map();
    for (const stat of promoUsageStats) {
      if (stat.promo_id) {
        usageMap.set(stat.promo_id, {
          count: stat._count.promo_id,
          totalDiskon: stat._sum.promo_value,
        });
      }
    }

    const relevanPromo = await this.reportRepository.findActiveRange();
    const rows = relevanPromo.map((promo) => {
      const usage = usageMap.get(promo.id);
      return {
        id: promo.id,
        namaPromo: promo.name || "Promo tidak diketahui",
        periode: `${promo.start_date || "Tanggal tidak diketahui"} - ${promo.end_date || "Tanggal tidak diketahui"}`,
        jumlahDigunakan: usage?.count || 0,
        totalDiskon: usage?.totalDiskon || 0,
      };
    });
    const summary: promoReportSummary = {
      id: 0,
      namaPromo: "",
      terpakaiPalingBanyak: 0,
      nama: "",
      totalDiskon: 0,
    };

    rows.forEach((row) => {
      if (row.jumlahDigunakan > summary.terpakaiPalingBanyak) {
        summary.terpakaiPalingBanyak = row.jumlahDigunakan;
        summary.namaPromo = row.namaPromo;
      }
      if (row.totalDiskon > summary.totalDiskon) {
        summary.totalDiskon = row.totalDiskon;
        summary.nama = row.namaPromo;
      }
    });

    return {
      summary,
      rows,
    };
  }
}
