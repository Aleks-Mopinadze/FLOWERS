import {Router} from "express";
import {deleteOrder, getOrder, createOrder, getOrders, updateOrder} from "../controllers/order.controllers";
import {authenticate} from "../middlewares/auth.middleware";

const ordersRouter = Router();
ordersRouter.get('/', authenticate, getOrders)
ordersRouter.get('/:id', authenticate,  getOrder)
ordersRouter.post('/', authenticate, createOrder)
ordersRouter.put('/:id', authenticate, updateOrder)
ordersRouter.delete('/:id', authenticate, deleteOrder)

export default ordersRouter;
