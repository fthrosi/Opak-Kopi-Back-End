import express, { Express, Request, Response } from 'express';
import http from 'http';
import { initializeSocket } from './socket/index.js';
import cookieParser from 'cookie-parser';
import authRouter from './api/auth/auth.route.js';
import userRouter from './api/users/user.route.js';
import menuCategoryRouter from './api/menu_categories/menu_category.route.js';
import menuRouter from './api/menus/menu.route.js';
import promoRouter from './api/promos/promo.route.js';
import feedBackRouter from './api/feedbacks/feedback.route.js';
import routerReservation from './api/reservations/reservation.route.js';
import orderRouter from './api/orders/order.route.js';
import routerReport from './api/reports/report.route.js';
import tableRouter from './api/tables/tables.route.js';
import reviewRouter from './api/reviews/review.route.js';
import dashboardRouter from './api/dashboard/dashboard.route.js';
import paymentRouter from './api/payment/payment.route.js';
import "./lib/cron/checkPaymentStatus.js"
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Dapatkan __dirname versi ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
// Inisialisasi aplikasi Express
const app: Express = express();
const server = http.createServer(app);
initializeSocket(server);
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middleware untuk menangani cookie
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware untuk menangani URL encoded body
app.use(express.urlencoded({ extended: true }));

// Middleware untuk membaca JSON body
app.use(express.json());

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/menu-categories', menuCategoryRouter);
app.use('/menus', menuRouter);
app.use('/promos', promoRouter);
app.use('/feedbacks', feedBackRouter);
app.use('/reservations', routerReservation);
app.use('/orders', orderRouter);
app.use('/reports', routerReport);
app.use('/tables', tableRouter);
app.use('/reviews', reviewRouter);
app.use('/dashboard', dashboardRouter);
app.use('/payment', paymentRouter);
// Contoh endpoint sederhana
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Selamat datang di API Opak Kopi!',
  });
});

// Menjalankan server
server.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});