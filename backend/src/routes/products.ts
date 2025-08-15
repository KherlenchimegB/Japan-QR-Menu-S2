import express, { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/Product';
import Category from '../models/Category';
import { body, param, query, validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Language validation
const validateLanguage = (lang: string): 'mn' | 'en' | 'zh' => {
  if (lang === 'en' || lang === 'zh') return lang;
  return 'mn'; // default to Mongolian
};

// GET /api/products - Get all products with pagination and filtering
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isMongoId(),
  query('search').optional().isString(),
  query('lang').optional().isIn(['mn', 'en', 'zh']),
  query('featured').optional().isBoolean(),
  query('sort').optional().isIn(['name', 'createdAt', 'updatedAt', 'sortOrder'])
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const lang = validateLanguage(req.query.lang as string);
    
    // Build query
    const query: any = { isActive: true, isPublished: true };
    
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query.$or = [
        { [`name.${lang}`]: searchRegex },
        { [`description.${lang}`]: searchRegex },
        { [`shortDescription.${lang}`]: searchRegex },
        { sku: searchRegex }
      ];
    }
    
    // Build sort
    let sort: any = { sortOrder: 1, createdAt: -1 };
    if (req.query.sort) {
      const sortField = req.query.sort as string;
      if (sortField === 'name') {
        sort = { [`name.${lang}`]: 1 };
      } else if (['createdAt', 'updatedAt', 'sortOrder'].includes(sortField)) {
        sort = { [sortField]: -1 };
      }
    }
    
    // Execute query
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// GET /api/products/featured - Get featured products
router.get('/featured', [
  query('limit').optional().isInt({ min: 1, max: 20 }),
  query('lang').optional().isIn(['mn', 'en', 'zh'])
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const lang = validateLanguage(req.query.lang as string);
    
    const products = await Product.find({
      isActive: true,
      isPublished: true,
      isFeatured: true
    })
      .populate('category', 'name slug')
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(limit)
      .lean();
    
    res.json({
      success: true,
      data: products
    });
    
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products'
    });
  }
});

// GET /api/products/categories/:categoryId - Get products by category
router.get('/categories/:categoryId', [
  param('categoryId').isMongoId(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('lang').optional().isIn(['mn', 'en', 'zh'])
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const lang = validateLanguage(req.query.lang as string);
    
    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const query = {
      isActive: true,
      isPublished: true,
      $or: [
        { category: categoryId },
        { subcategory: categoryId }
      ]
    };
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: {
        category,
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category'
    });
  }
});

// GET /api/products/search - Search products
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('lang').optional().isIn(['mn', 'en', 'zh']),
  query('category').optional().isMongoId(),
  query('limit').optional().isInt({ min: 1, max: 50 })
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;
    const lang = validateLanguage(req.query.lang as string);
    const limit = parseInt(req.query.limit as string) || 20;
    
    let query: any = {
      isActive: true,
      isPublished: true,
      $or: [
        { [`name.${lang}`]: { $regex: searchTerm, $options: 'i' } },
        { [`description.${lang}`]: { $regex: searchTerm, $options: 'i' } },
        { [`shortDescription.${lang}`]: { $regex: searchTerm, $options: 'i' } },
        { sku: { $regex: searchTerm, $options: 'i' } }
      ]
    };
    
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean();
    
    res.json({
      success: true,
      data: {
        searchTerm,
        results: products,
        count: products.length
      }
    });
    
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search products'
    });
  }
});

// GET /api/products/:id - Get single product by ID
router.get('/:id', [
  param('id').isMongoId(),
  query('lang').optional().isIn(['mn', 'en', 'zh'])
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lang = validateLanguage(req.query.lang as string);
    
    const product = await Product.findOne({
      _id: id,
      isActive: true,
      isPublished: true
    })
      .populate('category', 'name slug description')
      .populate('subcategory', 'name slug description')
      .lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// GET /api/products/slug/:slug - Get product by slug
router.get('/slug/:slug', [
  param('slug').notEmpty(),
  query('lang').optional().isIn(['mn', 'en', 'zh'])
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const lang = validateLanguage(req.query.lang as string);
    
    const query: any = { isActive: true, isPublished: true };
    query[`slug.${lang}`] = slug;
    
    const product = await Product.findOne(query)
      .populate('category', 'name slug description')
      .populate('subcategory', 'name slug description')
      .lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// GET /api/products/:id/emonos-redirect - Redirect to emonos.mn
router.get('/:id/emonos-redirect', [
  param('id').isMongoId()
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({
      _id: id,
      isActive: true,
      isPublished: true
    }).select('emonosUrl emonosId name').lean();
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Get emonos link from virtual or construct it
    const emonosLink = product.emonosUrl || 
      (product.emonosId ? `https://emonos.mn/products/${product.emonosId}` : null);
    
    if (!emonosLink) {
      return res.status(404).json({
        success: false,
        message: 'emonos.mn link not available for this product'
      });
    }
    
    // Redirect to emonos.mn
    res.redirect(302, emonosLink);
    
  } catch (error) {
    console.error('Error redirecting to emonos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to redirect to emonos.mn'
    });
  }
});

// Admin routes (would normally be protected by authentication middleware)

// POST /api/products - Create new product (Admin)
router.post('/', [
  body('name.mn').notEmpty().withMessage('Mongolian name is required'),
  body('name.en').notEmpty().withMessage('English name is required'),
  body('name.zh').notEmpty().withMessage('Chinese name is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('category').isMongoId().withMessage('Valid category ID is required')
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    
    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: productData.sku.toUpperCase() });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }
    
    // Validate category exists
    const category = await Category.findById(productData.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const product = new Product(productData);
    await product.save();
    
    await product.populate('category', 'name slug');
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
    
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

// PUT /api/products/:id - Update product (Admin)
router.put('/:id', [
  param('id').isMongoId(),
  body('name.mn').optional().notEmpty(),
  body('name.en').optional().notEmpty(),
  body('name.zh').optional().notEmpty(),
  body('sku').optional().notEmpty(),
  body('category').optional().isMongoId()
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If SKU is being updated, check for duplicates
    if (updateData.sku) {
      const existingProduct = await Product.findOne({ 
        sku: updateData.sku.toUpperCase(),
        _id: { $ne: id }
      });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Product with this SKU already exists'
        });
      }
    }
    
    // If category is being updated, validate it exists
    if (updateData.category) {
      const category = await Category.findById(updateData.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }
    
    const product = await Product.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// DELETE /api/products/:id - Delete product (Admin)
router.delete('/:id', [
  param('id').isMongoId()
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

export default router;