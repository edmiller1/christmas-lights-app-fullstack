import { z } from "zod";

export const createDecorationSchema = z.object({
  name: z.string(),
  address: z.string(),
  images: z.array(z.object({ index: z.number(), base64Value: z.string() })),
  addressId: z.string(),
});
