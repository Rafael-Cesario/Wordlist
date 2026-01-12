import { prisma } from "../prisma";
import { CustomError, USER_ERRORS } from "../helpers/CustomError";
import type { CreateUser } from "../interfaces/userInterface";

export class UserService {
  async create(userData: CreateUser) {
    const emailAlreadyExist = await prisma.user.findUnique({ where: { email: userData.email } });
    if (emailAlreadyExist) throw new CustomError(USER_ERRORS.uniqueConstraint);

    const user = await prisma.user.create({ data: userData });
    return user;
  }
}
