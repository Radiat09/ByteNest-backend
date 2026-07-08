import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";
import AppError from "../../errorHelpers/AppError";

const getProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getProducts(req.query as any);
  res.json(result);
});

const getProductCount = catchAsync(async (req: Request, res: Response) => {
  const count = await ProductService.getProductCount(req.query as any);
  res.json({ count });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ProductService.getProductById(id);
  if (!result) {
    throw new AppError("Product not found", 404);
  }
  sendResponse(res, {
    statusCode: 200,
    message: "Product retrieved successfully",
    data: result,
  });
});

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req.body);
  sendResponse(res, {
    statusCode: 201,
    message: "Product created successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updateData = req.body.data || req.body;
  const result = await ProductService.updateProduct(id, updateData);
  sendResponse(res, {
    statusCode: 200,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await ProductService.deleteProduct(id);
  if (!result) {
    throw new AppError("Product not found", 404);
  }
  sendResponse(res, {
    statusCode: 200,
    message: "Product deleted successfully",
    data: result,
  });
});

export const ProductController = {
  getProducts,
  getProductCount,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
