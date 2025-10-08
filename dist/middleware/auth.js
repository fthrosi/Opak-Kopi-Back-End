var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AuthRepository } from '../api/auth/auth.repository.js';
import jwt from 'jsonwebtoken';
const db = new AuthRepository();
export function validateRegisterBody(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield db.findByEmail(email);
            if (result) {
                return res.status(400).json({ error: 'Email sudah terdaftar' });
            }
            next();
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });
}
export function validateLoginBody(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield db.findByEmail(email);
            if (!result) {
                return res.status(400).json({ error: 'Email tidak terdaftar' });
            }
            if (!result.email_verified_at) {
                return res.status(400).json({ error: 'Email belum diverifikasi' });
            }
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
        next();
    });
}
export function validateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const secretKey = process.env.JWT_SECRET;
            const decoded = jwt.verify(accessToken, secretKey);
            req.user = decoded; // Attach user info to request object
            next();
        }
        catch (err) {
            return res.status(401).json({ error: 'Token tidak valid' });
        }
    });
}
export const validateRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Akses ditolak, pengguna tidak ditemukan' });
        }
        if (!allowedRoles.includes(user.role.name)) {
            return res.status(403).json({ error: 'Akses ditolak, role tidak diizinkan' });
        }
        next();
    };
};
