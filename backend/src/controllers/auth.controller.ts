import { RequestHandler } from "express";
import { signInSchema, signupSchema } from "../schemas/auth.schema";
import { authService } from "../services/auth-service";
import {AppError} from "../utils/errors";
import {zodErrorFormat} from "../utils/zod-error";

export const signIn: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = signInSchema.safeParse(req.body);
    if (!parsedBody.success) {
     return  res.status(400).json({success: false, message: zodErrorFormat(parsedBody.error)})
    }

    const result = await authService.signIn(parsedBody.data);

    return res.status(200).json({ success: false, ...result });
  } catch (error) {
    next(error)
  }
};

export const signUp: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = signupSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({success: false, message: zodErrorFormat(parsedBody.error)});
    }

    const result = await authService.signUp(parsedBody.data);

    return res.status(201).json({ success: false, ...result });
  } catch (error) {
    next(error)
  }
};
