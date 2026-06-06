import { z } from "zod";

const notProvidedInput = "Missing data";
const incorrectInput = "Incorrect data format";

const emailField = z.email({ error: notProvidedInput });

export const signupSchema = z.object({
  name: z
    .string({ error: notProvidedInput })
    .trim()
    .min(2, { error: incorrectInput })
    .max(20, { error: incorrectInput }),
  email: emailField,
  password: z
    .string({ error: notProvidedInput })
    .min(8, { error: incorrectInput }),
});

export const signInSchema = z.object({
  email: emailField,
  password: z
    .string({ error: notProvidedInput })
    .min(8, { error: incorrectInput }),
});
