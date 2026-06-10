import { z } from "zod";

import { notProvidedInput, incorrectInput } from "./shared.schema";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1).catch(1),
  limit: z.coerce.number().int().positive().max(50).default(10).catch(10),
  category: z.string().default("all").catch("all"),
  sort: z.enum(["asc", "desc", "new"]).default("new").catch("new"),
  search: z.string().optional().catch(undefined),
});

export type QueryParams = z.infer<typeof paginationSchema>;

export const productSchema = z.object({
  name: z
    .string({ error: notProvidedInput })
    .trim()
    .min(2, { error: incorrectInput })
    .max(50, { error: incorrectInput }),
  price: z.coerce.number({ error: incorrectInput }).int().positive(),
  isAvailable: z.boolean().default(true).optional(),
  categoryId: z.coerce.number({ error: incorrectInput }).int().positive(),
  description: z
    .string({ error: notProvidedInput })
    .trim()
    .min(2, { error: incorrectInput })
    .max(300, { error: incorrectInput }),
});

export type ProductData = z.infer<typeof productSchema>;


export const updateProductSchema = z.object({
  id: z.coerce.number({ error: incorrectInput }).int({ error: incorrectInput }).positive(),
  name: z
      .string({ error: notProvidedInput })
      .trim()
      .min(2, { error: incorrectInput })
      .max(50, { error: incorrectInput }),
  price: z.coerce.number({ error: incorrectInput }).int().positive(),
  isAvailable: z.boolean().default(true).optional(),
  categoryId: z.coerce.number({ error: incorrectInput }).int().positive(),
  description: z
      .string({ error: notProvidedInput })
      .trim()
      .min(2, { error: incorrectInput })
      .max(300, { error: incorrectInput }),
});

export type updateProductData = z.infer<typeof updateProductSchema>;