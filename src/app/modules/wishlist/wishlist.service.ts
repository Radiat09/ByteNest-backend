import Wishlist from "./wishlist.model";
import Product from "../product/product.model";
import AppError from "../../errorHelpers/AppError";

const addToWishlist = async (email: string, productId: string): Promise<any> => {
  const normalizedEmail = email.toLowerCase();
  let wishlist = await Wishlist.findOne({ email: normalizedEmail });

  if (!wishlist) {
    wishlist = new Wishlist({
      email: normalizedEmail,
      productIds: [productId],
    });
    return wishlist.save();
  }

  if (wishlist.productIds.includes(productId as any)) {
    throw new AppError("Product already exists in the wishlist", 409);
  }

  wishlist.productIds.push(productId as any);
  return wishlist.save();
};

const getWishlistByEmail = async (email: string): Promise<any[]> => {
  const normalizedEmail = email.toLowerCase();
  const wishlist = await Wishlist.findOne({ email: normalizedEmail });

  if (!wishlist || !wishlist.productIds || wishlist.productIds.length === 0) {
    return [];
  }

  return Product.find({ _id: { $in: wishlist.productIds } });
};

const checkWishlistStatus = async (email: string, productId: string): Promise<boolean> => {
  const normalizedEmail = email.toLowerCase();
  const wishlist = await Wishlist.findOne({ email: normalizedEmail });

  if (wishlist && wishlist.productIds.includes(productId as any)) {
    return true;
  }
  return false;
};

const deleteFromWishlist = async (email: string, productId: string): Promise<any> => {
  const normalizedEmail = email.toLowerCase();
  return Wishlist.findOneAndUpdate(
    { email: normalizedEmail },
    { $pull: { productIds: productId } },
    { new: true }
  );
};

export const WishlistService = {
  addToWishlist,
  getWishlistByEmail,
  checkWishlistStatus,
  deleteFromWishlist,
};
