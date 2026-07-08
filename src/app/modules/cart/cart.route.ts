import { Router } from "express";
import { CartController } from "./cart.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.use(checkAuth());

router.post("/", CartController.addToCart);
router.get("/", CartController.getCartByEmail);
router.put("/:id", CartController.updateCartQuantity);
router.delete("/:id", CartController.deleteCartItem);
router.delete("/clear/all", CartController.clearAllCartItems);
router.post("/moveToCart", CartController.moveToCart);

export default router;
