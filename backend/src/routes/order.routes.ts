import { Router } from "express";
import {deleteOrder, getOrder, getOrders, updateOrder} from "../controllers/order.controllers";

const ordersRouter = Router();
ordersRouter.get('/', getOrders)
ordersRouter.get('/:id', getOrder)
ordersRouter.put('/:id', updateOrder)
ordersRouter.delete('/:id', deleteOrder)

export default ordersRouter;
