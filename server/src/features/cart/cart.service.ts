import { prisma } from "../../config/db";
import { storefrontProductWhere } from "../product/product.visibility";

const cartInclude = {
  items: {
    include: { product: true },
    orderBy: { id: "asc" as const },
  },
};

export const getOrCreateCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: cartInclude,
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: cartInclude,
    });
  }
  return cart;
};

const assertProductCanBePurchased = async (productId: string, quantity: number) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, ...storefrontProductWhere },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock <= 0) {
    throw new Error(`${product.title} is out of stock`);
  }

  if (quantity > product.stock) {
    throw new Error(`Only ${product.stock} unit(s) available for ${product.title}`);
  }

  return product;
};

export const incrementCartItem = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  const cart = await getOrCreateCart(userId);
  await assertProductCanBePurchased(productId, quantity);

  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existing) {
    const nextQuantity = existing.quantity + quantity;
    await assertProductCanBePurchased(productId, nextQuantity);

    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: nextQuantity },
      include: { product: true },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
    include: { product: true },
  });
};

export const getCart = async (userId: string) => {
  return getOrCreateCart(userId);
};

export const setCartItemQuantity = async (
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

  if (quantity === 0) {
    if (!existing) return null;
    await prisma.cartItem.delete({ where: { id: existing.id } });
    return null;
  }

  await assertProductCanBePurchased(productId, quantity);

  if (!existing) {
    return prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity },
      include: { product: true },
    });
  }

  return prisma.cartItem.update({
    where: { id: existing.id },
    data: { quantity },
    include: { product: true },
  });
};

export const decrementCartItem = async (userId: string, productId: string) => {
  const cart = await getOrCreateCart(userId);
  const existing = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (!existing) return null;

  const nextQuantity = existing.quantity - 1;
  if (nextQuantity <= 0) {
    await prisma.cartItem.delete({ where: { id: existing.id } });
    return null;
  }

  return prisma.cartItem.update({
    where: { id: existing.id },
    data: { quantity: nextQuantity },
    include: { product: true },
  });
};

export const removeItem = async (userId: string, productId: string) => {
  const cart = await getOrCreateCart(userId);

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      productId,
    },
  });
};
