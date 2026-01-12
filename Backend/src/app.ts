import cors from "cors";
import express, { json } from "express";
import { userRouter } from "./Routes/userRouter";

const app = express();

app.use(json());
app.use(cors({ origin: true, credentials: true }));

app.use("/user", userRouter);

export { app };
