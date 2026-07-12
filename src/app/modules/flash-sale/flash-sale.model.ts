import mongoose, { Schema, Model } from "mongoose";

export interface IFlashSale {
  _id?: string;
  title: string;
  discountPercent: number;
  products: mongoose.Types.ObjectId[];
  startTime: Date;
  endTime: Date;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const FlashSaleSchema = new Schema<IFlashSale>(
  {
    title: { type: String, required: true, trim: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    products: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const FlashSale: Model<IFlashSale> = mongoose.model<IFlashSale>("FlashSale", FlashSaleSchema);
export default FlashSale;
