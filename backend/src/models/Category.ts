import mongoose, { Document, Schema } from 'mongoose';

// Multilingual text interface (same as Product)
interface MultilingualText {
  mn: string; // Mongolian
  en: string; // English
  zh: string; // Chinese
}

// Category interface
export interface ICategory extends Document {
  name: MultilingualText;
  description?: MultilingualText;
  slug: MultilingualText;
  
  // Hierarchy
  parent?: mongoose.Types.ObjectId; // Reference to parent category
  level: number; // 0 = root, 1 = subcategory, etc.
  path: string; // e.g., "vitamins/vitamin-c"
  
  // Media
  icon?: string; // Icon class or URL
  image?: {
    url: string;
    filename: string;
    alt?: string;
  };
  
  // SEO and metadata
  metaTitle?: MultilingualText;
  metaDescription?: MultilingualText;
  keywords?: string[];
  
  // Status and visibility
  isActive: boolean;
  isVisible: boolean;
  sortOrder: number;
  
  // Product count (virtual)
  productCount?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Category schema
const CategorySchema = new Schema<ICategory>({
  name: {
    mn: { type: String, required: true, trim: true },
    en: { type: String, required: true, trim: true },
    zh: { type: String, required: true, trim: true }
  },
  description: {
    mn: { type: String, trim: true },
    en: { type: String, trim: true },
    zh: { type: String, trim: true }
  },
  slug: {
    mn: { type: String, required: true, lowercase: true },
    en: { type: String, required: true, lowercase: true },
    zh: { type: String, required: true, lowercase: true }
  },
  
  // Hierarchy
  parent: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category',
    default: null
  },
  level: { type: Number, default: 0, min: 0 },
  path: { type: String, required: true },
  
  // Media
  icon: { type: String },
  image: {
    url: { type: String },
    filename: { type: String },
    alt: { type: String }
  },
  
  // SEO and metadata
  metaTitle: {
    mn: { type: String },
    en: { type: String },
    zh: { type: String }
  },
  metaDescription: {
    mn: { type: String },
    en: { type: String },
    zh: { type: String }
  },
  keywords: [{ type: String, lowercase: true }],
  
  // Status and visibility
  isActive: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
CategorySchema.index({ 'slug.mn': 1, 'slug.en': 1, 'slug.zh': 1 });
CategorySchema.index({ parent: 1, sortOrder: 1 });
CategorySchema.index({ isActive: 1, isVisible: 1 });
CategorySchema.index({ level: 1 });
CategorySchema.index({ path: 1 });

// Pre-save middleware to generate slugs and path
CategorySchema.pre('save', async function(next) {
  // Generate slugs if name is modified
  if (this.isModified('name')) {
    this.slug = {
      mn: this.name.mn.toLowerCase().replace(/[^a-z0-9а-я]/gi, '-').replace(/-+/g, '-'),
      en: this.name.en.toLowerCase().replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-'),
      zh: this.name.zh.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]/gi, '-').replace(/-+/g, '-')
    };
  }
  
  // Generate path and level
  if (this.parent) {
    try {
      const parent = await this.constructor.findById(this.parent);
      if (parent) {
        this.level = (parent as any).level + 1;
        this.path = `${(parent as any).path}/${this.slug.en}`;
      }
    } catch (error) {
      console.error('Error finding parent category:', error);
    }
  } else {
    this.level = 0;
    this.path = this.slug.en;
  }
  
  next();
});

// Virtual for children categories
CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for product count
CategorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Static method to get category tree
CategorySchema.statics.getTree = function(lang: 'mn' | 'en' | 'zh' = 'mn') {
  return this.aggregate([
    {
      $match: { isActive: true, isVisible: true }
    },
    {
      $sort: { level: 1, sortOrder: 1 }
    },
    {
      $group: {
        _id: '$parent',
        categories: { $push: '$$ROOT' }
      }
    }
  ]);
};

// Static method to find by slug
CategorySchema.statics.findBySlug = function(slug: string, lang: 'mn' | 'en' | 'zh' = 'mn') {
  const query: any = { isActive: true, isVisible: true };
  query[`slug.${lang}`] = slug;
  return this.findOne(query);
};

// Static method to get breadcrumbs
CategorySchema.statics.getBreadcrumbs = async function(categoryId: string, lang: 'mn' | 'en' | 'zh' = 'mn') {
  const breadcrumbs = [];
  let currentCategory = await this.findById(categoryId);
  
  while (currentCategory) {
    breadcrumbs.unshift({
      _id: currentCategory._id,
      name: currentCategory.name[lang],
      slug: currentCategory.slug[lang],
      path: currentCategory.path
    });
    
    if (currentCategory.parent) {
      currentCategory = await this.findById(currentCategory.parent);
    } else {
      break;
    }
  }
  
  return breadcrumbs;
};

export default mongoose.model<ICategory>('Category', CategorySchema);