import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoryService } from "./category.service";
import AppError from "../../errorHelpers/AppError";

const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories();
  res.json(result);
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);
  sendResponse(res, {
    statusCode: 201,
    message: "Category created successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CategoryService.deleteCategory(id);
  if (!result) {
    throw new AppError("Category not found", 404);
  }
  sendResponse(res, {
    statusCode: 200,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryController = {
  getAllCategories,
  createCategory,
  deleteCategory,
};
