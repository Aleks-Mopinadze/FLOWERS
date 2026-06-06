import argon2 from "argon2";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { signUpProps, signInProps } from "./types";

export const authService = {
  async signUp({ name, email, password }: signUpProps) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return { token, user: { name: user.name, email: user.email } };
  },

  async signIn({ email, password }: signInProps) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("User Not Found");
    }

    const isPasswordCorrect = await argon2.verify(user.password, password);

    if (!isPasswordCorrect) {
      throw new Error("Incorrect email or password");
    }

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return { token, user: { name: user.name, email: user.email } };
  },
};
