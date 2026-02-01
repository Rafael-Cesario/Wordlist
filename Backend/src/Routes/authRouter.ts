import { Router } from "express";
import { AuthService } from "../Services/AuthService";
import { AuthController } from "../Controllers/AuthController";

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/", (req, res) => authController.login(req, res));
router.post("/validate", (req, res) => authController.validateToken(req, res));

export { router as authRouter };
