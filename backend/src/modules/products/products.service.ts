import prisma from '../../config/db';
import { getPagination, getPaginationMeta, PaginationParams } from '../../utils/pagination';
import { ProductFilter } from '../../types';

export const getProducts = async (filters: ProductFilter & PaginationParams) => {
  const { page, limit, skip } = getPagination(filters.page, filters.limit);
  
  const where: any = {
    isActive: true,
  };

  if (filters.category) {
    where.category = { slug: filters.category };
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = parseFloat(String(filters.minPrice));
    if (filters.maxPrice) where.price.lte = parseFloat(String(filters.maxPrice));
  }

  if (filters.featured === true || filters.featured === false) {
    where.featured = filters.featured;
  }

  let orderBy: any = { createdAt: 'desc' };
  if (filters.sort === 'price_asc') orderBy = { price: 'asc' };
  if (filters.sort === 'price_desc') orderBy = { price: 'desc' };
  if (filters.sort === 'name') orderBy = { name: 'asc' };
  if (filters.sort === 'newest') orderBy = { createdAt: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const productsWithRating = products.map((product) => {
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;
    
    return {
      ...product,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
      reviews: undefined,
    };
  });

  return {
    data: productsWithRating,
    meta: getPaginationMeta(page, limit, total),
  };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  return {
    ...product,
    avgRating: Math.round(avgRating * 10) / 10,
    reviewCount: product.reviews.length,
  };
};

export const createProduct = async (data: any) => {
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const existingProduct = await prisma.product.findUnique({
    where: { slug },
  });

  if (existingProduct) {
    throw new Error('Product with this name already exists');
  }

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
    },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return product;
};

export const updateProduct = async (id: string, data: any) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  let slug = product.slug;
  if (data.name) {
    slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existingProduct = await prisma.product.findFirst({
      where: { slug, id: { not: id } },
    });

    if (existingProduct) {
      throw new Error('Product with this name already exists');
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { ...data, slug },
    include: {
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return updatedProduct;
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
};