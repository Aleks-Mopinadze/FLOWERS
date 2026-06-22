import { RequestHandler } from "express";
import {
  productSchema,
  paginationSchema, updateProductSchema, idField,
} from "../schemas/products.schema";
import { productService } from "../services/products-service";
import {Prisma} from "../../generated/prisma/client";
import {zodErrorFormat} from "../utils/zod-error";

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const query = paginationSchema.parse(req.query);
    const result = await productService.getProducts(query);

    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error)
  }
};

export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const parsedId = idField.safeParse(req.params.id);

    console.log(parsedId.error)

    if (!parsedId.success) {
      return res
        .status(400)
        .json({ success: false, message: zodErrorFormat(parsedId.error) });
    }

    const id = parsedId.data

    const product = await productService.getProduct(id);

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error)
  }
};

export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = productSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({success: false, message: zodErrorFormat(parsedBody.error)});
    }
    const result = await productService.createProduct(parsedBody.data);

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error)
  }
};

export const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = updateProductSchema.safeParse(req.body);

    if (!parsedBody.success) return res.status(400).json({success: false, message: zodErrorFormat(parsedBody.error)});

    const result = await productService.updateProduct(parsedBody.data)

    return res.status(201).json({success: true, data: result });
  }catch(error) {
    next(error)
  }


};

export const deleteProduct: RequestHandler = async (req, res, next) => {
  try{
    const parsedId =  idField.safeParse(req.params.id);

    if (!parsedId.success) {
      return res.status(400).json({success: false, message: zodErrorFormat(parsedId.error)});
    }

    const id = parsedId.data;

    const result = await productService.deleteProduct(id);

    return res.status(200).json({success: true, message: "Product deleted" });

  }catch(error) {
    next(error)
  }
};
