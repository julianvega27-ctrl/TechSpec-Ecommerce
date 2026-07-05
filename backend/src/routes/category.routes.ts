import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);

export default router;
