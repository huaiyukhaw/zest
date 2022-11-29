import cloudinary from "cloudinary";
import type { UploadApiResponse, DeleteApiResponse } from "cloudinary";
import { writeAsyncIterableToWritable } from "@remix-run/node";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadImage = async (
  data: AsyncIterable<Uint8Array>,
  folderName?: string
) => {
  const uploadPromise = new Promise<UploadApiResponse>(
    async (resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: folderName ?? "remix",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          if (result) {
            resolve(result);
          }
        }
      );
      await writeAsyncIterableToWritable(data, uploadStream);
    }
  );

  return uploadPromise;
};

export const deleteImage = async (imagePublicId: string) => {
  const uploadPromise = new Promise<DeleteApiResponse>(
    async (resolve, reject) => {
      cloudinary.v2.uploader.destroy(imagePublicId, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (result) {
          resolve(result);
        }
      });
    }
  );
  return uploadPromise;
};
