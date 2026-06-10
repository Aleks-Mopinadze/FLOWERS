import { RequestHandler } from "express";
import {
  productSchema,
  paginationSchema, updateProductSchema,
} from "../schemas/products.schema";
import { productService } from "../services/products-service";
import { parseIssue } from "../utils/zod-issues-parser";
import {Prisma} from "../../generated/prisma/client";

export const getProducts: RequestHandler = async (req, res) => {
  try {
    const query = paginationSchema.parse(req.query);
    const result = await productService.getProducts(query);

    return res.status(200).json({ error: false, ...result });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Incorrect params" });
  }
};

export const getProduct: RequestHandler = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing product id" });
    }

    const product = await productService.getProduct(id);

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error instanceof Error && error.message === "Product not found") {
      return res.status(404).json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server Error" });
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  const parsedBody = productSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({ ...parseIssue(parsedBody.error.issues) });
  }

  try {
    const result = await productService.createProduct(parsedBody.data);

    res.status(201).json({ succes: true, data: result });
  } catch (error) {
    if (error instanceof Error && error.message === "Category does not exist") {
      return res.status(404).json({ succes: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server Error" });
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const parsedBody = updateProductSchema.safeParse(req.body);
    if (!parsedBody.success) return res.status(400).json({...parsedBody});

    const result = await productService.updateProduct(parsedBody.data)

    return res.status(201).json({success: true, data: result });
  }catch(error) {
    if(error instanceof Error && (error.message === "Category or Product does not exists" || error.message === "cant update product")) {
      res.status(400).json({success: false, message: error.message});
    }
    return res.status(500).json({ success: false, message: "Internal server Error" });
  }


};

export const deleteProduct: RequestHandler = async (req, res) => {
  try{
    const id =  Number(req.params.id);
    if (!id) {
      return res.status(400).json({success: false, message: "Mising product id"});
    }

    const result = await productService.deleteProduct(id);

    return res.status(201).json({success: true, message: "Product deleted" });

  }catch(error) {
    if(error instanceof Error && error.message === "Cannot delete product") {
      return res.status(400).json({success: false, message: error.message});
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(400).json({success: false, message: "Product with provided id not found"});
    }

    return res.status(500).json({ success: false, message: "Internal server Error" });
  }
};
