import type { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const ProductController = {
  getProducts: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const categoryId = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const sort = req.query.sort as string | undefined;

    const result = await ProductService.getProducts({ page, limit, categoryId, search, sort });
    res.status(200).json({ data: result });
  }),

  getProductById: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const product = await ProductService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ data: product });
  }),
};
