import prisma from '../../config/db';
import { getPagination, getPaginationMeta } from '../../utils/pagination';
import { OrderStatus } from '@prisma/client';

export const createOrder = async (userId: string, data: {
  items: { productId: string; quantity: number }[];
  shippingAddress: any;
  note?: string;
}) => {
  // Get products and validate stock
  const productIds = data.items.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  if (products.length !== productIds.length) {
    throw new Error('Some products not found');
  }

  // Calculate total and check stock
  let total = 0;
  const orderItems: any[] = [];

  for (const item of data.items) {
    const product = products.find(p => p.id === item.productId)!;
    
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    total += product.price * item.quantity;
    orderItems.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
      snapshot: {
        name: product.name,
        image: product.images[0] || '',
      },
    });
  }

  // Create order and update stock
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        userId,
        total,
        shippingAddress: data.shippingAddress,
        note: data.note,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, images: true },
            },
          },
        },
      },
    });

    // Update stock
    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return newOrder;
  });

  return order;
};

export const getUserOrders = async (userId: string, page?: string, limit?: string) => {
  const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, images: true },
            },
          },
        },
      },
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return {
    data: orders,
    meta: getPaginationMeta(pageNum, limitNum, total),
  };
};

export const getOrderById = async (orderId: string, userId?: string) => {
  const where: any = { id: orderId };
  if (userId) where.userId = userId;

  const order = await prisma.order.findFirst({
    where,
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, images: true },
          },
        },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  return order;
};

export const getAllOrders = async (page?: string, limit?: string, status?: OrderStatus) => {
  const { page: pageNum, limit: limitNum, skip } = getPagination(page, limit);
  
  const where: any = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, images: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data: orders,
    meta: getPaginationMeta(pageNum, limitNum, total),
  };
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // If cancelling, restore stock
  if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
    });

    await prisma.$transaction(async (tx) => {
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status },
      });
    });
  } else {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  return getOrderById(orderId);
};