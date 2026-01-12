import type { Request, Response } from "express";
import type { UserService } from "../Services/UserService";

export class UserController {
  constructor(private userService: UserService) {}

  async create(req: Request, res: Response) {}
}
