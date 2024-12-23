import z from "zod";

export const signUpData = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
});

export const signInData = z.object({
  email: z.string().email(),
  password: z.string(),
});
