import type { Request, Response } from "express";
import type { FolderService } from "../Services/FolderService";
import z from "zod";

export class FolderController {
  constructor(private folderService: FolderService) {}

  async create(req: Request, res: Response) {
    const FolderSchema = z.object({ name: z.string().min(1).toLowerCase(), userId: z.uuid() });
    const folderData = FolderSchema.parse(req.body);

    const folder = await this.folderService.create(folderData);
    res.status(201).json(folder);
  }

  async readAll(req: Request, res: Response) {
    const userId = `${req.params.id}`;
    const folders = await this.folderService.readAll(userId);

    res.status(200).json({ userId, totalFolders: folders.length, folders });
  }

  async update(req: Request, res: Response) {
    const FolderSchema = z.object({
      id: z.uuid(),
      userId: z.uuid(),
      name: z.string().min(1).toLowerCase(),
    });

    const folderData = FolderSchema.parse(req.body);

    const folder = await this.folderService.update(folderData);

    res.status(200).json(folder);
  }

  async delete(req: Request, res: Response) {
    const folderId = `${req.params.id}`;
    
    await this.folderService.delete(folderId);

    res.status(200).json({ folderId, message: "Folder deleted." });
  }
}
