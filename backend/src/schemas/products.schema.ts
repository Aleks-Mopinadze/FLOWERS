import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1).catch(1),
  limit: z.coerce.number().int().positive().max(50).default(10).catch(10),
  category: z.string().default("all").catch("all"),
  sort: z.enum(["asc", "desc", "new"]).default("new").catch("new"),
  search: z.string().optional().catch(undefined),
});

export type QueryParams = z.infer<typeof paginationSchema>;
