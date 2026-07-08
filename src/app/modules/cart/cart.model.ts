import mongoose, { Schema, Model, Types } from "mongoose";
import { ICart } from "../../interfaces/index.d";

const CartSchema = new Schema<ICart>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true } as any,
    email: { type: String, required: true, lowercase: true, trim: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
  },
  { timestamps: true }
);

CartSchema.index({ productId: 1, email: 1 }, { unique: true });

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
