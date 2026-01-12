import type { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";
import { CustomError } from "../helpers/CustomError";

export const errorMiddleware = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  if (req.body === undefined && error instanceof ZodError) {
    return res.status(400).json({ error: z.flattenError(error).formErrors });
  }

  if (error instanceof ZodError) {
    return res.status(400).json(z.flattenError(error).fieldErrors);
  }

  if (error instanceof CustomError) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(500).json({ error: "Internal server error." });
};
