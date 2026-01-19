import type { Request, Response } from "express";
import type { FolderService } from "../Services/FolderService";
import z from "zod";

export class FolderController {
  constructor(private folderService: FolderService) {}

  async create(req: Request, res: Response) {
    const folderSchema = z.object({ name: z.string().min(1).toLowerCase(), userId: z.uuid() });
    const folderData = folderSchema.parse(req.body);

    const folder = await this.folderService.create(folderData);

    console.log("Folder controller");
  }
}
