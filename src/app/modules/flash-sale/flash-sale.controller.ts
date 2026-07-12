import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FlashSaleService } from "./flash-sale.service";
import AppError from "../../errorHelpers/AppError";

const getAllFlashSales = catchAsync(async (_req: Request, res: Response) => {
  const result = await FlashSaleService.getAllFlashSales();
  res.json(result);
});

const getActiveFlashSales = catchAsync(async (_req: Request, res: Response) => {
  const result = await FlashSaleService.getActiveFlashSales();
  res.json(result);
});

const createFlashSale = catchAsync(async (req: Request, res: Response) => {
  const result = await FlashSaleService.createFlashSale(req.body);
  sendResponse(res, {
    statusCode: 201,
    message: "Flash sale created successfully",
    data: result,
  });
});

const updateFlashSale = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await FlashSaleService.updateFlashSale(id, req.body);
  if (!result) {
    throw new AppError("Flash sale not found", 404);
  }
  sendResponse(res, {
    statusCode: 200,
    message: "Flash sale updated successfully",
    data: result,
  });
});

const deleteFlashSale = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await FlashSaleService.deleteFlashSale(id);
  if (!result) {
    throw new AppError("Flash sale not found", 404);
  }
  sendResponse(res, {
    statusCode: 200,
    message: "Flash sale deleted successfully",
    data: result,
  });
});

export const FlashSaleController = {
  getAllFlashSales,
  getActiveFlashSales,
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
};
