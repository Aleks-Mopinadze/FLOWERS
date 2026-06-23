import {CreateOrderSchemaType, OrdersPaginationParams} from "../schemas/orders.schema";
import {Prisma} from "../../generated/prisma/client";
import {prisma} from "../lib/prisma";
import {AppError} from "../utils/errors";

type CreateOrderType = CreateOrderSchemaType & {
    userId: string
}

export const orderService = {
    async getOrders({page, limit, sort}: OrdersPaginationParams) {
        const [orders, totalOrders] = await Promise.all([
            prisma.order.findMany({
                include: {order_items: true},
                orderBy: {order_date: sort},
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.order.count()
        ])

        const totalPages = Math.ceil(totalOrders / limit);

        const metaData = {
            currentPage: page,
            totalOrders,
            totalPages,
            hasNextPage: page < totalPages
        }

        return {metaData, data: orders};
    },
    async getOrder(id: number) {

        const order = await prisma.order.findUnique({
            where: {id},
            include: {order_items: true}
        });

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        return order
    },
    async createOrder({userId, status, paymentMethod, orderItems}: CreateOrderType) {
        
        const productIds = orderItems.map(i => i.productId);
        const products = await prisma.product.findMany({
            where: {id: {in: productIds}, is_available: true},
            select: {id: true, price: true}
        });

        if (products.length !== productIds.length) {
            throw new AppError('Один или несколько товаров недоступны', 400);
        }

        const priceMap = new Map(products.map(p => [p.id, p.price]));

        let totalPrice = new Prisma.Decimal(0);
        const itemsData = orderItems.map(item => {
            const price = priceMap.get(item.productId)!;
            totalPrice = totalPrice.plus(price.mul(item.quantity));
            return {
                product_id: item.productId,
                quantity: item.quantity,
                price_at_purchase: price
            };
        });

        return prisma.$transaction(async (tx) => {

            const order = await tx.order.create({
                data: {
                    user_id: userId,
                    payment_method: paymentMethod,
                    status,
                    total_price: totalPrice
                }
            });

            await tx.orderItem.createMany({
                data: itemsData.map(item => ({order_id: order.id, ...item}))
            });

            return tx.order.findUnique({
                where: {id: order.id},
                include: {order_items: true}
            });
        });
    },
    async deleteOrder(id: number) {
        return prisma.order.delete({ where: { id } });
    }
}