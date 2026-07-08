import { Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CartService } from "./cart.service";
import { AuthRequest } from "../../interfaces/index.d";

const addToCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;
  const email = req.user!.email;
  const result = await CartService.addToCart({ productId, email, quantity });
  sendResponse(res, {
    statusCode: 201,
    message: "Item added to cart",
    data: result,
  });
});

const getCartByEmail = catchAsync(async (req: AuthRequest, res: Response) => {
  const email = req.user!.email;
  const result = await CartService.getCartByEmail(email);
  res.json(result);
});

const updateCartQuantity = catchAsync(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { quantity } = req.body;
  const email = req.user!.email;
  const result = await CartService.updateCartQuantity(id, quantity, email);
  sendResponse(res, {
    statusCode: 200,
    message: "Cart updated successfully",
    data: result,
  });
});

const deleteCartItem = catchAsync(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const email = req.user!.email;
  const result = await CartService.deleteCartItem(id, email);
  sendResponse(res, {
    statusCode: 200,
    message: "Item removed from cart",
    data: result,
  });
});

const clearAllCartItems = catchAsync(async (req: AuthRequest, res: Response) => {
  const email = req.user!.email;
  const result = await CartService.clearAllCartItems(email);
  sendResponse(res, {
    statusCode: 200,
    message: "Cart cleared successfully",
    data: result,
  });
});

const moveToCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const email = req.user!.email;
  const result = await CartService.moveToCart(email);
  sendResponse(res, {
    statusCode: 200,
    message: "Items moved to cart successfully",
    data: result,
  });
});

export const CartController = {
  addToCart,
  getCartByEmail,
  updateCartQuantity,
  deleteCartItem,
  clearAllCartItems,
  moveToCart,
};
