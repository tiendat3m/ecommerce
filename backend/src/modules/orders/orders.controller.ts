import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { successResponse } from '../../utils/apiResponse';
import * as ordersService from './orders.service';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await ordersService.createOrder(req.user!.id, req.body);
  res.status(201).json(successResponse(order, 'Order created'));
});

export const getUserOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await ordersService.getUserOrders(
    req.user!.id,
    req.query.page as string,
    req.query.limit as string
  );
  res.json(successResponse(result.data, undefined, result.meta));
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await ordersService.getOrderById(req.params.id, req.user!.id);
  res.json(successResponse(order));
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await ordersService.getAllOrders(
    req.query.page as string,
    req.query.limit as string,
    req.query.status as any
  );
  res.json(successResponse(result.data, undefined, result.meta));
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await ordersService.updateOrderStatus(req.params.id, req.body.status);
  res.json(successResponse(order, 'Order status updated'));
});