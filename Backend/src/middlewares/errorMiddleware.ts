import type { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";
import { CustomError } from "../helpers/CustomError";
import { AUTH_ERRORS } from "../helpers/errors/authErrors";

export const errorMiddleware = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  if (req.body === undefined && error instanceof ZodError) {
    return res.status(400).json({ error: z.flattenError(error).formErrors });
  }

  if (error instanceof ZodError) {
    return res.status(400).json(z.flattenError(error).fieldErrors);
  }

  if (error instanceof CustomError) {
    return res.status(400).json({ error: { code: error.code, message: error.message } });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(403).json({ error: AUTH_ERRORS.tokenExpired });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(403).json({ error: AUTH_ERRORS.invalidSignature });
  }

  return res.status(500).json({ error: "Internal server error." });
};
