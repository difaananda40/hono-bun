import { prisma } from "@/core/database";
import {
  RegisterUserRequest,
  LoginUserRequest,
  AuthResponse,
  toAuthResponse,
} from "./auth.model";
import { AuthValidation } from "./auth.validation";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";

export class AuthService {
  static async generateToken(user: AuthResponse): Promise<string> {
    const payload = {
      sub: user.id,
      username: user.username,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
    };

    const token = await sign(payload, process.env.SECRET_KEY!);

    return token;
  }

  static async register(request: RegisterUserRequest): Promise<AuthResponse> {
    const parsed = AuthValidation.REGISTER.parse(
      request,
    ) as RegisterUserRequest;

    const findUsername = await prisma.user.findUnique({
      where: {
        username: parsed.username,
      },
    });

    if (findUsername) {
      throw new HTTPException(400, {
        message: "Username already exists",
      });
    }

    const cryptedPassword = await Bun.password.hash(parsed.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    const user = await prisma.user.create({
      data: {
        ...parsed,
        password: cryptedPassword,
      },
    });

    return toAuthResponse(user);
  }

  static async login(request: LoginUserRequest): Promise<AuthResponse> {
    const parsed = AuthValidation.LOGIN.parse(request) as LoginUserRequest;

    const user = await prisma.user.findUnique({
      where: {
        username: parsed.username,
      },
    });

    if (!user) {
      throw new HTTPException(400, {
        message: "Username or password is incorrect",
      });
    }

    const isPasswordValid = await Bun.password.verify(
      parsed.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HTTPException(400, {
        message: "Username or password is incorrect",
      });
    }

    return toAuthResponse(user);
  }
}
