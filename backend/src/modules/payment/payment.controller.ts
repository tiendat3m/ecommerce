import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successResponse } from '../../utils/apiResponse';
import * as paymentService from './payment.service';

export const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.createPaymentIntent(req.body.orderId, req.user!.id);
  res.json(successResponse(result, 'Payment intent created'));
});

export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  await paymentService.handleWebhook(req.body, signature);
  res.json({ received: true });
});

export const refundPayment = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentService.refundPayment(req.body.orderId);
  res.json(successResponse(result, 'Refund processed'));
});