import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middlewares/auth.js';
import { OrderService } from '../services/order.service.js';

export const OrderController = {
  async getMyOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'No autenticado' });
      }

      const orders = await OrderService.getOrdersByUser(userId);
      res.json({ data: orders });
    } catch (error) {
      next(error);
    }
  },

  async getMyOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'No autenticado' });
      }

      const { id } = req.params;
      if (typeof id !== 'string') {
        return res.status(400).json({ message: 'ID de pedido inválido' });
      }
      const order = await OrderService.getOrderById(userId, id);
      res.json({ data: order });
    } catch (error) {
      if (error instanceof Error && error.message === 'Order not found') {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      next(error);
    }
  },

  async checkout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'No autenticado' });
      }

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
      next(error);
    }
  }
};
