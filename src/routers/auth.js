import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../validation/auth.js';
import { loginSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerController } from '../controllers/auth.js';
import { loginController } from '../controllers/auth.js';
import { refreshController } from '../controllers/auth.js';
import { logoutController } from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutController));

export default router;
