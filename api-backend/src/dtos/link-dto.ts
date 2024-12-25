import { z } from "zod";

export const linkData = z.object({
  url: z.string().url(),
  description: z.string().optional(),
});
