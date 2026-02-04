import { CustomError } from "../helpers/CustomError";
import { WORD_ERRORS } from "../helpers/errors/wordErrors";
import { prisma } from "../prisma";
import type { CreateWord, UpdateWord } from "../interfaces/wordInterface";

export class WordService {
  async create(data: CreateWord) {
    const hasFolder = await prisma.folder.findUnique({ where: { id: data.folderId } });
    if (!hasFolder) throw new CustomError(WORD_ERRORS.folderNotFound);

    const word = await prisma.word.create({ data });
    return word;
  }

  async readAll(folderId: string) {
    const hasFolder = await prisma.folder.findUnique({ where: { id: folderId } });
    if (!hasFolder) throw new CustomError(WORD_ERRORS.folderNotFound);

    const words = await prisma.word.findMany({ where: { folderId } });
    return words;
  }

  async update(data: UpdateWord) {
    const hasWord = await prisma.word.findUnique({ where: { id: data.id } });
    if (!hasWord) throw new CustomError(WORD_ERRORS.notFound);

    const word = await prisma.word.update({
      where: { id: data.id },
      data,
    });

    return word;
  }

  async delete(id: string) {
    const hasWord = await prisma.word.findUnique({ where: { id } });
    if (!hasWord) throw new CustomError(WORD_ERRORS.notFound);

    await prisma.word.delete({ where: { id } });
  }
}
