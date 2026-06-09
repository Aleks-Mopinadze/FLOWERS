import { RequestHandler } from "express";
import { paginationSchema } from "../schemas/products.schema";
import { productService } from "../services/products-service";

export const getProducts: RequestHandler = async (req, res) => {
  try {
    const query = paginationSchema.parse(req.query);
    const result = await productService.getProducts(query);

    return res.status(200).json({ error: false, ...result });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Incorrect params" });
  }
};

export const getProduct: RequestHandler = (req, res) => {};
export const createProduct: RequestHandler = (req, res) => {};
export const updateProduct: RequestHandler = (req, res) => {};
export const changeProduct: RequestHandler = (req, res) => {};
export const deleteProduct: RequestHandler = (req, res) => {};
