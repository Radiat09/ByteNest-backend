import jwt from "jsonwebtoken";
import config from "../config/env";

export const generateToken = (payload: { email: string; role?: string }): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "1d" });
};

export const verifyToken = (token: string): { email: string; role?: string } => {
  return jwt.verify(token, config.jwtSecret) as { email: string; role?: string };
};
