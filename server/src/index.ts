import fastify from "fastify";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { createContext } from "./trpc";
import { appRouter } from "./router";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const server = fastify({
  logger: true,
});

// Register tRPC
server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

const port = parseInt(process.env.PORT || "3000", 10);

// Start server
const start = async () => {
  try {
    await server.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Server running at http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
