import { Router } from "express";
import { WishlistController } from "./wishlist.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.use(checkAuth());

router.post("/", WishlistController.addToWishlist);
router.get("/", WishlistController.getWishlistByEmail);
router.get("/status/:id", WishlistController.checkWishlistStatus);
router.delete("/:id", WishlistController.deleteFromWishlist);

export default router;
