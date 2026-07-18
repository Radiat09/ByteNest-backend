import mongoose from "mongoose";
import Order from "./order.model";
import Cart from "../cart/cart.model";
import { IOrder } from "../../interfaces/index.d";
import createStripeSession from "./order.stripe";
import AppError from "../../errorHelpers/AppError";

const createOrder = async (ordersData: Partial<IOrder>): Promise<any> => {
  const { paymentMethod, customerDetail, cartData } = ordersData;

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    const newOrder = new Order(ordersData);
    const orderResult = await newOrder.save({ session: mongoSession });
    const orderId = orderResult._id.toString();

    if (paymentMethod === "COD") {
      await Cart.deleteMany({ email: customerDetail!.email.toLowerCase() }, { session: mongoSession });
      await mongoSession.commitTransaction();
      mongoSession.endSession();
      return { orderId: orderResult._id, message: "Order placed successfully" };
    }

    if (paymentMethod === "Stripe") {
      const url = await createStripeSession(orderId, cartData as any[], customerDetail);
      await mongoSession.commitTransaction();
      mongoSession.endSession();
      return { url };
    }

    throw new AppError("Invalid payment method", 400);
  } catch (error) {
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    throw error;
  }
};

const handleStripeWebhook = async (event: any): Promise<void> => {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { orderID, cartIDs } = session.metadata;

    await Order.findByIdAndUpdate(orderID, { $set: { paymentStatus: "completed" } });

    if (cartIDs) {
      const parsedCartIds = JSON.parse(cartIDs);
      await Cart.deleteMany({ _id: { $in: parsedCartIds } });
    }
  }

  if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object;
    const { orderID } = session.metadata;
    await Order.findByIdAndUpdate(orderID, { $set: { paymentStatus: "cancelled" } });
  }
};

const getUserOrders = async (email: string): Promise<any[]> => {
  return Order.find({ "customerDetail.email": email.toLowerCase() })
    .populate("cartData.productId")
    .sort({ createdAt: -1 });
};

const getCancelledOrders = async (email: string): Promise<any[]> => {
  return Order.find({
    "customerDetail.email": email.toLowerCase(),
    orderStatus: "cancelled",
  }).sort({ createdAt: -1 });
};

const updateOrderStatus = async (id: string, status: string): Promise<any> => {
  return Order.findByIdAndUpdate(id, { $set: { orderStatus: status } }, { new: true });
};

const getAllOrders = async (): Promise<any[]> => {
  return Order.find().sort({ createdAt: -1 });
};

const getSingleOrder = async (id: string): Promise<any> => {
  const order = await Order.findById(id).populate("cartData.productId").lean();
  if (!order) {
    throw new AppError("Order not found", 404);
  }

  const products = (order.cartData || [])
    .map((item: any) => {
      const product = item.productId;
      if (!product) return null;
      return {
        ...product,
        quantity: item.quantity,
      };
    })
    .filter(Boolean);

  return { ...order, products };
};

export const OrderService = {
  createOrder,
  handleStripeWebhook,
  getUserOrders,
  getCancelledOrders,
  updateOrderStatus,
  getAllOrders,
  getSingleOrder,
};
