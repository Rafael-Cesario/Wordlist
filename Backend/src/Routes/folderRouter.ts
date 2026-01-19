import { Router } from "express";
import { FolderController } from "../Controllers/FolderController";
import { FolderService } from "../Services/FolderService";

const router = Router();
const folderService = new FolderService();
const folderController = new FolderController(folderService);

export { router as folderRouter };
