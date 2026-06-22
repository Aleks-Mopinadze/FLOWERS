import argon2 from "argon2";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import {AppError} from "../utils/errors";
import {SignInInput, SignUpInput} from "../schemas/auth.schema";

export const authService = {
  async signUp({ name, email, password }: SignUpInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new AppError("User with this email already exists", 409);

    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return { token, user: { name: user.name, email: user.email } };
  },
  async signIn({ email, password }: SignInInput) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new AppError("Invalid email or password", 401);

    const isPasswordCorrect = await argon2.verify(user.password, password);

    if (!isPasswordCorrect) throw new AppError("Invalid email or password", 401);

    const token =  jwt.sign(
        { userId: user.id },
        env.JWT_SECRET,
        {expiresIn: "1d",}
    );

    return { token, user: { id:user.id, name: user.name, email: user.email } };
  },
};
