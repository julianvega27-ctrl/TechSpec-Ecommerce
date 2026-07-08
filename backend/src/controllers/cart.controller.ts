import type { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const CartController = {
  getCart: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const cartItems = await CartService.getCart(userId);
    res.status(200).json({ data: cartItems });
  }),

  addToCart: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const cartItem = await CartService.addToCart(userId, productId, quantity);
    res.status(201).json({ data: cartItem });
  }),

  updateQuantity: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ message: 'Quantity is required' });
    }

    try {
      const cartItem = await CartService.updateQuantity(userId, id as string, quantity);
      res.status(200).json({ data: cartItem });
    } catch (error: any) {
      if (error.message === 'Cart item not found') {
        return res.status(404).json({ message: error.message });
      }
      throw error;
    }
  }),

  removeFromCart: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    const { id } = req.params;
    try {
      await CartService.removeFromCart(userId, id as string);
      res.status(200).json({ message: 'Item removed from cart' });
    } catch (error: any) {
      if (error.message === 'Cart item not found') {
        return res.status(404).json({ message: error.message });
      }
      throw error;
    }
  }),

  clearCart: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.id;

    await CartService.clearCart(userId);
    res.status(200).json({ message: 'Cart cleared' });
  }),
};
