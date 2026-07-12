import mongoose, { Schema, Model } from "mongoose";
import { IOrder } from "../../interfaces/index.d";

const CustomerDetailSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    companyName: { type: String },
    address: { type: String, required: true },
    apartMentFloor: { type: String },
    PhoneNumber: { type: String, required: true },
  },
  { _id: false }
);

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    title: { type: String },
    price: { type: Number },
    imageUrl: [{ type: String }],
    discountedPrice: { type: Number },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customerDetail: { type: CustomerDetailSchema, required: true },
    cartData: { type: [OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ["COD", "Stripe"], required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

OrderSchema.index({ "customerDetail.email": 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });

const Order: Model<IOrder> = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
