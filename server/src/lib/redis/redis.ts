import Redis from "ioredis";

export const redisClient = new Redis(
  `rediss://${process.env.UPSTASH_REDIS_USERNAME}:${process.env.UPSTASH_REDIS_PASSWORD}@${process.env.UPSTASH_REDIS_ENDPOINT}:${process.env.UPSTASH_REDIS_PORT}`
);
