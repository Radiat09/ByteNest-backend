import Order from "./order.model";
import Cart from "../cart/cart.model";
import { IOrder } from "../../interfaces/index.d";
import createStripeSession from "./order.stripe";
import AppError from "../../errorHelpers/AppError";

const createOrder = async (ordersData: Partial<IOrder>): Promise<any> => {
  const { paymentMethod, customerDetail, cartData } = ordersData;

  const newOrder = new Order(ordersData);
  const orderResult = await newOrder.save();
  const orderId = orderResult._id.toString();

  if (paymentMethod === "COD") {
    await Cart.deleteMany({ email: customerDetail!.email.toLowerCase() });
    return { orderId: orderResult._id, message: "Order placed successfully" };
  }

  if (paymentMethod === "Stripe") {
    const url = await createStripeSession(orderId, cartData as any[], customerDetail);
    return { url };
  }

  throw new AppError("Invalid payment method", 400);
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
