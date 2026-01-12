import { Router, type Request, type Response } from "express";
import { AuthService } from "../Services/AuthService";
import { AuthController } from "../Controllers/AuthController";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/", (req: Request, res: Response) => authController.login(req, res));

export { router as authRouter };
