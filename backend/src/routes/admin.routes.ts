import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';

const router = Router();

// Secure all admin routes
router.use(requireAuth);
router.use(requireAdmin);

// Dashboard / Analytics
router.get('/dashboard', AdminController.getDashboardStats);

// Users
router.get('/users', AdminController.getAllUsers);
router.put('/users/:id/role', AdminController.updateUserRole);

// Orders
router.get('/orders', AdminController.getAllOrders);
router.put('/orders/:id/status', AdminController.updateOrderStatus);

// Products
router.post('/products', AdminController.createProduct);
router.put('/products/:id', AdminController.updateProduct);
router.delete('/products/:id', AdminController.deleteProduct);

// Categories
router.post('/categories', AdminController.createCategory);
router.put('/categories/:id', AdminController.updateCategory);
router.delete('/categories/:id', AdminController.deleteCategory);

export default router;
