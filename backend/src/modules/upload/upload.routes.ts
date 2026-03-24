import { Router } from 'express';
import { verifyToken, requireAdmin } from '../../middlewares/auth';
import { uploadSingle, uploadMultiple } from '../../middlewares/upload';
import * as uploadController from './upload.controller';

const router = Router();

router.post('/image', verifyToken, requireAdmin, uploadSingle, uploadController.uploadImage);
router.post('/images', verifyToken, requireAdmin, uploadMultiple, uploadController.uploadMultipleImages);

export default router;