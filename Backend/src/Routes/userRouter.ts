import { Router, type Request, type Response } from "express";
import { UserController } from "../Controllers/UserController";
import { UserService } from "../Services/UserService";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post("/", (req: Request, res: Response) => userController.create(req, res));

export { router as userRouter };
