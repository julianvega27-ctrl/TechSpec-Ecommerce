import type { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const CategoryController = {
  getAllCategories: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json({ data: categories });
  }),

  getCategoryById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const category = await CategoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ data: category });
  }),
};
