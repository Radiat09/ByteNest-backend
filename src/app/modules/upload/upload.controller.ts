import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CloudinaryService } from "./upload.service";
import AppError from "../../errorHelpers/AppError";

const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError("No image file provided", 400);
  }

  const folder = (req.query.folder as string) || "products";

  let result: { url: string; publicId: string };
  try {
    result = await CloudinaryService.uploadBuffer(req.file.buffer, folder);
  } catch (err: any) {
    throw new AppError(`Upload failed: ${err.message}`, 500);
  }

  sendResponse(res, {
    statusCode: 200,
    message: "Image uploaded successfully",
    data: { url: result.url, publicId: result.publicId },
  });
});

const uploadMultiple = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    throw new AppError("No image files provided", 400);
  }

  const folder = (req.query.folder as string) || "products";
  const uploaded: { url: string; publicId: string }[] = [];

  try {
    for (const file of files) {
      const result = await CloudinaryService.uploadBuffer(file.buffer, folder);
      uploaded.push(result);
    }
  } catch (err: any) {
    // Cleanup: delete all already-uploaded images on failure
    if (uploaded.length > 0) {
      await CloudinaryService.deleteMany(uploaded.map((u) => u.publicId));
    }
    throw new AppError(
      `Batch upload failed at file ${uploaded.length + 1}/${files.length}: ${err.message}. ${uploaded.length} uploaded files were cleaned up.`,
      500
    );
  }

  sendResponse(res, {
    statusCode: 200,
    message: `${uploaded.length} images uploaded successfully`,
    data: uploaded,
  });
});

const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.body;
  if (!publicId) {
    throw new AppError("publicId is required", 400);
  }

  await CloudinaryService.deleteImage(publicId);

  sendResponse(res, {
    statusCode: 200,
    message: "Image deleted successfully",
    data: null,
  });
});

const deleteMultiple = catchAsync(async (req: Request, res: Response) => {
  const { publicIds } = req.body;
  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    throw new AppError("publicIds array is required", 400);
  }

  const results = await CloudinaryService.deleteMany(publicIds);
  const deleted = results.filter((r) => r.status === "fulfilled").length;

  sendResponse(res, {
    statusCode: 200,
    message: `${deleted}/${publicIds.length} images deleted`,
    data: null,
  });
});

export const UploadController = {
  uploadImage,
  uploadMultiple,
  deleteImage,
  deleteMultiple,
};
