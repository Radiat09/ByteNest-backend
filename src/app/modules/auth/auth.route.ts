import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.loginWithPassword);
router.post("/jwt", AuthController.setJwtToken);
router.post("/clear", AuthController.clearToken);

export default router;
