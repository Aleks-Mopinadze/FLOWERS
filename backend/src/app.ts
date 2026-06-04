import express from "express";
import { env } from "../config/env";
import productsRouter from "./routes/product.routes";
import ordersRouter from "./routes/order.routes";
import authRouter from "./routes/auth.routes";
import usersRouter from "./routes/user.route";
const app = express();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/users", usersRouter);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(env.PORT, env.HOST, () => {
  console.log(`Server ran successfully on port ${env.PORT}`);
});
