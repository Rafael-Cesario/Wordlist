import type { Request, Response } from "express";
import type { WordService } from "../Services/WordService";
import z from "zod";

export class WordController {
  constructor(private wordService: WordService) {}

  async create(req: Request, res: Response) {
    const WordSchema = z.object({
      folderId: z.uuid(),
      word: z.string().min(1),
      definition: z.string().min(1),
    });

    const data = WordSchema.parse(req.body);

    const word = await this.wordService.create(data);

    res.status(201).json(word);
  }

  async readAll(req: Request, res: Response) {
    const folderId = `${req.params.folderId}`;

    const words = await this.wordService.readAll(folderId);

    res.status(200).json({ folderId, totalWords: words.length, words });
  }

  async update(req: Request, res: Response) {
    const WordSchema = z.object({
      id: z.uuid(),
      folderId: z.uuid(),
      word: z.string().min(1),
      definition: z.string().min(1),
    });

    const data = WordSchema.parse(req.body);

    const word = await this.wordService.update(data);

    res.status(200).json(word);
  }
}
