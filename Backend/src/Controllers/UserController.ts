import type { Request, Response } from "express";
import type { UserService } from "../Services/UserService";
import z, { email } from "zod";

export class UserController {
  constructor(private userService: UserService) {}

  async create(req: Request, res: Response) {
    const UserSchema = z.object({
      email: z.email(),
      name: z.string().min(1),
      password: z.string().min(1),
    });

    const userData = UserSchema.parse(req.body);
  }
}
