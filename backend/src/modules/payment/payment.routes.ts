import { Router } from 'express';
import { verifyToken, requireAdmin } from '../../middlewares/auth';
import * as paymentController from './payment.controller';

const router = Router();

router.post('/create-intent', verifyToken, paymentController.createPaymentIntent);
router.post('/webhook', paymentController.handleWebhook);
router.post('/refund', verifyToken, requireAdmin, paymentController.refundPayment);

export default router;