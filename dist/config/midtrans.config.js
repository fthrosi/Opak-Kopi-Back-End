import pkg from "midtrans-client";
const { Snap, CoreApi } = pkg;
const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
// CRITICAL: Inisialisasi dengan dummy objects untuk mencegah undefined
export const snap = new Snap({
    isProduction: isProduction,
    serverKey: serverKey,
    clientKey: clientKey,
});
export const coreApi = new CoreApi({
    isProduction: isProduction,
    serverKey: serverKey,
    clientKey: clientKey,
});
