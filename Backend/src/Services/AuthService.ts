import { AUTH_ERRORS } from "../helpers/errors/authErrors";
import { CustomError } from "../helpers/CustomError";
import { verifyPassword } from "../helpers/hashPassword";
import { generateToken, validateToken } from "../helpers/token";
import type { Login } from "../interfaces/authInterface";
import { prisma } from "../prisma";

export class AuthService {
  async login({ email, password }: Login) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new CustomError(AUTH_ERRORS.invalidCredentials);

    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) throw new CustomError(AUTH_ERRORS.invalidCredentials);

    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(user.id);

    return { user: userWithoutPassword, token };
  }

  async validateToken(token: string) {
    const isValid = validateToken(token);
    return isValid;
  }
}
