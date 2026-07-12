import { Router } from "express";
import { CouponController } from "./coupon.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.get("/", CouponController.getAllCoupons);
router.post("/", checkAuth("admin"), CouponController.createCoupon);
router.put("/:id", checkAuth("admin"), CouponController.updateCoupon);
router.delete("/:id", checkAuth("admin"), CouponController.deleteCoupon);
router.post("/validate", CouponController.validateCoupon);

export default router;
