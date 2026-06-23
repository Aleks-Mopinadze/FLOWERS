import {Prisma} from "../../generated/prisma/client";
import {prisma} from "../lib/prisma";
import {ProductData, QueryParams, updateProductData} from "../schemas/products.schema";
import {AppError} from "../utils/errors";

export const productService = {
    async getProducts({page, limit, category, sort, search}: QueryParams) {
        console.log(category)
        const whereClause: Prisma.ProductWhereInput = {
            is_available: true,
        };

        if (category && category !== "all") {
            whereClause.product_category = {name: {equals: category, mode: 'insensitive'}};
        }

        if (search) {
            whereClause.OR = [
                {name: {contains: search, mode: "insensitive"}},
                {description: {contains: search, mode: "insensitive"}},
            ];
        }

        const orderMapping: Record<string, Prisma.ProductOrderByWithRelationInput> =
            {
                asc: {price: "asc"},
                desc: {price: "desc"},
                new: {createdAt: "desc"},
            };

        const [products, totalProducts] = await Promise.all([
            prisma.product.findMany({
                where: whereClause,
                orderBy: orderMapping[sort],
                skip: (page - 1) * limit,
                take: limit,
                include: {product_category: true}
            }),
            prisma.product.count({where: whereClause}),
        ]);

        const totalPages = Math.ceil(totalProducts / limit);

        const metaData = {
            currentPage: page,
            totalPages,
            totalProducts,
            hasNextPage: page < totalPages,
        };

        return {metaData, data: products};
    },
    async getProduct(id: number) {
        const product = await prisma.product.findUnique({
            where: {id},
            include: {product_category: true},
        });
        if (!product) {
            throw new AppError('Product not found', 404);
        }
        return product;
    },
    async createProduct({name, isAvailable, price, description, categoryId}: ProductData) {
        const existCategory = await prisma.productCategory.findUnique({
            where: {id: categoryId},
        });

        if (!existCategory) {
            throw new AppError('Category not found', 404);
        }

        return prisma.product.create({
            data: {
                name,
                price: new Prisma.Decimal(price),
                is_available: isAvailable,
                product_category_id: categoryId,
                description,
            },
            include: {product_category: true},
        });
    },
    async updateProduct({id, name, isAvailable, price, description, categoryId}:updateProductData){

        const existCategory = await prisma.productCategory.findUnique({where: {id: categoryId}})

        if( !existCategory){
            throw new AppError('Category or Product does not exists', 404);
        }

        return  prisma.product.update({
            where: {id},
            data: {
                name,
                is_available: isAvailable,
                price: new Prisma.Decimal(price),
                description,
                product_category_id: categoryId},
        })
    },
    async deleteProduct(id: number) {
        const result = await prisma.product.delete({where: {id}})
        if(!result) {
            throw new AppError("Cannot delete product", 500);
        }
        return result;
    }
};
