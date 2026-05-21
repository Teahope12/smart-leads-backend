import { Router } from 'express';
import { AuthController } from './auth.controller';
import { registerValidator, loginValidator } from './auth.validators';
import { authMiddleware } from '../../shared/middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

router.get('/test', (req, res) => {
  res.json({ message: 'Auth router is working!' });
});
router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.get('/me', authMiddleware, authController.getMe);

export const authRoutes = router;
