import { Router, type Request, type Response } from "express";
import { FolderController } from "../Controllers/FolderController";
import { FolderService } from "../Services/FolderService";

const router = Router();
const folderService = new FolderService();
const folderController = new FolderController(folderService);

router.post("/", (req: Request, res: Response) => folderController.create(req, res));

export { router as folderRouter };
