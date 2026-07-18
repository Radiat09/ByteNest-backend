import { Router } from "express";
import { OrderController } from "./order.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post("/webhooks", OrderController.stripeWebhookHandler);

router.post("/", OrderController.createOrder);
router.get("/", checkAuth(), OrderController.getUserOrders);
router.get("/cancelled", checkAuth(), OrderController.getCancelledOrders);
router.put("/update/:id", checkAuth("admin"), OrderController.updateOrderStatus);
router.get("/all", checkAuth("admin"), OrderController.getAllOrders);
router.get("/:id", checkAuth("admin"), OrderController.getSingleOrder);

export default router;
