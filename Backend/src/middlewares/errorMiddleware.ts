import type { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";

export const errorMiddleware = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  console.log(error);

  if (req.body === undefined && error instanceof ZodError) {
    return res.status(400).json({ error: z.flattenError(error).formErrors });
  }

  return res.status(500).json({ error: "Internal server error." });
};
