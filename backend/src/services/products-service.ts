import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { QueryParams } from "../schemas/products.schema";

export const productService = {
  async getProducts({ page, limit, category, sort, search }: QueryParams) {
    const whereClause: Prisma.ProductWhereInput = {
      is_available: true,
    };

    if (category && category !== "all") {
      whereClause.product_category = { name: category };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderMapping: Record<string, Prisma.ProductOrderByWithRelationInput> =
      {
        asc: { price: "asc" },
        desc: { price: "desc" },
        new: { createdAt: "desc" },
      };

    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        orderBy: orderMapping[sort],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    const metaData = {
      currentPage: page,
      totalPages,
      totalProducts,
      hasNextPage: page < totalPages,
    };

    return { data: products, metaData };
  },
};
