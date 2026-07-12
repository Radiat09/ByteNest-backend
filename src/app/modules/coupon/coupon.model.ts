import mongoose, { Schema, Model } from "mongoose";

export interface ICoupon {
  _id?: string;
  code: string;
  discountPercent: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  expiryDate: Date;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    minOrder: { type: Number, required: true, default: 0 },
    maxUses: { type: Number, required: true, default: 0 },
    usedCount: { type: Number, required: true, default: 0 },
    expiryDate: { type: Date, required: true },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const Coupon: Model<ICoupon> = mongoose.model<ICoupon>("Coupon", CouponSchema);
export default Coupon;
