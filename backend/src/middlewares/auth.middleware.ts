import { RequestHandler } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { env } from "../../config/env";
import { prisma } from "../lib/prisma";

interface MyTokenPayload extends jwt.JwtPayload {
  userId: string;
}

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, env.JWT_SECRET) as MyTokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user)
      return res.status(401).json({ success: true, message: "User not found" });

    next();
    req.user = user;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Token expired" });
    }
    if (error instanceof JsonWebTokenError) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid token" });
    }

    console.error("Authentication middleware error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
