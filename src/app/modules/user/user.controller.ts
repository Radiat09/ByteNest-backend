import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";
import { AuthRequest } from "../../interfaces/index.d";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);
  sendResponse(res, {
    statusCode: 201,
    message: "User created successfully",
    data: result,
  });
});

const getUserByEmail = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email as string;
  const result = await UserService.getUserByEmail(email);
  if (!result) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  sendResponse(res, {
    statusCode: 200,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const { email } = req.body;
  const result = await UserService.updateUser(email, req.body);
  sendResponse(res, {
    statusCode: 200,
    message: "User updated successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { customer } = req.query;
  const result = await UserService.getAllUsers(customer as string);
  sendResponse(res, {
    statusCode: 200,
    message: "Users retrieved successfully",
    data: result,
  });
});

const makeAdmin = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await UserService.makeAdmin(email);
  sendResponse(res, {
    statusCode: 200,
    message: "User promoted to admin",
    data: result,
  });
});

export const UserController = {
  createUser,
  getUserByEmail,
  updateUser,
  getAllUsers,
  makeAdmin,
};
