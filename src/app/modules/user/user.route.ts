import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.get("/:email", UserController.getUserByEmail);
router.post("/", UserController.createUser);
router.put("/update", checkAuth(), UserController.updateUser);
router.get("/", checkAuth("admin"), UserController.getAllUsers);
router.put("/role", checkAuth("admin"), UserController.makeAdmin);

export default router;
