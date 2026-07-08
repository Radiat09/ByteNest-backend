import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import userRoutes from "../modules/user/user.route";
import productRoutes from "../modules/product/product.route";
import categoryRoutes from "../modules/category/category.route";
import cartRoutes from "../modules/cart/cart.route";
import wishlistRoutes from "../modules/wishlist/wishlist.route";
import orderRoutes from "../modules/order/order.route";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/users", route: userRoutes },
  { path: "/products", route: productRoutes },
  { path: "/categories", route: categoryRoutes },
  { path: "/cart", route: cartRoutes },
  { path: "/wishlist", route: wishlistRoutes },
  { path: "/orders", route: orderRoutes },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
