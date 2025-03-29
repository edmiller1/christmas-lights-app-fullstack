import { Hono } from "hono";
import { db } from "../db";
import { authMiddleware } from "../lib/middleware";
import { zValidator } from "@hono/zod-validator";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  handleSubscriptionCancelled,
  handleSubscriptionCreated,
  handleSubscriptionExpired,
  handleSubscriptionResumed,
  handleSubscriptionUpdated,
  verifyWebhookSignature,
} from "../lib/helpers";
import { checkExpiredSubscriptions } from "../tasks/check-expired-subscription";

export const subscriptionRouter = new Hono();

const PLANS = {
  FREE: {
    maxImages: 8,
    maxFavorites: 10,
    maxHistory: 20,
  },
  PRO: {
    maxImages: 16,
    maxFavorites: null, // unlimited
    maxHistory: null, // unlimited
  },
};

subscriptionRouter.post("/create-checkout", authMiddleware, async (c) => {
  try {
    const auth = c.get("user");

    if (!auth) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const user = await db.query.User.findFirst({
      where: eq(User.externalId, auth.id),
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    if (user.plan === "PRO") {
      return c.json({ error: "Already subscribed to PRO" }, 400);
    }

    const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
    const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;
    const LEMON_SQUEEZY_PRODUCT_ID = process.env.LEMON_SQUEEZY_PRODUCT_ID;
    const LEMON_SQUEEZY_VARIANT_ID = process.env.LEMON_SQUEEZY_VARIANT_ID;

    const checkoutResponse = await fetch(
      "https://api.lemonsqueezy.com/v1/checkouts",
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${LEMON_SQUEEZY_API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              store_id: LEMON_SQUEEZY_STORE_ID,
              variant_id: LEMON_SQUEEZY_VARIANT_ID,
              product_id: LEMON_SQUEEZY_PRODUCT_ID,
              product_options: {
                name: "Christmas Lights App Pro",
                description:
                  "Unlock premium features for your Christmas Lights experience",
                redirect_url: `${process.env.FRONTEND_URL}/subscription/success`,
                receipt_thank_you_note:
                  "Thank you for upgrading to Christmas Lights App Pro!",
              },
              checkout_data: {
                email: user.email,
                name: user.name,
                custom: {
                  user_id: user.id,
                },
              },
              test_mode: process.env.NODE_ENV !== "production", // Enable test mode for non-production
            },
          },
        }),
      }
    );

    const checkoutData = await checkoutResponse.json();

    if (!checkoutResponse.ok) {
      console.error("LemonSqueezy checkout error:", checkoutData);
      return c.json({ error: "Failed to create checkout" }, 500);
    }

    return c.json({
      checkoutUrl: checkoutData.data.attributes.url,
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

subscriptionRouter.post("/webhook", async (c) => {
  try {
    const rawBody = await c.req.text();
    const signature = c.req.header("X-Signature");

    if (!verifyWebhookSignature(rawBody, signature)) {
      return c.json({ error: "Invalid signature" }, 401);
    }

    const payload = JSON.parse(rawBody);
    const event = payload.meta.event_name;

    console.log(`Received LemonSquuzy webhook event: ${event}`);

    switch (event) {
      case "subscription_created":
        await handleSubscriptionCreated(payload);
        break;

      case "subscription_updated":
        await handleSubscriptionUpdated(payload);
        break;

      case "subscription_cancelled":
        await handleSubscriptionCancelled(payload);
        break;

      case "subscription_resumed":
        await handleSubscriptionResumed(payload);
        break;

      case "subscription_expired":
        await handleSubscriptionExpired(payload);
        break;
    }

    return c.json({ message: "success" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
