import { v2 as cloudinary } from "cloudinary";
import config from "../../config/env";

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

export const CloudinaryService = {
  async uploadBuffer(buffer: Buffer, folder: string = "products") {
    return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Upload failed"));
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      stream.end(buffer);
    });
  },

  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  },

  async deleteMany(publicIds: string[]): Promise<PromiseSettledResult<any>[]> {
    if (publicIds.length === 0) return [];
    return Promise.allSettled(
      publicIds.map((id) => cloudinary.uploader.destroy(id))
    );
  },
};
