import { z } from "@/core/zod";

export class AuthValidation {
  static readonly REGISTER: z.ZodType = z.object({
    username: z.string().min(1).max(32),
    password: z.string().min(8).max(128),
    name: z.string().min(1).max(128),
  });

  static readonly LOGIN: z.ZodType = z.object({
    username: z.string().min(1).max(32),
    password: z.string().min(8).max(128),
  });
}
