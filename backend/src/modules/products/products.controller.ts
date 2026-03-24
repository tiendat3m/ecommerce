import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successResponse } from '../../utils/apiResponse';
import * as productsService from './products.service';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await productsService.getProducts(req.query as any);
  res.json(successResponse(result.data, undefined, result.meta));
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const product = await productsService.getProductBySlug(req.params.slug);
  res.json(successResponse(product));
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productsService.createProduct(req.body);
  res.status(201).json(successResponse(product, 'Product created'));
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productsService.updateProduct(req.params.id, req.body);
  res.json(successResponse(product, 'Product updated'));
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productsService.deleteProduct(req.params.id);
  res.json(successResponse(null, 'Product deleted'));
});