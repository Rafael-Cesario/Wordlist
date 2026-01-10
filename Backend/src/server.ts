import "./environment";
import { styleText } from "node:util";
import { app } from "./app";

const port = `${process.env["PORT"]}`;

app.listen(port, () => {
  console.log(styleText("green", `Server is open on port: ${port}`));
});
