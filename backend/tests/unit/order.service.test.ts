import { describe, it, expect, vi, beforeEach } from 'vitest';
import prisma from '../../src/utils/prisma.js';
import { OrderService } from '../../src/services/order.service.js';

vi.mock('../../src/utils/prisma.js', () => ({
  default: {
    order: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    cartItem: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    product: {
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}));

describe('OrderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOrdersByUser', () => {
    it('should return orders for a user', async () => {
      const mockOrders = [{ id: '1', totalAmount: 100 }];
      vi.mocked(prisma.order.findMany).mockResolvedValue(mockOrders as any);

      const result = await OrderService.getOrdersByUser('user1');

      expect(result).toEqual(mockOrders);
      expect(prisma.order.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId: 'user1' },
      }));
    });
  });

  describe('getOrderById', () => {
    it('should return an order if it belongs to the user', async () => {
      const mockOrder = { id: '1', userId: 'user1' };
      vi.mocked(prisma.order.findUnique).mockResolvedValue(mockOrder as any);

      const result = await OrderService.getOrderById('user1', '1');

      expect(result).toEqual(mockOrder);
      expect(prisma.order.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: '1' },
      }));
    });

    it('should throw an error if order is not found', async () => {
      vi.mocked(prisma.order.findUnique).mockResolvedValue(null);

      await expect(OrderService.getOrderById('user1', '1')).rejects.toThrow('Order not found');
    });

    it('should throw an error if order belongs to a different user', async () => {
      const mockOrder = { id: '1', userId: 'user2' };
      vi.mocked(prisma.order.findUnique).mockResolvedValue(mockOrder as any);

      await expect(OrderService.getOrderById('user1', '1')).rejects.toThrow('Order not found');
    });
  });

  describe('createOrderFromCart', () => {
    it('should create an order from cart items', async () => {
      const mockCartItems = [
        { productId: 'prod1', quantity: 2, product: { price: 10, stock: 5 } }
      ];
      vi.mocked(prisma.cartItem.findMany).mockResolvedValue(mockCartItems as any);
      
      const mockOrder = { id: 'order1' };
      vi.mocked(prisma.order.create).mockResolvedValue(mockOrder as any);

      const result = await OrderService.createOrderFromCart('user1');

      expect(result).toEqual(mockOrder);
      expect(prisma.order.create).toHaveBeenCalled();
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'prod1' },
        data: { stock: { decrement: 2 } },
      });
      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { userId: 'user1' } });
    });

    it('should throw an error if cart is empty', async () => {
      vi.mocked(prisma.cartItem.findMany).mockResolvedValue([]);

      await expect(OrderService.createOrderFromCart('user1')).rejects.toThrow('Cart is empty');
    });

    it('should throw an error if insufficient stock', async () => {
      const mockCartItems = [
        { productId: 'prod1', quantity: 10, product: { name: 'Prod 1', price: 10, stock: 5 } }
      ];
      vi.mocked(prisma.cartItem.findMany).mockResolvedValue(mockCartItems as any);

      await expect(OrderService.createOrderFromCart('user1')).rejects.toThrow('Insufficient stock for product: Prod 1');
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders', async () => {
      const mockOrders = [{ id: '1' }];
      vi.mocked(prisma.order.findMany).mockResolvedValue(mockOrders as any);

      const result = await OrderService.getAllOrders();

      expect(result).toEqual(mockOrders);
      expect(prisma.order.findMany).toHaveBeenCalled();
    });
  });

  describe('updateOrderStatus', () => {
    it('should update an order status', async () => {
      const mockOrder = { id: '1', status: 'SHIPPED' };
      vi.mocked(prisma.order.update).mockResolvedValue(mockOrder as any);

      const result = await OrderService.updateOrderStatus('1', 'SHIPPED');

      expect(result).toEqual(mockOrder);
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'SHIPPED' },
      });
    });
  });
});
