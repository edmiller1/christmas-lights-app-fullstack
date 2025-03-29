import { db } from "../db";
import { Subscription, User } from "../db/schema";
import { and, eq, lt } from "drizzle-orm";
import { updateUserLimits } from "../lib/helpers";

export const checkExpiredSubscriptions = async () => {
  try {
    console.log("Checking for expired subscriptions...");

    const now = new Date();

    const expiredSubscriptions = await db.query.Subscription.findMany({
      where: and(
        eq(Subscription.status, "cancelled"),
        lt(Subscription.endsAt, now)
      ),
      with: {
        user: true,
      },
    });

    console.log(`Found ${expiredSubscriptions.length} expired subscriptions`);

    for (const subscription of expiredSubscriptions) {
      if (subscription.user.plan === "PRO") {
        console.log(
          `Downgrading user ${subscription.userId} from PRO plan to FREE plan`
        );

        await db
          .update(User)
          .set({ plan: "FREE", updatedAt: new Date() })
          .where(eq(User.id, subscription.userId));

        await updateUserLimits(subscription.userId, "FREE");

        await db
          .update(Subscription)
          .set({
            status: "expired",
            updatedAt: new Date(),
          })
          .where(eq(Subscription.id, subscription.id));

        console.log(`User ${subscription.userId} downgraded successfully`);
      }
    }

    return {
      processed: expiredSubscriptions.length,
    };
  } catch (error) {
    console.error("Error checking expired subscriptions:", error);
    throw error;
  }
};
