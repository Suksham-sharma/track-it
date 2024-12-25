import { z } from "zod";

export const linkData = z.object({
  url: z.string(),
  description: z.string().optional(),
});
