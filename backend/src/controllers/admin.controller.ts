import type { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { UserService } from '../services/user.service.js';
import { ProductService } from '../services/product.service.js';
import { CategoryService } from '../services/category.service.js';
import { OrderService } from '../services/order.service.js';
import cloudinary from '../utils/cloudinary.js';

export const AdminController = {
  async getSettings(req: Request, res: Response) {
    try {
      const section = req.params.section as string;
      const settings = await AdminService.getSiteSettings(section);
      if (!settings) {
        return res.status(404).json({ error: 'Settings section not found' });
      }
      return res.status(200).json({ data: settings });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error fetching settings' });
    }
  },

  async updateSettings(req: Request, res: Response) {
    try {
      const section = req.params.section as string;
      const updated = await AdminService.updateSiteSettings(section, req.body);
      return res.status(200).json({ data: updated });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error updating settings' });
    }
  },

  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await AdminService.getDashboardStats();
      return res.status(200).json({ data: stats });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error fetching dashboard stats' });
    }
  },

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error fetching users' });
    }
  },

  async updateUserRole(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const updatedUser = await UserService.updateUser(id, req.body);
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error updating user' });
    }
  },

  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await OrderService.getAllOrders();
      return res.status(200).json(orders);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error fetching orders' });
    }
  },

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const order = await OrderService.updateOrderStatus(id, status);
      return res.status(200).json(order);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error updating order' });
    }
  },

  async getAllProducts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const categoryId = req.query.category as string;
      const result = await ProductService.getProductsAdmin({ page, limit, search, categoryId });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error fetching products' });
    }
  },

  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategoriesAdmin();
      return res.status(200).json(categories);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error fetching categories' });
    }
  },

  async createProduct(req: Request, res: Response) {
    try {
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
        return res.status(400).json({ error: 'La imagen del producto es requerida' });
      }

      // Upload to cloudinary
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = "data:" + file.mimetype + ";base64," + b64;
          const uploadResult = await cloudinary.uploader.upload(dataURI, {
            folder: 'techspec_products'
          });
          return { url: uploadResult.secure_url, publicId: uploadResult.public_id };
        })
      );
      
      if (uploadedImages.length > 0) {
        const firstImage = uploadedImages[0];
        if (firstImage) {
          data.imageUrl = firstImage.url;
          data.imagePublicId = firstImage.publicId;
          data.images = uploadedImages.slice(1); // Store remaining images in the json array
        }
      }

      const product = await ProductService.createProduct(data);
      return res.status(201).json(product);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error creating product' });
    }
  },

  async updateProduct(req: Request, res: Response) {
    try {
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
        const uploadedImages = await Promise.all(
          files.map(async (file) => {
            const b64 = Buffer.from(file.buffer).toString('base64');
            const dataURI = "data:" + file.mimetype + ";base64," + b64;
            const uploadResult = await cloudinary.uploader.upload(dataURI, {
              folder: 'techspec_products'
            });
            return { url: uploadResult.secure_url, publicId: uploadResult.public_id };
          })
        );
        const firstImage = uploadedImages[0];
        if (firstImage) {
          data.imageUrl = firstImage.url;
          data.imagePublicId = firstImage.publicId;
          data.images = uploadedImages.slice(1);
        }
      }

      const product = await ProductService.updateProduct(id, data);
      return res.status(200).json(product);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error updating product' });
    }
  },

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await ProductService.deleteProduct(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Error deleting product' });
    }
  },

  async createCategory(req: Request, res: Response) {
    try {
      const category = await CategoryService.createCategory(req.body);
      return res.status(201).json(category);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
      }
      return res.status(500).json({ error: error.message || 'Error creating category' });
    }
  },

  async updateCategory(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const category = await CategoryService.updateCategory(id, req.body);
      return res.status(200).json(category);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
      }
      return res.status(500).json({ error: error.message || 'Error updating category' });
    }
  },

  async deleteCategory(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await CategoryService.deleteCategory(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Error deleting category' });
    }
  }
};
