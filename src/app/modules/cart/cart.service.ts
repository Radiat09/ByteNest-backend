import Cart from "./cart.model";
import Wishlist from "../wishlist/wishlist.model";
import AppError from "../../errorHelpers/AppError";
import { ICart } from "../../interfaces/index.d";

const addToCart = async (payload: { productId: string; email: string; quantity?: number }): Promise<ICart> => {
  const { productId, email, quantity } = payload;
  const normalizedEmail = email.toLowerCase();

  const existingItem = await Cart.findOne({ productId, email: normalizedEmail });
  if (existingItem) {
    throw new AppError("Product already exists in the cart", 409);
  }

  const newCartItem = new Cart({
    productId,
    email: normalizedEmail,
    quantity: quantity || 1,
  });
  return newCartItem.save();
};

const getCartByEmail = async (email: string): Promise<any[]> => {
  const normalizedEmail = email.toLowerCase();
  const cartItems = await Cart.find({ email: normalizedEmail }).populate("productId").lean();

  return cartItems.map((item: any) => {
    const product = item.productId;

    if (!product) {
      return {
        _id: item._id,
        productId: null,
        email: item.email,
        quantity: item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    }

    return {
      _id: item._id,
      productId: product._id.toString(),
      email: item.email,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      title: product.title,
      description: product.description,
      price: product.price,
      discountedPrice: product.discountedPrice,
      category: product.category,
      imageUrl: product.imageUrl,
      sellCount: product.sellCount,
    };
  });
};

const updateCartQuantity = async (id: string, quantity: number, userEmail: string): Promise<ICart | null> => {
  const cartItem = await Cart.findById(id);
  if (!cartItem) {
    throw new AppError("Cart item not found", 404);
  }
  if (cartItem.email !== userEmail) {
    throw new AppError("Access Denied: You can only modify your own cart", 403);
  }
  return Cart.findByIdAndUpdate(id, { $set: { quantity } }, { new: true });
};

const deleteCartItem = async (id: string, userEmail: string): Promise<ICart | null> => {
  const cartItem = await Cart.findById(id);
  if (!cartItem) {
    throw new AppError("Cart item not found", 404);
  }
  if (cartItem.email !== userEmail) {
    throw new AppError("Access Denied: You can only delete from your own cart", 403);
  }
  return Cart.findByIdAndDelete(id);
};

const clearAllCartItems = async (email: string): Promise<any> => {
  return Cart.deleteMany({ email: email.toLowerCase() });
};

const moveToCart = async (email: string): Promise<any[]> => {
  const normalizedEmail = email.toLowerCase();

  const wishlist = await Wishlist.findOne({ email: normalizedEmail });
  if (!wishlist || !wishlist.productIds || wishlist.productIds.length === 0) {
    throw new AppError("No products in your wishlist to move", 400);
  }

  const existingCartItems = await Cart.find({ email: normalizedEmail });
  const existingProductIds = existingCartItems.map((item) => item.productId.toString());

  const productsToInsert = wishlist.productIds
    .map((id) => id.toString())
    .filter((id) => !existingProductIds.includes(id));

  if (productsToInsert.length === 0) {
    wishlist.productIds = [];
    await wishlist.save();
    throw new AppError("All products are already in the cart", 400);
  }

  const cartPayloads = productsToInsert.map((productId) => ({
    productId,
    email: normalizedEmail,
    quantity: 1,
  }));

  const result = await Cart.insertMany(cartPayloads);

  wishlist.productIds = [];
  await wishlist.save();

  return result;
};

export const CartService = {
  addToCart,
  getCartByEmail,
  updateCartQuantity,
  deleteCartItem,
  clearAllCartItems,
  moveToCart,
};
