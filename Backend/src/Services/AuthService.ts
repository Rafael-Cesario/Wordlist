import { AUTH_ERRORS } from "../helpers/errors/authErrors";
import { CustomError } from "../helpers/CustomError";
import { verifyPassword } from "../helpers/hashPassword";
import { generateToken } from "../helpers/token";
import type { Login } from "../interfaces/authInterface";
import { prisma } from "../prisma";

export class AuthService {
  async login({ email, password }: Login) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new CustomError(AUTH_ERRORS.invalidCredentials);

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) throw new CustomError(AUTH_ERRORS.invalidCredentials);

    const token = generateToken(user.id);

    return token;
  }
}
