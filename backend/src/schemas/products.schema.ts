import { z } from "zod";
import { pageField, limitField} from "./shared.schema";

export const idField =  z.coerce.number('Invalid format id').int('Invalid format id').positive('Invalid format id');

const descriptionField =  z
        .string()
        .trim()
        .min(2)
        .max(300);

const nameField = z
        .string()
        .trim()
        .min(2)
        .max(50);


export const paginationSchema = z.object({
  page: pageField,
  limit: limitField,
  category: z.string().transform(str => str.replace('-', ' ')).default("all").catch("all"),
  sort: z.enum(["asc", "desc", "new"]).default("new").catch("new"),
  search: z.string().optional().catch(undefined),
});

export const productSchema = z.object({
  name: nameField,
  price: z.coerce.number().positive(),
  isAvailable: z.boolean().default(true).optional(),
  categoryId: idField,
  description: descriptionField
});

export const updateProductSchema = z.object({
  id: idField,
  name: nameField,
  price: z.coerce.number().positive(),
  isAvailable: z.boolean().optional().default(true),
  categoryId: idField,
  description: descriptionField
});




export type QueryParams = z.infer<typeof paginationSchema>;
export type updateProductData = z.infer<typeof updateProductSchema>;
export type ProductData = z.infer<typeof productSchema>;