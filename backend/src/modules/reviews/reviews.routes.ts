import { Router } from 'express';
import { verifyToken, requireAdmin } from '../../middlewares/auth';
import * as reviewsController from './reviews.controller';

const router = Router();

router.get('/products/:productId/reviews', reviewsController.getProductReviews);
router.post('/products/:productId/reviews', verifyToken, reviewsController.createReview);
router.delete('/reviews/:id', verifyToken, reviewsController.deleteReview);

export default router;