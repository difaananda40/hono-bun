import { createMiddleware } from "hono/factory";

export const parseBodyMiddleware = createMiddleware(async (c, next) => {
  const method = c.req.method.toUpperCase();
  // Only parse body for methods that typically have one
  if (method === "GET") {
    await next();
    return;
  }

  const contentType = c.req.header("content-type") || "";
  let parsed: unknown = null;

  try {
    if (contentType.includes("application/json")) {
      parsed = await c.req.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      parsed = await c.req.parseBody();
    }
  } catch {
    return c.json({ error: "Failed to parse body" }, 400);
  }

  c.set("body", parsed);
  await next();
});
