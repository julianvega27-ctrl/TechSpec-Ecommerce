import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

// Public routes
router.get('/settings/:section', AdminController.getSettings);

// Secure all admin routes
router.use(requireAuth);
router.use(requireAdmin);

// Dashboard / Analytics
router.get('/dashboard', AdminController.getDashboardStats);

// Settings (Protected)
router.put('/settings/:section', AdminController.updateSettings);

// Users
router.get('/users', AdminController.getAllUsers);
router.put('/users/:id/role', AdminController.updateUserRole);

// Orders
router.get('/orders', AdminController.getAllOrders);
router.put('/orders/:id/status', AdminController.updateOrderStatus);

// Products
router.get('/products', AdminController.getAllProducts);
router.post('/products', upload.array('images', 5), AdminController.createProduct);
router.put('/products/:id', upload.array('images', 5), AdminController.updateProduct);
router.delete('/products/:id', AdminController.deleteProduct);

// Categories
router.get('/categories', AdminController.getAllCategories);
router.post('/categories', AdminController.createCategory);
router.put('/categories/:id', AdminController.updateCategory);
router.delete('/categories/:id', AdminController.deleteCategory);

export default router;
