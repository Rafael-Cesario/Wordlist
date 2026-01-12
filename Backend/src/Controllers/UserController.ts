import type { Request, Response } from "express";
import type { UserService } from "../Services/UserService";
import z from "zod";
import { hashPassword } from "../helpers/hashPassword";

export class UserController {
  constructor(private userService: UserService) {}

  async create(req: Request, res: Response) {
    const UserSchema = z.object({
      email: z.email().toLowerCase(),
      name: z.string().min(1),
      password: z.string().min(1),
    });

    const createUserInput = UserSchema.parse(req.body);

    createUserInput.password = await hashPassword(createUserInput.password);

    const userData = await this.userService.create(createUserInput);
    const { password, ...user } = userData;

    res.status(201).json(user);
  }
}
