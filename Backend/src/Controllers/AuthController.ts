import type { Request, Response } from "express";
import type { AuthService } from "../Services/AuthService";

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response) {}
}
