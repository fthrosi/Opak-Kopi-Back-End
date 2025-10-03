export type dateRange = {
    start: Date;
    end: Date;
};
export type dailyReportRow = {
    tanggal: string;
    jumlahTransaksi: number;
    pendapatanKotor: number;
    diskonPromo: number;
    nilaiPoin: number;
    hpp: number;
    pendapatanBersih: number;
};
export type dailyReportSummary = {
    totalTransaksi: number;
    totalPendapatanKotor: number;
    totalDiskonPromo: number;
    totalNilaiPoin: number;
    totalHPP: number;
    totalPendapatanBersih: number;
}
export type dailyReportResponse = {
    summary: dailyReportSummary;
    rows: dailyReportRow[];
}
export type menuReportRow = {
    namaMenu: string;
    kategori: string;
    jumlahTerjual: number;
    pendapatanKotor: number;
    hpp: number;
    profitKotor: number;
}
export type menuReportSummary = {
    namaMenu: string;
    terjualTerbanyak: number;
    nama: string;
    ProfitPalingBesar: number;
};
export type menuReportResponse = {
    summary: menuReportSummary;
    rows: menuReportRow[];
};
export type promoReportRow = {
    namaPromo: string;
    periode: string;
    jumlahDigunakan: number;
    totalDiskon: number;
};
export type promoReportSummary = {
    id: number;
    namaPromo: string;
    terpakaiPalingBanyak: number;
    nama: string;
    totalDiskon: number;
};
export type promoReportResponse = {
    summary: promoReportSummary;
    rows: promoReportRow[];
};
export type reservasiRow = {
    tanggal : string;
    jumlahReservasi: number;
    jumlahDiterima: number;
    jumlahDibatalkan: number;
    jumlahDitolak: number;
    jumlahHadir: number;
    jumlahTidakHadir: number;
};

export type reservasiSummary = {
    totalReservasi: number;
    tingkatKehadiran: number;
    tingkatTidakHadir: number;
};

export type reservasiResponse = {
    summary: reservasiSummary;
    rows: reservasiRow[];
};