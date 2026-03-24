import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successResponse } from '../../utils/apiResponse';
import * as categoriesService from './categories.service';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoriesService.getCategories();
  res.json(successResponse(categories));
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoriesService.getCategoryBySlug(req.params.slug);
  res.json(successResponse(category));
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoriesService.createCategory(req.body);
  res.status(201).json(successResponse(category, 'Category created'));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoriesService.updateCategory(req.params.id, req.body);
  res.json(successResponse(category, 'Category updated'));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoriesService.deleteCategory(req.params.id);
  res.json(successResponse(null, 'Category deleted'));
});