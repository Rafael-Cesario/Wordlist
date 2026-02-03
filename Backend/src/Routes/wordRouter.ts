import { Router } from "express";
import { WordService } from "../Services/WordService";
import { WordController } from "../Controllers/WordController";

const wordService = new WordService();
const wordController = new WordController(wordService);
const router = Router();

router.post("/", (req, res) => wordController.create(req, res));
router.get("/:folderId", (req, res) => wordController.readAll(req, res));

export { router as wordRouter };
