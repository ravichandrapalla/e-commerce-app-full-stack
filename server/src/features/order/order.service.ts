import { prisma } from "../../config/db";

export const checkout = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const totalAmount = cart.items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  const result = await prisma.$transaction(async (tx) => {
    // stock validation
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new Error(`${item.product.title} out of stock`);
      }
    }

    // create order
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // reduce stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // clear cart
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return order;
  });

  return result;
};

export const getOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
