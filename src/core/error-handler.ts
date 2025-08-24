import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError, flattenError, treeifyError } from "zod";
import { Response } from "@/core/response";

export const errorHandler = async (err: unknown, c: Context) => {
  if (err instanceof HTTPException) {
    const res = Response.fail({
      message: err.message,
      errors: err.res,
    });
    return c.json(res, err.status);
  }

  if (err instanceof ZodError) {
    const res = Response.fail({
      message: "Validation failed",
      errors: flattenError(err),
    });
    return c.json(res, 400);
  }

  const res = Response.fail({ message: "Internal server error" });
  return c.json(res, 500);
};
