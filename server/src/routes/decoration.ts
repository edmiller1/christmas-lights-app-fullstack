import { Hono } from "hono";
import { db } from "../db";
import { authMiddleware } from "../lib/middleware";
import { zValidator } from "@hono/zod-validator";
import { createDecorationSchema } from "../lib/schemas";
import {
  Decoration,
  DecorationImage,
  Favourite,
  Rating,
  User,
  View,
} from "../db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { Cloudinary } from "../lib/cloudinary";
import { getLocationData, getOptimizedImageUrls } from "../lib/helpers";
import { UpdateDecorationArgs } from "./types";

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
        index: number;
      }[] = [];

      try {
        // Upload images first
        for (const image of images) {
          const uploadResponse = await Cloudinary.upload(image.base64Value);
          uploadedImages.push({
            publicId: uploadResponse.id,
            url: uploadResponse.url,
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

decorationRouter.get("getDecoration", async (c) => {
  try {
    const decorationId = c.req.query("decorationId");

    if (!decorationId) {
      return c.json({ error: "Decoration ID is required" }, 400);
    }

    const decoration = await db
      .select({
        id: Decoration.id,
        name: Decoration.name,
        address: Decoration.address,
        verified: Decoration.verified,
        latitude: Decoration.latitude,
        longitude: Decoration.longitude,
        country: Decoration.country,
        region: Decoration.region,
        city: Decoration.city,
        year: Decoration.year,
        createdAt: Decoration.createdAt,
        userId: Decoration.userId,
        viewCount: db.$count(View, eq(View.decorationId, decorationId)),
        ratingCount: db.$count(Rating, eq(Rating.decorationId, decorationId)),
        averageRating: sql<number>`
        COALESCE(
          (SELECT AVG(${Rating.rating}::numeric)::numeric(10,2)
          FROM ${Rating}
          WHERE ${Rating.decorationId} = ${decorationId}),
          0
        )
      `,
      })
      .from(Decoration)
      .where(eq(Decoration.id, decorationId))
      .execute()
      .then(async ([dec]) => {
        if (!dec) return null;

        const images = await db
          .select()
          .from(DecorationImage)
          .where(eq(DecorationImage.decorationId, decorationId))
          .orderBy(DecorationImage.index)
          .execute();

        const optimizedImages = images.map((image) => ({
          ...image,
          ...getOptimizedImageUrls(image.publicId),
        }));

        const ratings = await db
          .select()
          .from(Rating)
          .where(eq(Rating.decorationId, decorationId))
          .execute();

        return {
          ...dec,
          images: optimizedImages,
          ratings,
        };
      });

    if (!decoration) {
      return c.json({ error: "Decoration not found" }, 404);
    }

    return c.json(decoration);
  } catch (error: any) {
    console.error("Error getting decoration:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return c.json(
      {
        error: "Database error",
        details: error.message,
      },
      500
    );
  }
});

decorationRouter.post("saveDecoration", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");
    const decorationId = c.req.query("decorationId");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    if (!decorationId) {
      return c.json({ error: "Decoration ID is required" }, 400);
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    await db.insert(Favourite).values({
      decorationId,
      userId: user.id,
    });

    return c.json({ message: "Decoration saved" }, 200);
  } catch (error) {
    console.error("Error saving decoration:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

decorationRouter.post("removeDecoration", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");
    const decorationId = c.req.query("decorationId");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    if (!decorationId) {
      return c.json({ error: "Decoration ID is required" }, 400);
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    await db
      .delete(Favourite)
      .where(
        and(
          eq(Favourite.decorationId, decorationId),
          eq(Favourite.userId, user.id)
        )
      );

    return c.json({ message: "Decoration removed" }, 200);
  } catch (error) {
    console.error("Error removing decoration:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

decorationRouter.put("updateDecoration", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");
    if (!auth) return c.json({ error: "Not authenticated" }, 401);

    const {
      decorationId,
      name,
      address,
      images,
      deletedImageIds,
      addressId,
    }: UpdateDecorationArgs = await c.req.json();

    // Validation
    if (!decorationId || !name || !address || !images) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });
    if (!user) return c.json({ error: "User not found" }, 404);

    try {
      await db.transaction(async (tx) => {
        // 1. Basic decoration update
        const decorationUpdate = {
          name,
          address,
          updatedAt: new Date(),
        } as const;

        await tx
          .update(Decoration)
          .set(decorationUpdate)
          .where(eq(Decoration.id, decorationId));

        // 2. Update location if address changed
        if (addressId) {
          const locationData = await getLocationData(addressId);
          await tx
            .update(Decoration)
            .set({
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              country: locationData.country,
              region: locationData.region,
              city: locationData.city,
              updatedAt: new Date(),
            })
            .where(eq(Decoration.id, decorationId));
        }

        // 3. Handle image deletions
        if (deletedImageIds?.length > 0) {
          const imagesToDelete = await tx.query.DecorationImage.findMany({
            where: inArray(DecorationImage.id, deletedImageIds),
          });

          await tx
            .delete(DecorationImage)
            .where(inArray(DecorationImage.id, deletedImageIds));

          for (const image of imagesToDelete) {
            await Cloudinary.destroy(image.publicId);
          }
        }

        // 4. Handle new images
        const newImages = images.filter((img) => img.base64Value);

        if (newImages.length > 0) {
          const uploadedImages = await Promise.all(
            newImages.map(async (image) => {
              const uploadResponse = await Cloudinary.upload(
                image.base64Value!
              );
              return {
                publicId: uploadResponse.id,
                url: uploadResponse.url,
                index: image.index,
                decorationId,
              };
            })
          );

          await tx.insert(DecorationImage).values(uploadedImages);
        }

        // 5. Update existing image indices
        const existingImages = images.filter((img) => img.publicId);

        for (const image of existingImages) {
          await tx
            .update(DecorationImage)
            .set({ index: image.index })
            .where(
              and(
                eq(DecorationImage.publicId, String(image.publicId)),
                eq(DecorationImage.decorationId, decorationId)
              )
            );
        }
      });

      return c.json({ message: "Decoration updated successfully" }, 200);
    } catch (txError) {
      console.error("Transaction error:", txError);
      throw txError;
    }
  } catch (error) {
    console.error("Error updating decoration:", error);
    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});
