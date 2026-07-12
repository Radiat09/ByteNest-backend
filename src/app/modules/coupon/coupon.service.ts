import Coupon, { ICoupon } from "./coupon.model";
import AppError from "../../errorHelpers/AppError";

const getAllCoupons = async (): Promise<ICoupon[]> => {
  return Coupon.find().sort({ createdAt: -1 });
};

const getCouponByCode = async (code: string): Promise<ICoupon | null> => {
  return Coupon.findOne({ code: code.toUpperCase(), active: true });
};

const createCoupon = async (payload: Partial<ICoupon>): Promise<ICoupon> => {
  const newCoupon = new Coupon(payload);
  return newCoupon.save();
};

const updateCoupon = async (id: string, payload: Partial<ICoupon>): Promise<ICoupon | null> => {
  return Coupon.findByIdAndUpdate(id, { $set: payload }, { new: true });
};

const deleteCoupon = async (id: string): Promise<ICoupon | null> => {
  return Coupon.findByIdAndDelete(id);
};

const validateCoupon = async (code: string, orderTotal: number): Promise<ICoupon> => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
  if (!coupon) {
    throw new AppError("Invalid coupon code", 400);
  }
  if (new Date() > coupon.expiryDate) {
    throw new AppError("Coupon has expired", 400);
  }
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    throw new AppError("Coupon usage limit reached", 400);
  }
  if (orderTotal < coupon.minOrder) {
    throw new AppError(`Minimum order amount is ৳${coupon.minOrder}`, 400);
  }
  return coupon;
};

const applyCoupon = async (code: string): Promise<void> => {
  await Coupon.findOneAndUpdate({ code: code.toUpperCase() }, { $inc: { usedCount: 1 } });
};

export const CouponService = {
  getAllCoupons,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
};
