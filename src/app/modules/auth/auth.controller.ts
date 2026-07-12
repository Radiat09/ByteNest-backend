import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { generateToken } from "../../utils/jwt";
import setCookie from "../../utils/setCookie";
import { UserService } from "../user/user.service";

const isProduction = process.env.NODE_ENV === "production";

const loginWithPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const user = await UserService.verifyPassword(email, password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const token = generateToken({ email: user.email, role: user.role });
  setCookie(res, token);

  sendResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data: { email: user.email, role: user.role, name: user.name },
  });
});

const setJwtToken = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const user = await UserService.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const token = generateToken({ email: user.email, role: user.role });
  setCookie(res, token);

  sendResponse(res, {
    statusCode: 200,
    message: "JWT cookie set successfully",
    data: { email: user.email, role: user.role },
  });
});

const clearToken = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  sendResponse(res, {
    statusCode: 200,
    message: "Token cleared successfully",
    data: null,
  });
});

export const AuthController = {
  loginWithPassword,
  setJwtToken,
  clearToken,
};
