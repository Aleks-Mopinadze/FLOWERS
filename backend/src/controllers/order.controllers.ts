import {RequestHandler} from "express";
import {createOrderSchema, ordersPaginationSchema} from "../schemas/orders.schema";
import {orderService} from "../services/orders.service";
import {zodErrorFormat} from "../utils/zod-error";
import {idField} from "../schemas/products.schema";
import {prisma} from "../lib/prisma";
import {AppError} from "../utils/errors";


export const getOrders:RequestHandler = async (req, res, next) => {
    try{
        const query = ordersPaginationSchema.parse(req.query);
        const result = await orderService.getOrders(query)

        return res.status(200).json({success: true,  ...result})
    }catch (error) {
        next(error)
    }
}
export const getOrder:RequestHandler = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if(!id) {
            return res.status(400).json({success: false, message: "Id is required"})
        }

        const data = await orderService.getOrder(id);
        return res.status(200).json({success: true, data})

    }catch (error){
        next(error)
    }
}
export const createOrder:RequestHandler = async (req, res, next) => {
   try{
       const parsedBody = createOrderSchema.safeParse(req.body);

       if(!parsedBody.success){
           return res.status(400).json({success: false, message: zodErrorFormat(parsedBody.error)})
       }

       const result = await orderService.createOrder({...parsedBody.data, userId: req.user.id})

       return res.status(200).json({success: true, data: result})
   }catch (error) {
       next(error)
   }
}
export const updateOrder:RequestHandler = async (req, res, next) => {

}
export const deleteOrder:RequestHandler = async (req, res, next) => {
 try {
     const parsedId = idField.safeParse(req.params.id);

     if(!parsedId.success) {
         return res.status(400).json({success: false, message: "Id is required"})
     }
     const id = parsedId.data
     const result = await orderService.deleteOrder(id)

     res.status(201).json({success: true, message: "Orders has been deleted"})
 }catch(error){
     next(error)
 }
}
