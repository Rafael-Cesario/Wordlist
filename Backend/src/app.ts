import cors from "cors";
import express, { json } from "express";
import { userRouter } from "./Routes/userRouter";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(json());
app.use(cors({ origin: true, credentials: true }));

app.use("/user", userRouter);

app.use(errorMiddleware);

export { app };
