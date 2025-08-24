import "hono";
import type { User } from "@/generated/prisma";

declare module "hono" {
  interface ContextVariableMap {
    body: unknown; // you can also type this more strictly
    user: unknown;
  }
}
