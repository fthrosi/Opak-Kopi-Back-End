import { PrismaClient } from '@prisma/client';

// Deklarasikan variabel global untuk menyimpan instance prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Buat satu instance PrismaClient, atau gunakan yang sudah ada jika dalam mode development
const prisma = global.prisma || new PrismaClient();

// Jika bukan di mode produksi, simpan instance ke variabel global
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Ekspor instance tunggal tersebut
export default prisma;