import mongoose from "mongoose";
import Order from "./order.model";
import { IOrder } from "../../interfaces/index.d";
import createStripeSession from "./order.stripe";
import AppError from "../../errorHelpers/AppError";

const createOrder = async (ordersData: Partial<IOrder>): Promise<any> => {
  const { paymentMethod, customerDetail, cartData } = ordersData;

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    if (paymentMethod === "COD") {
      const newOrder = new Order(ordersData);
      const orderResult = await newOrder.save({ session: mongoSession });
      await mongoSession.commitTransaction();
      mongoSession.endSession();
      return { orderId: orderResult._id, message: "Order placed successfully" };
    }

    if (paymentMethod === "Stripe") {
      const tempOrder = new Order(ordersData);
      const tempResult = await tempOrder.save({ session: mongoSession });
      const orderId = tempResult._id.toString();

      const stripeResult = await createStripeSession(orderId, cartData as any[], customerDetail);

      const statusMap: Record<string, string> = {
        paid: "completed",
        unpaid: "pending",
        no_payment_required: "completed",
      };
      const paymentStatus = (statusMap[stripeResult.payment_status] as IOrder["paymentStatus"]) || "pending";

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { paymentStatus } },
        { session: mongoSession }
      );

      await mongoSession.commitTransaction();
      mongoSession.endSession();
      return { url: stripeResult.url };
    }

    throw new AppError("Invalid payment method", 400);
  } catch (error) {
    await mongoSession.abortTransaction();
    mongoSession.endSession();
    throw error;
  }
};

const handleStripeWebhook = async (event: any): Promise<void> => {
  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const sessionData = event.data.object;
      const { orderID } = sessionData.metadata;

      await Order.findByIdAndUpdate(orderID, { $set: { paymentStatus: "completed" } }, { session: mongoSession });
    }

    if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
      const sessionData = event.data.object;
      const { orderID } = sessionData.metadata;
      await Order.findByIdAndUpdate(orderID, { $set: { paymentStatus: "cancelled" } }, { session: mongoSession });
    }

    await mongoSession.commitTransaction();
  } catch (error) {
    await mongoSession.abortTransaction();
    throw error;
  } finally {
    mongoSession.endSession();
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

const VALID_ORDER_STATUSES = ["pending", "completed", "cancelled"];

const updateOrderStatus = async (id: string, status: string): Promise<any> => {
  if (!VALID_ORDER_STATUSES.includes(status)) {
    throw new AppError(`Invalid status. Allowed: ${VALID_ORDER_STATUSES.join(", ")}`, 400);
  }
  return Order.findByIdAndUpdate(id, { $set: { orderStatus: status } }, { new: true, runValidators: true });
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
