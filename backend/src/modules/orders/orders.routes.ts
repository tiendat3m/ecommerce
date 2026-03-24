import { Router } from 'express';
import { verifyToken, requireAdmin } from '../../middlewares/auth';
import * as ordersController from './orders.controller';

const router = Router();

router.post('/', verifyToken, ordersController.createOrder);
router.get('/', verifyToken, ordersController.getUserOrders);
router.get('/admin', verifyToken, requireAdmin, ordersController.getAllOrders);
router.get('/:id', verifyToken, ordersController.getOrderById);
router.put('/admin/:id/status', verifyToken, requireAdmin, ordersController.updateOrderStatus);

export default router;