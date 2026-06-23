import {z} from "zod"
import {limitField, pageField} from "./shared.schema";

export const ordersPaginationSchema = z.object({
    page: pageField,
    limit: limitField,
    sort: z.enum(["asc", "desc"]).default("asc").catch("asc"),
})
export type OrdersPaginationParams = z.infer<typeof ordersPaginationSchema>;


const orderItemSchema = z.object({
    productId: z.coerce.number().int().positive(),
    quantity: z.number().int().positive()
})
export const createOrderSchema = z.object({
    paymentMethod: z.enum(['cash', 'card']).default('card'),
    status: z.enum(['pending', 'complete']).default('pending').catch("pending"),
    orderItems: z.array(orderItemSchema)
})
export type CreateOrderSchemaType = z.infer<typeof createOrderSchema>;

