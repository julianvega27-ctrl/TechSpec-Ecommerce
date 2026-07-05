import type { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service.js';

export const CartController = {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const cartItems = await CartService.getCart(userId);
      res.status(200).json(cartItems);
    } catch (error) {
      next(error);
    }
  },

  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { productId, quantity = 1 } = req.body;
      if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
      }

      const cartItem = await CartService.addToCart(userId, productId, quantity);
      res.status(200).json(cartItem);
    } catch (error) {
      next(error);
    }
  },

  async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { id } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined) {
        return res.status(400).json({ message: 'Quantity is required' });
      }

      const cartItem = await CartService.updateQuantity(userId, id, quantity);
      res.status(200).json(cartItem);
    } catch (error: any) {
      if (error.message === 'Cart item not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },

  async removeFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { id } = req.params;
      await CartService.removeFromCart(userId, id);
      res.status(200).json({ message: 'Item removed from cart' });
    } catch (error: any) {
      if (error.message === 'Cart item not found') {
        return res.status(404).json({ message: error.message });
      }
      next(error);
    }
  },

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await CartService.clearCart(userId);
      res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
      next(error);
    }
  },
};
