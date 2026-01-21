import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../helpers/CustomError";
import { validateToken } from "../helpers/token";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  const token = cookies["authentication"];

  if (!token) throw new CustomError({ code: "A101", message: "cookieNotFound" });

  validateToken(token);

  next();
};
