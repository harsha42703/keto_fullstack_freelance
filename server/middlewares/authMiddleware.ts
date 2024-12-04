// src/middlewares/authMiddleware.ts

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: { userId: number; role: string };
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.cookies, "this is req.cookies");

    const token = req.cookies.ketoToken;
    console.log(token, "this is token");

    if (!token) {
      res.status(401).json({ message: "Access denied, no token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: string;
    };
    console.log(decoded, "this is decoded");

    req.user = { userId: decoded.userId, role: decoded.role };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error });
  }
};
