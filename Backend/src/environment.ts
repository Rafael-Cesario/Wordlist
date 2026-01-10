import dotenv from "dotenv";

const environment = process.env["NODE_ENV"] ?? "development";

export default dotenv.config({
  debug: false,
  quiet: true,
  path: `.env.${environment}`,
});
