import { Router } from "express";
import multer from "multer";
import { UploadController } from "./upload.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WebP, and GIF are allowed"));
    }
  },
});

const router = Router();

// Single image upload
router.post(
  "/",
  checkAuth("admin"),
  upload.single("image"),
  UploadController.uploadImage
);

// Multi image upload (max 10)
router.post(
  "/bulk",
  checkAuth("admin"),
  upload.array("images", 10),
  UploadController.uploadMultiple
);

// Delete single
router.delete("/", checkAuth("admin"), UploadController.deleteImage);

// Delete multiple
router.delete("/bulk", checkAuth("admin"), UploadController.deleteMultiple);

export default router;
