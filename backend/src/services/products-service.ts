import {Prisma} from "../../generated/prisma/client";
import {prisma} from "../lib/prisma";
import {ProductData, QueryParams, updateProductData} from "../schemas/products.schema";

export const productService = {
    async getProducts({page, limit, category, sort, search}: QueryParams) {
        const whereClause: Prisma.ProductWhereInput = {
            is_available: true,
        };

        if (category && category !== "all") {
            whereClause.product_category = {name: category};
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

        return {data: products, metaData};
    },
    async getProduct(id: number) {
        const product = await prisma.product.findUnique({
            where: {id},
            include: {product_category: true},
        });
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    },
    async createProduct({name, isAvailable, price, description, categoryId}: ProductData) {
        const existCategory = await prisma.productCategory.findUnique({
            where: {id: categoryId},
        });

        if (!existCategory) {
            throw new Error("Category does not exist");
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                price,
                is_available: isAvailable,
                product_category_id: categoryId,
                description,
            },
            include: {product_category: true},
        });

        if (!newProduct) {
            throw new Error("Internal server error");
        }

        return newProduct;
    },
    async updateProduct({id, name, isAvailable, price, description, categoryId}:updateProductData){

        const existCategory = await prisma.productCategory.findUnique({where: {id: categoryId}})

        if( !existCategory){
            throw new Error("Category or Product does not exists");
        }

        const updatedProduct = await prisma.product.update({
            where: {id},
            data: {name, is_available: isAvailable, price, description, product_category_id: categoryId},
        })

        if(!updatedProduct){
            throw new Error("cant update product");
        }

        return updatedProduct
    },
    async deleteProduct(id: number) {
        const result = await prisma.product.delete({where: {id}})
        if(!result) {
            throw new Error("Cannot delete product");
        }
        return result;
    }
};
