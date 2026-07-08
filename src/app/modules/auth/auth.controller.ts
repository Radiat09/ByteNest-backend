import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { generateToken } from "../../utils/jwt";
import setCookie from "../../utils/setCookie";
import { UserService } from "../user/user.service";

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
    secure: true,
    sameSite: "none",
  });
  sendResponse(res, {
    statusCode: 200,
    message: "Token cleared successfully",
    data: null,
  });
});

export const AuthController = {
  setJwtToken,
  clearToken,
};
