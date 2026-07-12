import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CouponService } from "./coupon.service";
import AppError from "../../errorHelpers/AppError";

const getAllCoupons = catchAsync(async (_req: Request, res: Response) => {
  const result = await CouponService.getAllCoupons();
  res.json(result);
});

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponService.createCoupon(req.body);
  sendResponse(res, {
    statusCode: 201,
    message: "Coupon created successfully",
    data: result,
  });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CouponService.updateCoupon(id, req.body);
  if (!result) {
    throw new AppError("Coupon not found", 404);
  }
  sendResponse(res, {
    statusCode: 200,
    message: "Coupon updated successfully",
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await CouponService.deleteCoupon(id);
  if (!result) {
    throw new AppError("Coupon not found", 404);
  }
  sendResponse(res, {
    statusCode: 200,
    message: "Coupon deleted successfully",
    data: result,
  });
});

const validateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code, orderTotal } = req.body;
  if (!code) {
    throw new AppError("Coupon code is required", 400);
  }
  const coupon = await CouponService.validateCoupon(code, orderTotal || 0);
  sendResponse(res, {
    statusCode: 200,
    message: "Coupon is valid",
    data: {
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      minOrder: coupon.minOrder,
    },
  });
});

export const CouponController = {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
