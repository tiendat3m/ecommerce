import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successResponse } from '../../utils/apiResponse';
import * as reviewsService from './reviews.service';

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await reviewsService.getProductReviews(req.params.productId);
  res.json(successResponse(reviews));
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewsService.createReview(
    req.user!.id,
    req.params.productId,
    req.body
  );
  res.status(201).json(successResponse(review, 'Review created'));
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  await reviewsService.deleteReview(req.params.id, req.user!.id, req.user!.role === 'ADMIN');
  res.json(successResponse(null, 'Review deleted'));
});