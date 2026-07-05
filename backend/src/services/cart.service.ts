import prisma from '../utils/prisma.js';

export const CartService = {
  async getCart(userId: string) {
    return await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        addedAt: 'desc',
      },
    });
  },

  async addToCart(userId: string, productId: string, quantity: number) {
    // Check if the item already exists in the cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingItem) {
      // Update quantity if it exists
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      });
    }

    // Otherwise create a new cart item
    return await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });
  },

  async updateQuantity(userId: string, cartItemId: string, quantity: number) {
    // First, verify the item belongs to the user
    const existingItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId },
    });

    if (!existingItem) {
      throw new Error('Cart item not found');
    }

    if (quantity <= 0) {
      return await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    }

    return await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: true,
      },
    });
  },

  async removeFromCart(userId: string, cartItemId: string) {
    // First, verify the item belongs to the user
    const existingItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId },
    });

    if (!existingItem) {
      throw new Error('Cart item not found');
    }

    return await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  },

  async clearCart(userId: string) {
    return await prisma.cartItem.deleteMany({
      where: { userId },
    });
  },
};
