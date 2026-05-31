import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(8),
  HOST: z.string().default("0.0.0.0"),
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error(
    "Error occured in enviorment varriables:",
    envParsed.error.format(),
  );
  throw new Error("Cant start app, some error ocured in env");
}

export const env = envParsed.data;
