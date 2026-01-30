import type { CreateFolder, UpdateFolder } from "../interfaces/folderInterface";
import { CustomError } from "../helpers/CustomError";
import { USER_ERRORS } from "../helpers/errors/userErrors";
import { prisma } from "../prisma";
import { FOLDER_ERRORS } from "../helpers/errors/folderErrors";

export class FolderService {
  async create(data: CreateFolder) {
    const hasUser = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!hasUser) throw new CustomError(USER_ERRORS.notFound);

    const folder = await prisma.folder.create({ data });

    return folder;
  }

  async readAll(userId: string) {
    const hasUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!hasUser) throw new CustomError(USER_ERRORS.notFound);

    const folders = await prisma.folder.findMany({ where: { userId } });
    return folders;
  }

  async update(data: UpdateFolder) {
    const hasFolder = await prisma.folder.findUnique({ where: { id: data.id } });
    if (!hasFolder) throw new CustomError(FOLDER_ERRORS.notFound);

    const hasUser = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!hasUser) throw new CustomError(USER_ERRORS.notFound);

    const folder = await prisma.folder.update({
      where: { id: data.id },
      data,
    });

    return folder;
  }

  async delete(id: string) {
    const hasFolder = await prisma.folder.findUnique({ where: { id } });
    if (!hasFolder) throw new CustomError(FOLDER_ERRORS.notFound);

    await prisma.folder.delete({ where: { id }});
  }
}
