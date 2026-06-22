import {z} from "zod";


const emailField = z.email();
const passwordField = z.string().min(8);

export const signupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(20),
    email: emailField,
    password: passwordField
});

export const signInSchema = z.object({
    email: emailField,
    password: passwordField,
});

export type SignUpInput = z.infer<typeof signupSchema>;
export type SignInInput = z.infer<typeof signInSchema>;