import { Request, Response, NextFunction } from 'express';
import { AuthRepository } from '../api/auth/auth.repository.js';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import { AppJWTPayload } from '../types/jwt.types.js';

const db = new AuthRepository();

export interface CustomRequest extends Request {
  user?: AppJWTPayload
}
export async function validateRegisterBody(req :Request, res: Response, next: NextFunction) {
  const { email, password, name } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Semua Form Harus Diisi' });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email tidak valid' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password minimal 6 karakter' });
  }
  try {
    const result = await db.findByEmail(email);
    if (result) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }
    next();
  } catch (err : string | any) {
    return res.status(500).json({ error: err.message });
  }
}
export async function validateLoginBody(req :Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan Password harus diisi' });
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email tidak valid' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password minimal 6 karakter' });
  }
  try {
    const result = await db.findByEmail(email);
    if (!result) {
      return res.status(400).json({ error: 'Email tidak terdaftar' });
    }
    if (!result.email_verified_at) {
      return res.status(400).json({ error: 'Email belum diverifikasi' });
    }
  } catch (err : string | any) {
    return res.status(500).json({ error: err.message });
  }
  next();
}

export async function validateToken(req: CustomRequest, res: Response, next: NextFunction) {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  const ip = req.ip || 'unknown';
  const agent = req.headers['user-agent'] || 'unknown';
  if (!accessToken) {
    return res.status(401).json({ error: 'Akses ditolak, token tidak ditemukan' });
  }
  if (!refreshToken) {
    return res.status(401).json({ error: 'Akses ditolak, refresh token tidak ditemukan' });
  }
  // Verify the access token
  try {
    const secretKey = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(accessToken, secretKey) as AppJWTPayload;
    req.user = decoded; // Attach user info to request object
    next();
  } catch (err : string | any) {
    return res.status(401).json({ error: 'Token tidak valid' });
  }
}
export const validateRole = (allowedRoles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Akses ditolak, pengguna tidak ditemukan' });
    }
    if (!allowedRoles.includes(user.role.name)) {
      return res.status(403).json({ error: 'Akses ditolak, role tidak diizinkan' });
    }
    next();
  }
}