import "../environment";
import jwt from "jsonwebtoken";

export const EXPIRES_IN = 60 * 60 * 24; // 1 day

export const generateToken = (id: string) => {
  const secret = `${process.env["JWT_SECRET"]}`;
  const expiresIn = EXPIRES_IN;

  const token = jwt.sign({ id }, secret, { expiresIn });

  return token;
};
