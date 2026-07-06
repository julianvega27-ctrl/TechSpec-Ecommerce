import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// Protect all user routes
router.use(requireAuth);

router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.put('/password', UserController.updatePassword);

export default router;
