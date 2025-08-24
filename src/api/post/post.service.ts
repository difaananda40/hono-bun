import { prisma } from "@/core/database";
import type { User, Post } from "@/generated/prisma";
import { PostRequest, PostResponse, toPostResponse } from "./post.model";
import { PostValidation } from "./post.validation";
import { HTTPException } from "hono/http-exception";

export class PostService {
  static async getAll(): Promise<PostResponse[]> {
    const data = await prisma.post.findMany();
    const dataMapped = data.map((post) => toPostResponse(post));
    return dataMapped;
  }

  static async getById(id: number): Promise<PostResponse> {
    const parsedId = PostValidation.ID.parse(id) as number;
    const post = await prisma.post.findFirst({
      where: { id: parsedId },
      include: {
        author: true,
      },
    });

    if (!post) {
      throw new HTTPException(404, {
        message: "Post not found",
      });
    }

    return toPostResponse(post);
  }

  static async create(user: User, request: PostRequest): Promise<PostResponse> {
    const parsed = PostValidation.MUTATION.parse(request) as PostRequest;

    const post = await prisma.post.create({
      data: {
        ...parsed,
        authorId: user.id,
      },
    });

    return toPostResponse(post);
  }

  static async update(id: number, request: PostRequest): Promise<PostResponse> {
    const parsedId = PostValidation.ID.parse(id) as number;
    const parsed = PostValidation.MUTATION.parse(request) as PostRequest;

    await this.getById(parsedId);

    const post = await prisma.post.update({
      where: { id },
      data: parsed,
    });

    return toPostResponse(post);
  }

  static async delete(id: number): Promise<PostResponse> {
    const parsedId = PostValidation.ID.parse(id) as number;

    await this.getById(parsedId);

    const post = await prisma.post.delete({
      where: { id },
    });

    return toPostResponse(post);
  }
}
