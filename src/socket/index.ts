import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NotificationData } from "../types/socket.js";

dotenv.config();

interface TokenPayload {
  userId: number;
  role: string | {id: number; name: string};
  email?: string;
  iat?: number;
  exp?: number;
}

interface SocketUser {
  userId?: number;
  role: string;
}

interface PingResponse {
  status: string;
  userId: number | null;
  role: string;
}

interface AuthenticatedSocket extends Socket {
  data: {
    user: SocketUser;
  };
}

let io: SocketIOServer;

// Map untuk menyimpan socket connections berdasarkan userId
const userSockets: Map<number, string> = new Map();

export function initializeSocket(server: HttpServer): SocketIOServer {
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
  io.use((socket: AuthenticatedSocket, next) => {
    let token = socket.handshake.auth.token as string | undefined;

    if (!token && socket.request.headers.cookie) {
      try {
        const cookies = socket.request.headers.cookie
          .split(";")
          .reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            if (key && value) acc[key] = value;
            return acc;
          }, {} as Record<string, string>);

        token = cookies["accessToken"] || cookies["jwt"] || cookies["token"];
      } catch (error) {
      }
    }

    socket.data.user = { role: "Guest" };

    if (!token) {
      return next();
    }

    try {
      // Verifikasi token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as TokenPayload;

      const roleName = typeof decoded.role === 'string' 
    ? decoded.role 
    : decoded.role.name;

      socket.data.user = {
        userId: decoded.userId,
        role: roleName,
      };

      next();
    } catch (err) {
      socket.data.user = { role: "Guest" };
      next();
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.data.user?.userId;
    const userRole = socket.data.user?.role;
    if (userId) {
      userSockets.set(userId, socket.id);

      if (typeof userRole === "string") {
        socket.join(userRole);

        // Debug: Log all rooms this socket has joined
        const socketRooms = Array.from(socket.rooms.values()).filter(
          (room) => room !== socket.id
        );
      } else {
        socket.join("Guest");
      }
    } else {
      socket.join("Guest");
    }

    socket.emit("auth_status", {
      userId: socket.data.user?.userId,
      role: socket.data.user?.role,
      rooms: Array.from(socket.rooms),
    });

    // Log all rooms for debugging
    const rooms = Array.from(socket.rooms);

    // Ping handler
    socket.on("ping", (callback: (response: PingResponse) => void) => {
      const response: PingResponse = {
        status: "connected",
        userId: socket.data.user?.userId || null,
        role: socket.data.user?.role || "Guest",
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
export function sendNotificationToUser(
  userId: number,
  event: string,
  data: NotificationData
): boolean {
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
export function sendNotificationToRole(
  role: string,
  event: string,
  data: NotificationData
): boolean {
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

export function getSocketIO(): SocketIOServer {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
}
