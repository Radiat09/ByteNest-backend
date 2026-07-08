import { Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WishlistService } from "./wishlist.service";
import { AuthRequest } from "../../interfaces/index.d";

const addToWishlist = catchAsync(async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;
  const email = req.user!.email;
  const result = await WishlistService.addToWishlist(email, productId);
  sendResponse(res, {
    statusCode: 201,
    message: "Product added to wishlist",
    data: result,
  });
});

const getWishlistByEmail = catchAsync(async (req: AuthRequest, res: Response) => {
  const email = req.user!.email;
  const result = await WishlistService.getWishlistByEmail(email);
  res.json(result);
});

const checkWishlistStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const email = req.user!.email;
  const wishListed = await WishlistService.checkWishlistStatus(email, id);
  res.json({ wishListed });
});

const deleteFromWishlist = catchAsync(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const email = req.user!.email;
  const result = await WishlistService.deleteFromWishlist(email, id);
  sendResponse(res, {
    statusCode: 200,
    message: "Product removed from wishlist",
    data: result,
  });
});

export const WishlistController = {
  addToWishlist,
  getWishlistByEmail,
  checkWishlistStatus,
  deleteFromWishlist,
};
