import { Router } from "express";
import { FlashSaleController } from "./flash-sale.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.get("/", FlashSaleController.getAllFlashSales);
router.get("/active", FlashSaleController.getActiveFlashSales);
router.post("/", checkAuth("admin"), FlashSaleController.createFlashSale);
router.put("/:id", checkAuth("admin"), FlashSaleController.updateFlashSale);
router.delete("/:id", checkAuth("admin"), FlashSaleController.deleteFlashSale);

export default router;
