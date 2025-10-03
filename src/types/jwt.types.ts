type role = {
  name: string;
}
export interface AppJWTPayload {
  userId: number;
  email: string;
  name: string;
  phone: string | null;
  img: string | null;
  poin: number | null;
  role: role;

  // Properti iat & exp ditambahkan otomatis oleh jsonwebtoken
  iat?: number;
  exp?: number;
}