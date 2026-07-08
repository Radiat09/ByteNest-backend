import { Router } from "express";
import { ProductController } from "./product.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/count", ProductController.getProductCount);
router.get("/:id", ProductController.getProductById);
router.post("/", checkAuth("admin"), ProductController.createProduct);
router.put("/update/:id", checkAuth("admin"), ProductController.updateProduct);
router.delete("/delete/:id", checkAuth("admin"), ProductController.deleteProduct);

export default router;
