import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";

export const authRouter = router({
  getUsers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(User);
  }),

  createUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newUser = await ctx.db.insert(User).values(input).returning();
      return newUser[0];
    }),
});
