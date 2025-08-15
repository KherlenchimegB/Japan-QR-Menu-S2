import express, { Request, Response, NextFunction } from 'express';
import Category, { ICategory } from '../models/Category';
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

// GET /api/categories - Get all categories
router.get('/', [
  query('lang').optional().isIn(['mn', 'en', 'zh']),
  query('parent').optional().isMongoId(),
  query('level').optional().isInt({ min: 0 }),
  query('tree').optional().isBoolean()
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const lang = validateLanguage(req.query.lang as string);
    const tree = req.query.tree === 'true';
    
    if (tree) {
      // Return hierarchical tree structure
      const categories = await Category.find({
        isActive: true,
        isVisible: true
      })
        .sort({ level: 1, sortOrder: 1 })
        .populate('children')
        .lean();
      
      // Build tree structure
      const categoryMap = new Map();
      const rootCategories: any[] = [];
      
      categories.forEach(category => {
        categoryMap.set(category._id.toString(), { ...category, children: [] });
      });
      
      categories.forEach(category => {
        const categoryWithChildren = categoryMap.get(category._id.toString());
        
        if (category.parent) {
          const parent = categoryMap.get(category.parent.toString());
          if (parent) {
            parent.children.push(categoryWithChildren);
          }
        } else {
          rootCategories.push(categoryWithChildren);
        }
      });
      
      res.json({
        success: true,
        data: rootCategories
      });
    } else {
      // Return flat list with optional filtering
      let query: any = { isActive: true, isVisible: true };
      
      if (req.query.parent) {
        query.parent = req.query.parent;
      } else if (req.query.parent === 'null') {
        query.parent = null;
      }
      
      if (req.query.level !== undefined) {
        query.level = parseInt(req.query.level as string);
      }
      
      const categories = await Category.find(query)
        .populate('parent', 'name slug')
        .sort({ level: 1, sortOrder: 1 })
        .lean();
      
      res.json({
        success: true,
        data: categories
      });
    }
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// GET /api/categories/roots - Get root categories only
router.get('/roots', [
  query('lang').optional().isIn(['mn', 'en', 'zh'])
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const lang = validateLanguage(req.query.lang as string);
    
    const categories = await Category.find({
      isActive: true,
      isVisible: true,
      parent: null
    })
      .sort({ sortOrder: 1 })
      .lean();
    
    res.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    console.error('Error fetching root categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch root categories'
    });
  }
});

// GET /api/categories/:id - Get single category by ID
router.get('/:id', [
  param('id').isMongoId(),
  query('lang').optional().isIn(['mn', 'en', 'zh']),
  query('includeChildren').optional().isBoolean(),
  query('includeProducts').optional().isBoolean()
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lang = validateLanguage(req.query.lang as string);
    const includeChildren = req.query.includeChildren === 'true';
    const includeProducts = req.query.includeProducts === 'true';
    
    let query = Category.findOne({
      _id: id,
      isActive: true,
      isVisible: true
    }).populate('parent', 'name slug');
    
    if (includeChildren) {
      query = query.populate('children');
    }
    
    if (includeProducts) {
      query = query.populate('productCount');
    }
    
    const category = await query.lean();
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Get breadcrumbs
    const breadcrumbs = await Category.getBreadcrumbs(id, lang);
    
    res.json({
      success: true,
      data: {
        ...category,
        breadcrumbs
      }
    });
    
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category'
    });
  }
});

// GET /api/categories/slug/:slug - Get category by slug
router.get('/slug/:slug', [
  param('slug').notEmpty(),
  query('lang').optional().isIn(['mn', 'en', 'zh']),
  query('includeChildren').optional().isBoolean()
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const lang = validateLanguage(req.query.lang as string);
    const includeChildren = req.query.includeChildren === 'true';
    
    const query: any = { isActive: true, isVisible: true };
    query[`slug.${lang}`] = slug;
    
    let categoryQuery = Category.findOne(query).populate('parent', 'name slug');
    
    if (includeChildren) {
      categoryQuery = categoryQuery.populate('children');
    }
    
    const category = await categoryQuery.lean();
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Get breadcrumbs
    const breadcrumbs = await Category.getBreadcrumbs(category._id, lang);
    
    res.json({
      success: true,
      data: {
        ...category,
        breadcrumbs
      }
    });
    
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category'
    });
  }
});

// GET /api/categories/:id/children - Get children of a category
router.get('/:id/children', [
  param('id').isMongoId(),
  query('lang').optional().isIn(['mn', 'en', 'zh'])
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lang = validateLanguage(req.query.lang as string);
    
    // Check if parent category exists
    const parentCategory = await Category.findById(id);
    if (!parentCategory) {
      return res.status(404).json({
        success: false,
        message: 'Parent category not found'
      });
    }
    
    const children = await Category.find({
      parent: id,
      isActive: true,
      isVisible: true
    })
      .sort({ sortOrder: 1 })
      .lean();
    
    res.json({
      success: true,
      data: children
    });
    
  } catch (error) {
    console.error('Error fetching category children:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category children'
    });
  }
});

// GET /api/categories/:id/breadcrumbs - Get breadcrumbs for a category
router.get('/:id/breadcrumbs', [
  param('id').isMongoId(),
  query('lang').optional().isIn(['mn', 'en', 'zh'])
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lang = validateLanguage(req.query.lang as string);
    
    const breadcrumbs = await Category.getBreadcrumbs(id, lang);
    
    if (breadcrumbs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: breadcrumbs
    });
    
  } catch (error) {
    console.error('Error fetching breadcrumbs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch breadcrumbs'
    });
  }
});

// Admin routes (would normally be protected by authentication middleware)

// POST /api/categories - Create new category (Admin)
router.post('/', [
  body('name.mn').notEmpty().withMessage('Mongolian name is required'),
  body('name.en').notEmpty().withMessage('English name is required'),
  body('name.zh').notEmpty().withMessage('Chinese name is required'),
  body('parent').optional().isMongoId()
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;
    
    // If parent is specified, validate it exists
    if (categoryData.parent) {
      const parentCategory = await Category.findById(categoryData.parent);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: 'Parent category not found'
        });
      }
    }
    
    const category = new Category(categoryData);
    await category.save();
    
    await category.populate('parent', 'name slug');
    
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
    
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category'
    });
  }
});

// PUT /api/categories/:id - Update category (Admin)
router.put('/:id', [
  param('id').isMongoId(),
  body('name.mn').optional().notEmpty(),
  body('name.en').optional().notEmpty(),
  body('name.zh').optional().notEmpty(),
  body('parent').optional().isMongoId()
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // If parent is being updated, validate it exists and prevent circular reference
    if (updateData.parent) {
      const parentCategory = await Category.findById(updateData.parent);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: 'Parent category not found'
        });
      }
      
      // Check for circular reference
      const breadcrumbs = await Category.getBreadcrumbs(updateData.parent, 'en');
      if (breadcrumbs.some(crumb => crumb._id.toString() === id)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot set child category as parent (circular reference)'
        });
      }
    }
    
    const category = await Category.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('parent', 'name slug');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category'
    });
  }
});

// DELETE /api/categories/:id - Delete category (Admin)
router.delete('/:id', [
  param('id').isMongoId()
], handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if category has children
    const childrenCount = await Category.countDocuments({ parent: id });
    if (childrenCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category that has subcategories'
      });
    }
    
    // Check if category has products (would need Product model import)
    // const productCount = await Product.countDocuments({ category: id });
    // if (productCount > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Cannot delete category that has products'
    //   });
    // }
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    });
  }
});

export default router;