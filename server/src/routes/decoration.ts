import { Hono } from "hono";
import { db } from "../db";
import { authMiddleware } from "../lib/middleware";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { createDecorationSchema } from "../lib/schemas";
import { Decoration, DecorationImage, User } from "../db/schema";
import { eq } from "drizzle-orm";
import { Cloudinary } from "../lib/cloudinary";
import { getLocationData } from "../lib/helpers";

export const decorationRouter = new Hono();

decorationRouter.post(
  "/createDecoration",
  authMiddleware,
  zValidator("json", createDecorationSchema),
  async (c, next) => {
    try {
      const auth = c.get("user");
      const { name, address, images, addressId } = await c.req.json();

      if (!auth) {
        return c.json({ error: "Not authenticated" }, 401);
      }

      const user = await db.query.User.findFirst({
        where: eq(User.externalId, auth.id),
      });

      if (!user) {
        return c.json({ error: "User not found" }, 404);
      }

      const locationData = await getLocationData(addressId);
      let uploadedImages: {
        publicId: string;
        url: string;
        thumbnailUrl: string;
        mediumUrl: string;
        largeUrl: string;
        index: number;
      }[] = [];

      try {
        // Upload images first
        for (const image of images) {
          const uploadResponse = await Cloudinary.upload(image.base64Value);
          uploadedImages.push({
            publicId: uploadResponse.id,
            url: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl,
            mediumUrl: uploadResponse.mediumUrl,
            largeUrl: uploadResponse.largeUrl,
            index: image.index as number,
          });
        }

        if (uploadedImages.length === 0) {
          return c.json({ error: "No images provided" }, 400);
        }

        // Create decoration and associate images
        const decorationId = await db.transaction(async (tx) => {
          const result = await tx
            .insert(Decoration)
            .values({
              name,
              address,
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              country: locationData.country,
              region: locationData.region,
              city: locationData.city,
              year: new Date().getFullYear().toString(),
              verificationSubmitted: false,
              verified: false,
              userId: user.id,
            })
            .returning({ decorationId: Decoration.id });

          const imagesWithDecorationId = uploadedImages.map((image) => ({
            ...image,
            decorationId: result[0].decorationId,
          }));

          await tx.insert(DecorationImage).values(imagesWithDecorationId);

          return result[0].decorationId;
        });

        return c.json({ decorationId });
      } catch (error) {
        // Clean up uploaded images if anything fails
        for (const image of uploadedImages) {
          try {
            await Cloudinary.destroy(image.publicId);
          } catch (deleteError) {
            console.error(
              "Failed to delete image:",
              image.publicId,
              deleteError
            );
          }
        }
        throw error; // Re-throw to be caught by outer catch block
      }
    } catch (error) {
      console.error("Error creating decoration:", error);
      return c.json({ error: "Internal server error " + error }, 500);
    }
  }
);
