import { Hono } from "hono";
import type { User } from "@/generated/prisma";
import { RegisterUserRequest, LoginUserRequest } from "./auth.model";
import { AuthService } from "./auth.service";
import { Response } from "@/core/response";
import { setCookie } from "hono/cookie";
import { authMiddleware } from "@/middleware/auth.middleware";

export const authController = new Hono();

authController.post("/register", async (c) => {
  const request = (await c.get("body")) as RegisterUserRequest;
  const response = await AuthService.register(request);
  const token = await AuthService.generateToken(response);

  setCookie(c, "auth_token", token, {
    httpOnly: true, // Cannot be accessed via JS
    secure: true, // Only over HTTPS
    sameSite: "lax", // Helps mitigate CSRF
    maxAge: 60 * 60 * 24 * 1, // 1 days
  });

  return c.json(
    Response.success({
      message: "User registered successfully",
      data: {
        user: response,
        access_token: token,
      },
    }),
  );
});

authController.post("/login", async (c) => {
  const request = (await c.get("body")) as LoginUserRequest;
  const response = await AuthService.login(request);
  const token = await AuthService.generateToken(response);

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
  const user = c.get("user") as User;

  return c.json(
    Response.success({
      message: "User profile retrieved successfully",
      data: user,
    }),
  );
});
