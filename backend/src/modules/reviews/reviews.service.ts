import prisma from '../../config/db';

export const getProductReviews = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return reviews;
};

export const createReview = async (userId: string, productId: string, data: {
  rating: number;
  comment?: string;
}) => {
  // Check if product exists
  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  // Check if user already reviewed
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existingReview) {
    throw new Error('You have already reviewed this product');
  }

  // Check if user has purchased the product
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: 'DELIVERED',
      },
    },
  });

  if (!hasPurchased) {
    throw new Error('You can only review products you have purchased');
  }

  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });

  return review;
};

export const deleteReview = async (reviewId: string, userId: string, isAdmin: boolean) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error('Review not found');
  }

  if (review.userId !== userId && !isAdmin) {
    throw new Error('Not authorized to delete this review');
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });
};