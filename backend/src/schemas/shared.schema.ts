import {z} from "zod";

export const pageField = z.coerce.number().int().positive().default(1).catch(1);
export const limitField = z.coerce.number().int().positive().max(50).default(10).catch(10)
