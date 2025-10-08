import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
let io;
// Map untuk menyimpan socket connections berdasarkan userId
const userSockets = new Map();
export function initializeSocket(server) {
    io = new SocketIOServer(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });
    // Middleware untuk autentikasi
    io.use((socket, next) => {
        let token = socket.handshake.auth.token;
        if (!token && socket.request.headers.cookie) {
            try {
                const cookies = socket.request.headers.cookie
                    .split(";")
                    .reduce((acc, cookie) => {
                    const [key, value] = cookie.trim().split("=");
                    if (key && value)
                        acc[key] = value;
                    return acc;
                }, {});
                token = cookies["accessToken"] || cookies["jwt"] || cookies["token"];
            }
            catch (error) {
            }
        }
        socket.data.user = { role: "Guest" };
        if (!token) {
            return next();
        }
        try {
            // Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const roleName = typeof decoded.role === 'string'
                ? decoded.role
                : decoded.role.name;
            socket.data.user = {
                userId: decoded.userId,
                role: roleName,
            };
            next();
        }
        catch (err) {
            socket.data.user = { role: "Guest" };
            next();
        }
    });
    io.on("connection", (socket) => {
        var _a, _b, _c, _d;
        const userId = (_a = socket.data.user) === null || _a === void 0 ? void 0 : _a.userId;
        const userRole = (_b = socket.data.user) === null || _b === void 0 ? void 0 : _b.role;
        if (userId) {
            userSockets.set(userId, socket.id);
            if (typeof userRole === "string") {
                socket.join(userRole);
                // Debug: Log all rooms this socket has joined
                const socketRooms = Array.from(socket.rooms.values()).filter((room) => room !== socket.id);
            }
            else {
                socket.join("Guest");
            }
        }
        else {
            socket.join("Guest");
        }
        socket.emit("auth_status", {
            userId: (_c = socket.data.user) === null || _c === void 0 ? void 0 : _c.userId,
            role: (_d = socket.data.user) === null || _d === void 0 ? void 0 : _d.role,
            rooms: Array.from(socket.rooms),
        });
        // Log all rooms for debugging
        const rooms = Array.from(socket.rooms);
        // Ping handler
        socket.on("ping", (callback) => {
            var _a, _b;
            const response = {
                status: "connected",
                userId: ((_a = socket.data.user) === null || _a === void 0 ? void 0 : _a.userId) || null,
                role: ((_b = socket.data.user) === null || _b === void 0 ? void 0 : _b.role) || "Guest",
            };
            if (typeof callback === "function") {
                callback(response);
            }
        });
        // Disconnect handler
        socket.on("disconnect", (reason) => {
            if (userId) {
                // Only remove if this is still the active socket for this user
                if (userSockets.get(userId) === socket.id) {
                    userSockets.delete(userId);
                }
            }
        });
    });
    return io;
}
// Function untuk mengirim notifikasi ke specific user
export function sendNotificationToUser(userId, event, data) {
    const socketId = userSockets.get(userId);
    if (socketId && io) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket && socket.connected) {
            io.to(socketId).emit(event, data);
            return true;
        }
    }
    return false;
}
// Function untuk mengirim notifikasi ke role tertentu
export function sendNotificationToRole(role, event, data) {
    if (io) {
        // Periksa apakah ada socket di room ini
        const room = io.sockets.adapter.rooms.get(role);
        const socketsCount = room ? room.size : 0;
        if (socketsCount === 0) {
            return false;
        }
        io.to(role).emit(event, data);
        return true;
    }
    return false;
}
export function getSocketIO() {
    if (!io) {
        throw new Error("Socket.IO not initialized");
    }
    return io;
}
