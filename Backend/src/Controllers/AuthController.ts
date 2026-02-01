import "../environment";
import type { Request, Response } from "express";
import type { AuthService } from "../Services/AuthService";
import z from "zod";
import { EXPIRES_IN } from "../helpers/token";
import { CustomError } from "../helpers/CustomError";
import { AUTH_ERRORS } from "../helpers/errors/authErrors";

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response) {
    const LoginSchema = z.object({ email: z.email(), password: z.string().min(1) });
    const loginInput = LoginSchema.parse(req.body);

    const login = await this.authService.login(loginInput);
    const isProduction = process.env["NODE_ENV"] === "production";

    res.cookie("authentication", login.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: EXPIRES_IN * 1000,
      path: "/",
      domain: "localhost",
    });

    res.status(200).json(login.user);
  }

  async validateToken(req: Request, res: Response) {
    const token = req.body.token;
    if (!token) throw new CustomError(AUTH_ERRORS.tokenNotFound);

    await this.authService.validateToken(token);
    res.status(200).json({ message: "Authorized" });
  }
}
