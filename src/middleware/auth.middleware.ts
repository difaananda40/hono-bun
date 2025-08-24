import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify, jwt } from "hono/jwt";
import { env } from "hono/adapter";

export const authMiddleware = createMiddleware(async (c, next) => {
  let token: string | undefined;

  token = getCookie(c, "auth_token");

  if (!token) {
    const authHeader = c.req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  const { SECRET_KEY } = env<{ SECRET_KEY: string }>(c);
  const decoded = await verify(token, SECRET_KEY);

  if (!decoded) {
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  c.set("user", {
    id: decoded.sub,
    username: decoded.username,
    name: decoded.name,
  });

  await next();
});
