import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { verifyToken, requireAdmin } from '../../middlewares/auth';
import * as productsController from './products.controller';
import { createProductSchema, updateProductSchema, productFilterSchema } from './products.schema';

const router = Router();

router.get('/', validate(productFilterSchema), productsController.getProducts);
router.get('/:slug', productsController.getProductBySlug);

router.post('/', verifyToken, requireAdmin, validate(createProductSchema), productsController.createProduct);
router.put('/:id', verifyToken, requireAdmin, validate(updateProductSchema), productsController.updateProduct);
router.delete('/:id', verifyToken, requireAdmin, productsController.deleteProduct);

export default router;