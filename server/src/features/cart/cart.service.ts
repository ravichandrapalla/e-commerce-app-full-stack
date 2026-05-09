import { prisma } from "../../config/db";

export const getOrCreateCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }
  return cart;
};

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  const cart = await getOrCreateCart(userId);

  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};

export const getCart = async (userId: string) => {
  return getOrCreateCart(userId);
};

export const updateQuantity = async (itemId: string, quantity: number) => {
  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
};

export const removeItem = async (itemId: string) => {
  return prisma.cartItem.delete({
    where: { id: itemId },
  });
};
