import { initTRPC } from "@trpc/server";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { db } from "./db";

export const createContext = async ({
  req,
  res,
}: CreateFastifyContextOptions) => {
  return {
    db,
    req,
    res,
  };
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
