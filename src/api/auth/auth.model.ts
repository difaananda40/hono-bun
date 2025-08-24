import type { User } from "@/generated/prisma";

export type RegisterUserRequest = {
  username: string;
  password: string;
  name: string;
};

export type LoginUserRequest = {
  username: string;
  password: string;
};

export type AuthResponse = {
  id: number;
  username: string;
  name: string;
  token?: string;
};

export function toAuthResponse(user: User): AuthResponse {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
  };
}
