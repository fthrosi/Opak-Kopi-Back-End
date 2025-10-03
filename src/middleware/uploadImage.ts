import multer from "multer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..","..");
const productStorage = multer.diskStorage({
  destination: (req : Request, file : Express.Multer.File, cb: Function) => {
    cb(null, path.join(rootDir, "uploads/products/"));
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null,'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const profileStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, path.join(rootDir, "uploads/profiles/"));
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null,'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const promoStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, path.join(rootDir, "uploads/promos/"));
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null,'promo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const uploadProductImage = multer({ 
    storage: productStorage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
      const allowedTypes = /jpeg|jpg|png/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    }
});

export const uploadProfileImage = multer({ 
    storage: profileStorage,
    limits: {
      fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
      const allowedTypes = /jpeg|jpg|png/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    }
});


export const uploadPromoImage = multer({ 
    storage: promoStorage,
    limits: {
      fileSize: 2 * 1024 * 1024 // 2MB
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
      const allowedTypes = /jpeg|jpg|png/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    }
});