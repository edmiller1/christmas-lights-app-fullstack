import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

export const Cloudinary = {
  upload: async (image: string) => {
    const res = await cloudinary.uploader.upload(image, {
      folder: "christmas-lights-app-assets",
      eager: [
        { width: 200, crop: "fill" }, // thumbnail
        { width: 600, crop: "fill" }, // medium
        { width: 1200, crop: "fill" }, // large
      ],
    });

    return {
      id: res.public_id,
      url: res.secure_url,
      thumbnailUrl: res.eager[0].secure_url as string,
      mediumUrl: res.eager[1].secure_url as string,
      largeUrl: res.eager[2].secure_url as string,
    };
  },
  destroy: async (id: string) => {
    await cloudinary.uploader.destroy(id, {
      invalidate: true,
      resource_type: "image",
    });
  },
};
