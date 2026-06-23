import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import {authenticate} from "../middlewares/auth.middleware";

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProduct);
productsRouter.post("/",authenticate, createProduct);
productsRouter.put("/:id",authenticate,  updateProduct);
productsRouter.delete("/:id",authenticate,  deleteProduct);

export default productsRouter;
