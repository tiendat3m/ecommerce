import prisma from '../../config/db';

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  return categories.map((cat) => ({
    ...cat,
    productCount: cat._count.products,
    _count: undefined,
  }));
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
      },
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  const productsWithRating = category.products.map((product) => {
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
    ...category,
    products: productsWithRating,
  };
};

export const createCategory = async (data: { name: string; image?: string }) => {
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const existingCategory = await prisma.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    throw new Error('Category with this name already exists');
  }

  const category = await prisma.category.create({
    data: { ...data, slug },
  });

  return category;
};

export const updateCategory = async (id: string, data: { name?: string; image?: string }) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  let slug = category.slug;
  if (data.name) {
    slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existingCategory = await prisma.category.findFirst({
      where: { slug, id: { not: id } },
    });

    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { ...data, slug },
  });

  return updatedCategory;
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  if (category._count.products > 0) {
    throw new Error('Cannot delete category with products');
  }

  await prisma.category.delete({
    where: { id },
  });
};