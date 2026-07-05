import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// All order routes require authentication
router.use(requireAuth);

router.post('/checkout', OrderController.checkout);
router.get('/my-orders', OrderController.getMyOrders);
router.get('/my-orders/:id', OrderController.getMyOrderById);

export default router;
