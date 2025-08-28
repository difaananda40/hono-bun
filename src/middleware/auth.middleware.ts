import { getCookie, deleteCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify, jwt } from "hono/jwt";

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

  try {
    const decoded = await verify(token, process.env.SECRET_KEY!);

    c.set("user", {
      id: decoded.sub,
      username: decoded.username,
      name: decoded.name,
    });
  } catch {
    deleteCookie(c, "auth_token");
    throw new HTTPException(401, {
      message: "Unauthorized",
    });
  }

  await next();
});
