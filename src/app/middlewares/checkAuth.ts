import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env";
import AppError from "../errorHelpers/AppError";
import { AuthRequest } from "../interfaces/index.d";

export const checkAuth = (requiredRole?: string) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.token;

      if (!token) {
        return next(new AppError("Access Denied: No Token Provided", 401));
      }

      const decoded = jwt.verify(token, config.jwtSecret) as { email: string; role?: string };
      req.user = { email: decoded.email, role: decoded.role || "user" };

      if (requiredRole && req.user.role !== requiredRole) {
        return next(new AppError("Access Denied: Admin privileges required", 403));
      }

      next();
    } catch (error) {
      return next(new AppError("Access Denied: Invalid or Expired Token", 403));
    }
  };
};
