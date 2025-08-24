import { Hono } from "hono";
import type { User } from "@/generated/prisma";
import { PostRequest, PostResponse } from "./post.model";
import { PostService } from "./post.service";
import { Response } from "@/core/response";
import { authMiddleware } from "@/middleware/auth.middleware";

// Routes: "/post"
export const postController = new Hono();

postController.use(authMiddleware);

postController.get("/", async (c) => {
  const response = await PostService.getAll();

  return c.json(Response.success({ data: response }));
});

postController.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  const response = await PostService.getById(id);

  return c.json(Response.success({ data: response }));
});

postController.post("/", async (c) => {
  const user = c.get("user") as User;
  const request = c.get("body") as PostRequest;
  const response = await PostService.create(user, request);

  return c.json(
    Response.success({
      message: "Post created successfully",
      data: response,
    }),
  );
});

postController.patch("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const request = c.get("body") as PostRequest;
  const response = await PostService.update(id, request);

  return c.json(
    Response.success({
      message: "Post updated successfully",
      data: response,
    }),
  );
});

postController.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const response = await PostService.delete(id);

  return c.json(
    Response.success({
      message: "Post deleted successfully",
      data: response,
    }),
  );
});
