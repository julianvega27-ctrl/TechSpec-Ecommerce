import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middlewares/auth.js';
import { OrderService } from '../services/order.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const OrderController = {
  getMyOrders: catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    const orders = await OrderService.getOrdersByUser(userId);
    res.json({ data: orders });
  }),

  getMyOrderById: catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    const { id } = req.params;
    if (typeof id !== 'string') {
      return res.status(400).json({ message: 'ID de pedido inválido' });
    }
    
    try {
      const order = await OrderService.getOrderById(userId, id);
      res.json({ data: order });
    } catch (error) {
      if (error instanceof Error && error.message === 'Order not found') {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      throw error;
    }
  }),

  checkout: catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    try {
      const order = await OrderService.createOrderFromCart(userId);
      res.status(201).json({ data: order });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Cart is empty') {
          return res.status(400).json({ message: 'El carrito está vacío' });
        }
        if (error.message.startsWith('Insufficient stock')) {
          return res.status(400).json({ message: error.message });
        }
      }
      throw error;
    }
  })
};
