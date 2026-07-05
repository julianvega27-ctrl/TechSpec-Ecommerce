import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// All cart routes require authentication
router.use(requireAuth);

router.get('/', CartController.getCart);
router.post('/', CartController.addToCart);
router.delete('/', CartController.clearCart);
router.put('/:id', CartController.updateQuantity);
router.delete('/:id', CartController.removeFromCart);

export default router;
