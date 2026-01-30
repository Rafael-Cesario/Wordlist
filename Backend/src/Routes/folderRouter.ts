import { Router } from "express";
import { FolderController } from "../Controllers/FolderController";
import { FolderService } from "../Services/FolderService";

const router = Router();
const folderService = new FolderService();
const folderController = new FolderController(folderService);

router.post("/", (req, res) => folderController.create(req, res));
router.get("/:id", (req, res) => folderController.readAll(req, res));
router.put("/", (req, res) => folderController.update(req, res));
router.delete("/:id", (req, res) => folderController.delete(req, res));

export { router as folderRouter };
