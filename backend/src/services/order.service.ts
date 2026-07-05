import prisma from '../utils/prisma.js';

export const OrderService = {
  async getOrdersByUser(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  async getOrderById(userId: string, orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order || order.userId !== userId) {
      throw new Error('Order not found');
    }
    return order;
  },

  async createOrderFromCart(userId: string) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    let subtotal = 0;
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${item.product.name}`);
      }
      subtotal += Number(item.product.price) * item.quantity;
    }
    
    const tax = subtotal * 0.18;
    const totalAmount = subtotal + tax;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          orderItems: {
            create: cartItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            }
          }
        },
      });

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return newOrder;
    });

    return order;
  },

  async getAllOrders() {
    return await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        orderItems: { include: { product: true } }
      }
    });
  },

  async updateOrderStatus(id: string, status: any) {
    return await prisma.order.update({
      where: { id },
      data: { status }
    });
  }
};
