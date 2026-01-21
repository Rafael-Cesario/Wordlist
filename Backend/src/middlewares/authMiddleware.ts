import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../helpers/CustomError";
import { validateToken } from "../helpers/token";
import { AUTH_ERRORS } from "../helpers/errors/authErrors";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  const token = cookies["authentication"];

  if (!token) throw new CustomError(AUTH_ERRORS.cookiesNotFound);

  validateToken(token);

  next();
};
