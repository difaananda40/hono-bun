import { z, ZodType } from "zod";

export class PostValidation {
  static readonly ID: ZodType = z.number().positive();

  static readonly MUTATION: ZodType = z.object({
    title: z.string().min(1).max(32),
    content: z.string().min(1).max(128),
  });
}
