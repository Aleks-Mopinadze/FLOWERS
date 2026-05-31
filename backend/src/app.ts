import express from "express";
import { env } from "../config/env";
const app = express();

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(env.PORT, env.HOST, () => {
  console.log(`Server ran successfully on port ${env.PORT}`);
});
