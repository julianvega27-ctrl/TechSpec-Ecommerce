import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '../../src/utils/prisma.js';
import { CartService } from '../../src/services/cart.service.js';

vi.mock('../../src/utils/prisma.js', () => ({
  default: {
    cartItem: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

describe('CartService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return a user cart', async () => {
      const mockCart = [{ id: '1', quantity: 2 }];
      vi.mocked(prisma.cartItem.findMany).mockResolvedValue(mockCart as any);

      const result = await CartService.getCart('user1');

      expect(result).toEqual(mockCart);
      expect(prisma.cartItem.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId: 'user1', product: { isActive: true } },
      }));
    });
  });

  describe('addToCart', () => {
    it('should update quantity if item already exists in cart', async () => {
      const existingItem = { id: 'item1', quantity: 1 };
      const updatedItem = { id: 'item1', quantity: 3 };
      vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(existingItem as any);
      vi.mocked(prisma.cartItem.update).mockResolvedValue(updatedItem as any);

      const result = await CartService.addToCart('user1', 'prod1', 2);

      expect(result).toEqual(updatedItem);
      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item1' },
        data: { quantity: 3 },
        include: { product: true },
      });
    });

    it('should create new cart item if it does not exist', async () => {
      vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(null);
      const newItem = { id: 'item1', quantity: 2 };
      vi.mocked(prisma.cartItem.create).mockResolvedValue(newItem as any);

      const result = await CartService.addToCart('user1', 'prod1', 2);

      expect(result).toEqual(newItem);
      expect(prisma.cartItem.create).toHaveBeenCalledWith({
        data: { userId: 'user1', productId: 'prod1', quantity: 2 },
        include: { product: true },
      });
    });
  });

  describe('updateQuantity', () => {
    it('should delete the item if quantity is <= 0', async () => {
      const existingItem = { id: 'item1' };
      vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(existingItem as any);
      vi.mocked(prisma.cartItem.delete).mockResolvedValue(existingItem as any);

      const result = await CartService.updateQuantity('user1', 'item1', 0);

      expect(result).toEqual(existingItem);
      expect(prisma.cartItem.delete).toHaveBeenCalledWith({ where: { id: 'item1' } });
    });

    it('should update quantity if > 0', async () => {
      const existingItem = { id: 'item1' };
      const updatedItem = { id: 'item1', quantity: 5 };
      vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(existingItem as any);
      vi.mocked(prisma.cartItem.update).mockResolvedValue(updatedItem as any);

      const result = await CartService.updateQuantity('user1', 'item1', 5);

      expect(result).toEqual(updatedItem);
      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item1' },
        data: { quantity: 5 },
        include: { product: true },
      });
    });

    it('should throw an error if item does not exist', async () => {
      vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(null);

      await expect(CartService.updateQuantity('user1', 'item1', 5)).rejects.toThrow('Cart item not found');
    });
  });

  describe('removeFromCart', () => {
    it('should delete an item', async () => {
      const existingItem = { id: 'item1' };
      vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(existingItem as any);
      vi.mocked(prisma.cartItem.delete).mockResolvedValue(existingItem as any);

      const result = await CartService.removeFromCart('user1', 'item1');

      expect(result).toEqual(existingItem);
      expect(prisma.cartItem.delete).toHaveBeenCalledWith({ where: { id: 'item1' } });
    });

    it('should throw an error if item does not exist', async () => {
      vi.mocked(prisma.cartItem.findFirst).mockResolvedValue(null);

      await expect(CartService.removeFromCart('user1', 'item1')).rejects.toThrow('Cart item not found');
    });
  });

  describe('clearCart', () => {
    it('should delete all cart items for a user', async () => {
      vi.mocked(prisma.cartItem.deleteMany).mockResolvedValue({ count: 2 } as any);

      const result = await CartService.clearCart('user1');

      expect(result).toEqual({ count: 2 });
      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user1' } });
    });
  });
});
