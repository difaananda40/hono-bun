import { Hono } from "hono";
import { RegisterUserRequest, LoginUserRequest } from "./auth.model";
import { AuthService } from "./auth.service";
import { Response } from "@/core/response";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { env } from "hono/adapter";
import { authMiddleware } from "@/middleware/auth.middleware";
import { sleep } from "bun";

export const authController = new Hono();

authController.post("/register", async (c) => {
  const request = (await c.get("body")) as RegisterUserRequest;

  const response = await AuthService.register(request);

  return c.json(
    Response.success({
      message: "User registered successfully",
      data: response,
    }),
  );
});

authController.post("/login", async (c) => {
  const request = (await c.get("body")) as LoginUserRequest;

  const response = await AuthService.login(request);

  const payload = {
    sub: response.id,
    username: response.username,
    name: response.name,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };

  const { SECRET_KEY } = env<{ SECRET_KEY: string }>(c);
  const token = await sign(payload, SECRET_KEY);

  setCookie(c, "auth_token", token, {
    httpOnly: true, // Cannot be accessed via JS
    secure: true, // Only over HTTPS
    sameSite: "lax", // Helps mitigate CSRF
    maxAge: 60 * 60 * 24 * 1, // 1 days
  });

  return c.json(
    Response.success({
      message: "User logged in successfully",
      data: {
        user: response,
        access_token: token,
      },
    }),
  );
});

authController.get("/profile", authMiddleware, async (c) => {
  return c.json(
    Response.success({ message: "User profile retrieved successfully" }),
  );
});
