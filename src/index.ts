import { Hono } from "hono";
import { parseBodyMiddleware } from "@/middleware/parse-body.middleware";
import { cors } from "hono/cors";
import { errorHandler } from "@/core/error-handler";
import { authController } from "@/api/auth/auth.controller";
import { postController } from "@/api/post/post.controller";

const app = new Hono().basePath("/api");

app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(parseBodyMiddleware);

app.get("/", (c) => {
  return c.json({
    message: "Hello Hono!",
  });
});

app.route("/auth", authController);
app.route("/post", postController);

app.onError(errorHandler);

export default {
  port: 4320,
  fetch: app.fetch,
};
