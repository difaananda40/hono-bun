import type { Post, User } from "@/generated/prisma";
import { AuthResponse, toAuthResponse } from "@/api/auth/auth.model";

export type PostWithAuthor = Post & {
  author: User;
};

export type PostRequest = {
  title: string;
  content: string;
};

export type PostResponse = {
  id: number;
  title: string;
  content: string;
  author?: AuthResponse;
};

export function toPostResponse(post: Post | PostWithAuthor): PostResponse {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    author: "author" in post ? toAuthResponse(post.author) : undefined,
  };
}
