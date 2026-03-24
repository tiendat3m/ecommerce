import { Router } from 'express';
import { verifyToken, requireAdmin } from '../../middlewares/auth';
import * as categoriesController from './categories.controller';

const router = Router();

router.get('/', categoriesController.getCategories);
router.get('/:slug', categoriesController.getCategoryBySlug);

router.post('/', verifyToken, requireAdmin, categoriesController.createCategory);
router.put('/:id', verifyToken, requireAdmin, categoriesController.updateCategory);
router.delete('/:id', verifyToken, requireAdmin, categoriesController.deleteCategory);

export default router;