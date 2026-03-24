import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { verifyToken } from '../../middlewares/auth';
import * as authController from './auth.controller';
import { registerSchema, loginSchema } from './auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/me', verifyToken, authController.getMe);
router.post('/logout', verifyToken, authController.logout);

export default router;