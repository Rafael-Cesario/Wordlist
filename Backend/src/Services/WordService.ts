import { CustomError } from "../helpers/CustomError";
import { WORD_ERRORS } from "../helpers/errors/wordErrors";
import { prisma } from "../prisma";
import type { CreateWord } from "../interfaces/wordInterface";

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
}
