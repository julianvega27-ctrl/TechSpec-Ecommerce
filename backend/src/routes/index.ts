import { Router } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Import and use routes (to be implemented in subsequent user stories)
// import authRoutes from './auth.routes';
// import userRoutes from './user.routes';
// import productRoutes from './product.routes';
// import categoryRoutes from './category.routes';
// import cartRoutes from './cart.routes';
// import orderRoutes from './order.routes';
// import adminRoutes from './admin.routes';

// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/cart', cartRoutes);
// router.use('/orders', orderRoutes);
// router.use('/admin', adminRoutes);

export default router;
