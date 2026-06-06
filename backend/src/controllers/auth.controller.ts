import { RequestHandler } from "express";
import { signInSchema, signupSchema } from "../schemas/auth.schema";
import { parseIssue } from "../utils/zod-issues-parser";
import { authService } from "../services/auth-service";

export const signIn: RequestHandler = async (req, res) => {
  const parsedBody = signInSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json(parseIssue(parsedBody.error.issues));
  }

  try {
    const result = await authService.signIn(parsedBody.data);

    return res.status(200).json({ error: false, ...result });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return res.status(409).json({ error: true, message: error.message });
    }

    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

export const signUp: RequestHandler = async (req, res) => {
  const parsedBody = signupSchema.safeParse(req.body);

  if (!parsedBody.success)
    return res.status(400).json(parseIssue(parsedBody.error.issues));

  try {
    const result = await authService.signUp(parsedBody.data);

    return res.status(201).json({ error: false, ...result });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "User with this email already exists"
    ) {
      return res.status(409).json({ error: true, message: error.message });
    }

    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};
