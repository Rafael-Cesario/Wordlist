import cors from "cors";
import express, { json } from "express";
import { userRouter } from "./Routes/userRouter";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { authRouter } from "./Routes/authRouter";
import { folderRouter } from "./Routes/folderRouter";
import cookieParse from "cookie-parser";
import { authMiddleware } from "./middlewares/authMiddleware";
import { wordRouter } from "./Routes/wordRouter";

const app = express();

app.use(json());
app.use(cookieParse());
app.use(cors({ origin: true, credentials: true }));

app.use("/user", userRouter);
app.use("/auth", authRouter);

app.use(authMiddleware);

app.use("/folder", folderRouter);
app.use("/word", wordRouter);

app.use(errorMiddleware);

export { app };
