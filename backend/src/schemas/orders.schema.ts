import {z} from "zod"

export const ordersPaginationSchema = z.object({

})

export const getOrders = z.object({
    userId: z.string(),
    paymentMethod: z.enum(['cash', 'card']).default('card'),
    total_price: z.coerce.number().int().positive(),
    status: z.enum(['pending', 'complete'])
})

export type GetProducts = z.infer<typeof getOrders>;