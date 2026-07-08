import type { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import { UserService } from '../services/user.service.js';
import { ProductService } from '../services/product.service.js';
import { CategoryService } from '../services/category.service.js';
import { OrderService } from '../services/order.service.js';
import { UploadService } from '../services/upload.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../middlewares/error.js';

export const AdminController = {
  getSettings: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const section = req.params.section as string;
    const settings = await AdminService.getSiteSettings(section);
    if (!settings) {
      throw new AppError('Settings section not found', 404);
    }
    res.status(200).json({ data: settings });
  }),

  updateSettings: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const section = req.params.section as string;
    const updated = await AdminService.updateSiteSettings(section, req.body);
    res.status(200).json({ data: updated });
  }),

  getDashboardStats: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await AdminService.getDashboardStats();
    res.status(200).json({ data: stats });
  }),

  getAllUsers: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  }),

  updateUserRole: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const updatedUser = await UserService.updateUser(id, req.body);
    res.status(200).json(updatedUser);
  }),

  getAllOrders: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const orders = await OrderService.getAllOrders();
    res.status(200).json(orders);
  }),

  updateOrderStatus: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const { status } = req.body;
    const order = await OrderService.updateOrderStatus(id, status);
    res.status(200).json(order);
  }),

  getAllProducts: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const categoryId = req.query.category as string;
    const result = await ProductService.getProductsAdmin({ page, limit, search, categoryId });
    res.status(200).json(result);
  }),

  getAllCategories: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const categories = await CategoryService.getAllCategoriesAdmin();
    res.status(200).json(categories);
  }),

  createProduct: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body };
    
    // Parse numeric/boolean fields
    if (data.price) data.price = parseFloat(data.price);
    if (data.stock) data.stock = parseInt(data.stock, 10);
    if (data.isActive !== undefined) data.isActive = data.isActive === 'true' || data.isActive === true;

    if (data.categoryId) {
      data.category = { connect: { id: data.categoryId } };
      delete data.categoryId;
    }

    if (data.specifications) {
      try {
        data.specifications = JSON.parse(data.specifications);
      } catch (e) {
        // ignore parsing error
      }
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new AppError('La imagen del producto es requerida', 400);
    }

    // Upload to cloudinary
    const uploadedImages = await UploadService.uploadImages(files, 'techspec_products');
    
    if (uploadedImages.length > 0) {
      const firstImage = uploadedImages[0];
      if (firstImage) {
        data.imageUrl = firstImage.url;
        data.imagePublicId = firstImage.publicId;
        data.images = uploadedImages.slice(1); // Store remaining images in the json array
      }
    }

    const product = await ProductService.createProduct(data);
    res.status(201).json(product);
  }),

  updateProduct: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const data = { ...req.body };
    
    if (data.price) data.price = parseFloat(data.price);
    if (data.stock) data.stock = parseInt(data.stock, 10);
    if (data.isActive !== undefined) data.isActive = data.isActive === 'true' || data.isActive === true;

    if (data.categoryId) {
      data.category = { connect: { id: data.categoryId } };
      delete data.categoryId;
    }

    if (data.specifications) {
      try {
        data.specifications = JSON.parse(data.specifications);
      } catch (e) {
        // ignore parsing error
      }
    }

    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      const uploadedImages = await UploadService.uploadImages(files, 'techspec_products');
      const firstImage = uploadedImages[0];
      if (firstImage) {
        data.imageUrl = firstImage.url;
        data.imagePublicId = firstImage.publicId;
        data.images = uploadedImages.slice(1);
      }
    }

    const product = await ProductService.updateProduct(id, data);
    res.status(200).json(product);
  }),

  deleteProduct: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    await ProductService.deleteProduct(id);
    res.status(204).send();
  }),

  createCategory: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new AppError('Ya existe una categoría con ese nombre', 400);
      }
      throw error;
    }
  }),

  updateCategory: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    try {
      const category = await CategoryService.updateCategory(id, req.body);
      res.status(200).json(category);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new AppError('Ya existe una categoría con ese nombre', 400);
      }
      throw error;
    }
  }),

  deleteCategory: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    try {
      await CategoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error: any) {
      throw new AppError(error.message || 'Error deleting category', 400);
    }
  })
};
