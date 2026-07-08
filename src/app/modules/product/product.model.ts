import mongoose, { Schema, Model } from "mongoose";
import { IProduct } from "../../interfaces/index.d";

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, default: null },
    category: { type: String, required: true, trim: true },
    imageUrl: [{ type: String }],
    sellCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
