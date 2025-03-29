import { createHmac, timingSafeEqual, webcrypto } from "crypto";
import { db } from "../db";
import { Subscription, User } from "../db/schema";
import { eq } from "drizzle-orm";

export const getLocationData = async (addressId: string) => {
  try {
    console.log("Fetching location data for addressId:", addressId);

    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${addressId}?session_token=0f6c0283-69eb-41d1-88af-83b6da40a6a0&access_token=${process.env.MAPBOX_API_KEY}`
    );

    console.log("Mapbox API response status:", response.status);

    if (!response.ok) {
      throw new Error(
        `Mapbox API error: ${response.status} ${response.statusText}`
      );
    }

    const jsonData = await response.json();
    console.log("Mapbox API response data:", JSON.stringify(jsonData, null, 2));

    if (!jsonData || !jsonData.features || !jsonData.features[0]) {
      throw new Error("No valid location data in response");
    }

    const data = jsonData.features[0];

    // Add null checks for each property access
    if (
      !data.properties?.coordinates?.latitude ||
      !data.properties?.coordinates?.longitude ||
      !data.properties?.context?.country?.name ||
      !data.properties?.context?.region?.name ||
      !data.properties?.context?.place?.name
    ) {
      throw new Error("Missing required location properties in response");
    }

    const locationData = {
      latitude: data.properties.coordinates.latitude,
      longitude: data.properties.coordinates.longitude,
      country: data.properties.context.country.name,
      region: data.properties.context.region.name,
      city: data.properties.context.place.name,
    };

    console.log("Processed location data:", locationData);
    return locationData;
  } catch (error) {
    console.error("Error in getLocationData:", error);
    console.error("Full error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

export const getOptimizedImageUrls = (publicId: string) => {
  const baseUrl = "https://res.cloudinary.com/drlwnmkq9/image/upload";

  return {
    url: `${baseUrl}/q_auto,f_auto/${publicId}`,

    responsive: {
      sm: `${baseUrl}/c_fill,w_640,q_auto,f_auto/${publicId}`,
      md: `${baseUrl}/c_fill,w_1024,q_auto,f_auto/${publicId}`,
      lg: `${baseUrl}/c_fill,w_1920,q_auto,f_auto/${publicId}`,
    },
  };
};

export const sendVerificationDiscordNotification = async (payload: any) => {
  const webhookUrl = process.env.DISCORD_VERIFICATION_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("DISCORD_VERIFICATION_WEBHOOK_URL is not set");
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Discord API responded with status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Error sending verification discord notification:", error);
    throw error;
  }
};

export const sendReportDiscordNotification = async (payload: any) => {
  const webhookUrl = process.env.DISCORD_REPORT_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("DISCORD_REPORT_WEBHOOK_URL is not set");
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Discord API responded with status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Error sending verification discord notification:", error);
    throw error;
  }
};

function hexToUint8Array(hex: string): Uint8Array {
  if (!hex) {
    throw new Error("Hex string is required");
  }

  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return arr;
}

export const verifyDiscord = async (
  body: string,
  signature: string,
  timestamp: string,
  publicKey: string
) => {
  try {
    const encoder = new TextEncoder();
    const message = encoder.encode(timestamp + body);

    //Convert hex strings to Uint8Arrays
    const signatureBytes = hexToUint8Array(signature);
    const publicKeyBytes = hexToUint8Array(publicKey);

    // Import the public key
    const key = await webcrypto.subtle.importKey(
      "raw",
      publicKeyBytes,
      { name: "Ed25519", namedCurve: "Ed25519" },
      false,
      ["verify"]
    );

    // Verify the signature
    return await webcrypto.subtle.verify(
      { name: "Ed25519" },
      key,
      signatureBytes,
      message
    );
  } catch (error) {
    console.error("Error verifying Discord signature:", error);
    return false;
  }
};

export const verifyWebhookSignature = (
  payload: string,
  signature?: string
): boolean => {
  if (!signature || !process.env.LEMON_SQUEEZY_WEBHOOK_SECRET) {
    return false;
  }

  const hmac = createHmac("sha256", process.env.LEMON_SQUUEZY_WEBHOOK_SECRET!);
  const digest = hmac.update(payload).digest("hex");

  const digestBytes = Buffer.from(digest, "hex");
  const signatureBytes = Buffer.from(signature, "hex");

  if (digestBytes.length !== signatureBytes.length) {
    return false;
  }

  try {
    return timingSafeEqual(
      digestBytes as unknown as Uint8Array,
      signatureBytes as unknown as Uint8Array
    );
  } catch (error) {
    console.error("Error comparing signatures:", error);
    return false;
  }
};

export const handleSubscriptionCreated = async (payload: any) => {
  try {
    const { data } = payload;
    const subscriptionData = data.attributes;
    const customData = subscriptionData.custom_data;
    const userId = customData?.user_id;

    if (!userId) {
      console.error("No user ID found in subscription data");
      return;
    }

    // Update user plan to PRO
    await db
      .update(User)
      .set({
        plan: "PRO",
        updatedAt: new Date(),
      })
      .where(eq(User.id, userId));

    await updateUserLimits(userId, "PRO");

    // Create subscription record in your database
    await db.insert(Subscription).values({
      userId,
      lemonSqueezyId: data.id,
      orderId: subscriptionData.order_id,
      status: subscriptionData.status,
      variantId: subscriptionData.variant_id,
      renewsAt: subscriptionData.renews_at
        ? new Date(subscriptionData.renews_at)
        : null,
      endsAt: null,
    });

    console.log(`Upgraded user ${userId} to PRO plan`);
  } catch (error) {
    console.error("Error handling subscription created:", error);
    throw error;
  }
};

export const handleSubscriptionUpdated = async (payload: any) => {
  try {
    const { data } = payload;
    const subscriptionData = data.attributes;

    // Find subscription in your database
    const subscription = await db.query.Subscription.findFirst({
      where: eq(Subscription.lemonSqueezyId, data.id),
    });

    if (!subscription) {
      console.error(`Subscription ${data.id} not found in database`);
      return;
    }

    // Update subscription record
    await db
      .update(Subscription)
      .set({
        status: subscriptionData.status,
        renewsAt: subscriptionData.renews_at
          ? new Date(subscriptionData.renews_at)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(Subscription.lemonSqueezyId, data.id));

    console.log(
      `Updated subscription ${data.id} status to ${subscriptionData.status}`
    );
  } catch (error) {
    console.error("Error handling subscription updated:", error);
    throw error;
  }
};

export const handleSubscriptionCancelled = async (payload: any) => {
  try {
    const { data } = payload;
    const subscriptionData = data.attributes;

    // Find subscription in your database
    const subscription = await db.query.Subscription.findFirst({
      where: eq(Subscription.lemonSqueezyId, data.id),
      with: {
        user: true,
      },
    });

    if (!subscription) {
      console.error(`Subscription ${data.id} not found in database`);
      return;
    }

    // await updateUserLimits(subscription.user.id, "FREE");

    // Update subscription record
    await db
      .update(Subscription)
      .set({
        status: "cancelled",
        endsAt: subscriptionData.ends_at
          ? new Date(subscriptionData.ends_at)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(Subscription.lemonSqueezyId, data.id));

    // Keep the user on PRO plan until the subscription ends
    console.log(
      `Cancelled subscription ${data.id}, will end on ${subscriptionData.ends_at}`
    );
  } catch (error) {
    console.error("Error handling subscription cancelled:", error);
    throw error;
  }
};

export const handleSubscriptionResumed = async (payload: any) => {
  try {
    const { data } = payload;
    const subscriptionData = data.attributes;

    // Find subscription in your database
    const subscription = await db.query.Subscription.findFirst({
      where: eq(Subscription.lemonSqueezyId, data.id),
    });

    if (!subscription) {
      console.error(`Subscription ${data.id} not found in database`);
      return;
    }

    // Update subscription record
    await db
      .update(Subscription)
      .set({
        status: "active",
        endsAt: null,
        renewsAt: subscriptionData.renews_at
          ? new Date(subscriptionData.renews_at)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(Subscription.lemonSqueezyId, data.id));

    console.log(`Resumed subscription ${data.id}`);
  } catch (error) {
    console.error("Error handling subscription resumed:", error);
    throw error;
  }
};

export const handleSubscriptionExpired = async (payload: any) => {
  try {
    const { data } = payload;

    // Find subscription in your database
    const subscription = await db.query.Subscription.findFirst({
      where: eq(Subscription.lemonSqueezyId, data.id),
      with: {
        user: true,
      },
    });

    if (!subscription) {
      console.error(`Subscription ${data.id} not found in database`);
      return;
    }

    // Update subscription record
    await db
      .update(Subscription)
      .set({
        status: "expired",
        endsAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(Subscription.lemonSqueezyId, data.id));

    // Downgrade user back to FREE plan
    await db
      .update(User)
      .set({
        plan: "FREE",
        updatedAt: new Date(),
      })
      .where(eq(User.id, subscription.userId));

    console.log(
      `Expired subscription ${data.id} and downgraded user ${subscription.userId} to FREE plan`
    );
  } catch (error) {
    console.error("Error handling subscription expired:", error);
    throw error;
  }
};

export const updateUserLimits = async (
  userId: string,
  plan: "FREE" | "PRO"
) => {
  try {
    const limits =
      plan === "PRO"
        ? {
            maxDecorations: 3,
            maxImagesPerDecoration: 16,
            maxFavourites: null,
            maxHistory: null,
          }
        : {
            maxDecorations: 1,
            maxImagesPerDecoration: 8,
            maxFavourites: 10,
            maxHistory: 20,
          };

    await db.update(User).set(limits).where(eq(User.id, userId));

    console.log(`Updated limits for user ${userId} to ${plan} plan`);
  } catch (error) {
    console.error("Error updating user limits:", error);
    throw error;
  }
};
