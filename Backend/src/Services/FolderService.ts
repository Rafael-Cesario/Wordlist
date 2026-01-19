import type { CreateFolder } from "../interfaces/folderInterface";
import { CustomError } from "../helpers/CustomError";
import { USER_ERRORS } from "../helpers/errors/userErrors";
import { prisma } from "../prisma";

export class FolderService {
  async create(data: CreateFolder) {
    const haveUser = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!haveUser) throw new CustomError(USER_ERRORS.notFound);
  }
}
