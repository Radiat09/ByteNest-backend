import { Request, Response } from "express";
import Stripe from "stripe";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";
import { AuthRequest } from "../../interfaces/index.d";
import config from "../../config/env";

const stripeInstance = new Stripe(config.stripeSecretKey);

const createOrder = catchAsync(async (req: AuthRequest, res: Response) => {
  const result = await OrderService.createOrder(req.body);
  if (result.url) {
    return res.status(201).json({ url: result.url });
  }
  sendResponse(res, {
    statusCode: 201,
    message: result.message || "Order placed successfully",
    data: { orderId: result.orderId },
  });
});

const stripeWebhookHandler = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig!,
      config.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error("Stripe Webhook Verification Failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  await OrderService.handleStripeWebhook(event);
  res.json({ received: true });
});

const getUserOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const email = req.user!.email;
  const result = await OrderService.getUserOrders(email);
  res.json(result);
});

const getCancelledOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const email = req.user!.email;
  const result = await OrderService.getCancelledOrders(email);
  res.json(result);
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  const result = await OrderService.updateOrderStatus(id, status);
  sendResponse(res, {
    statusCode: 200,
    message: "Order status updated",
    data: result,
  });
});

const getAllOrders = catchAsync(async (_req: Request, res: Response) => {
  const result = await OrderService.getAllOrders();
  sendResponse(res, {
    statusCode: 200,
    message: "Orders retrieved successfully",
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await OrderService.getSingleOrder(id);
  sendResponse(res, {
    statusCode: 200,
    message: "Order retrieved successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  stripeWebhookHandler,
  getUserOrders,
  getCancelledOrders,
  updateOrderStatus,
  getAllOrders,
  getSingleOrder,
};
