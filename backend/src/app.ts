import express from "express";
import { env } from "../config/env";
import productsRouter from "./routes/product.routes";
import ordersRouter from "./routes/order.routes";
import authRouter from "./routes/auth.routes";
import usersRouter from "./routes/user.route";
import {ErrorMiddleware} from "./middlewares/error.middleware";

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/users", usersRouter);

app.use(ErrorMiddleware)

app.get("/", (req, res) => {
  res.send("Welcome to Flowers store API");
});

app.listen(env.PORT, env.HOST, () => {
  console.log(`Server ran successfully on port ${env.PORT}`);
});
