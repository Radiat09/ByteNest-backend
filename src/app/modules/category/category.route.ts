import { Router } from "express";
import { CategoryController } from "./category.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.get("/", CategoryController.getAllCategories);
router.post("/", checkAuth("admin"), CategoryController.createCategory);
router.delete("/:id", checkAuth("admin"), CategoryController.deleteCategory);

export default router;
