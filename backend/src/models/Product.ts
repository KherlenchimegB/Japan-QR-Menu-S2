import mongoose, { Document, Schema } from 'mongoose';

// Multilingual text interface
interface MultilingualText {
  mn: string; // Mongolian
  en: string; // English
  zh: string; // Chinese
}

// Media file interface
interface MediaFile {
  type: 'image' | 'video' | '3d';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  alt?: string; // Alternative text for images
}

// Product interface
export interface IProduct extends Document {
  name: MultilingualText;
  description: MultilingualText;
  shortDescription: MultilingualText;
  category: mongoose.Types.ObjectId; // Reference to Category
  subcategory?: mongoose.Types.ObjectId; // Reference to subcategory
  
  // Product details
  sku: string; // Stock Keeping Unit
  barcode?: string;
  manufacturer: MultilingualText;
  country: MultilingualText;
  
  // Pharmaceutical specific
  activeIngredient?: MultilingualText;
  dosage?: string;
  form: MultilingualText; // tablet, capsule, syrup, etc.
  packaging: MultilingualText;
  prescription: boolean; // requires prescription or not
  
  // Media files
  images: MediaFile[];
  videos: MediaFile[];
  models3d: MediaFile[];
  
  // emonos.mn integration
  emonosId?: string; // ID in emonos.mn system
  emonosUrl?: string; // Direct URL to product on emonos.mn
  
  // SEO and metadata
  slug: MultilingualText;
  metaTitle?: MultilingualText;
  metaDescription?: MultilingualText;
  keywords?: string[];
  
  // Status and visibility
  isActive: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Product schema
const ProductSchema = new Schema<IProduct>({
  name: {
    mn: { type: String, required: true, trim: true },
    en: { type: String, required: true, trim: true },
    zh: { type: String, required: true, trim: true }
  },
  description: {
    mn: { type: String, required: true },
    en: { type: String, required: true },
    zh: { type: String, required: true }
  },
  shortDescription: {
    mn: { type: String, required: true, maxlength: 200 },
    en: { type: String, required: true, maxlength: 200 },
    zh: { type: String, required: true, maxlength: 200 }
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  
  // Product details
  sku: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true,
    trim: true
  },
  barcode: { type: String, trim: true },
  manufacturer: {
    mn: { type: String, required: true },
    en: { type: String, required: true },
    zh: { type: String, required: true }
  },
  country: {
    mn: { type: String, required: true },
    en: { type: String, required: true },
    zh: { type: String, required: true }
  },
  
  // Pharmaceutical specific
  activeIngredient: {
    mn: { type: String },
    en: { type: String },
    zh: { type: String }
  },
  dosage: { type: String },
  form: {
    mn: { type: String, required: true },
    en: { type: String, required: true },
    zh: { type: String, required: true }
  },
  packaging: {
    mn: { type: String, required: true },
    en: { type: String, required: true },
    zh: { type: String, required: true }
  },
  prescription: { type: Boolean, default: false },
  
  // Media files
  images: [{
    type: { type: String, enum: ['image'], default: 'image' },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    alt: { type: String }
  }],
  videos: [{
    type: { type: String, enum: ['video'], default: 'video' },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    alt: { type: String }
  }],
  models3d: [{
    type: { type: String, enum: ['3d'], default: '3d' },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    alt: { type: String }
  }],
  
  // emonos.mn integration
  emonosId: { type: String, trim: true },
  emonosUrl: { type: String, trim: true },
  
  // SEO and metadata
  slug: {
    mn: { type: String, required: true, lowercase: true },
    en: { type: String, required: true, lowercase: true },
    zh: { type: String, required: true, lowercase: true }
  },
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
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  
  // Timestamps
  publishedAt: { type: Date }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
ProductSchema.index({ sku: 1 });
ProductSchema.index({ 'name.mn': 'text', 'name.en': 'text', 'name.zh': 'text' });
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ isActive: 1, isPublished: 1 });
ProductSchema.index({ isFeatured: 1, sortOrder: 1 });
ProductSchema.index({ 'slug.mn': 1, 'slug.en': 1, 'slug.zh': 1 });

// Pre-save middleware to generate slugs
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = {
      mn: this.name.mn.toLowerCase().replace(/[^a-z0-9а-я]/gi, '-').replace(/-+/g, '-'),
      en: this.name.en.toLowerCase().replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-'),
      zh: this.name.zh.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]/gi, '-').replace(/-+/g, '-')
    };
  }
  next();
});

// Virtual for main image
ProductSchema.virtual('mainImage').get(function() {
  return this.images && this.images.length > 0 ? this.images[0] : null;
});

// Virtual for emonos link
ProductSchema.virtual('emonosLink').get(function() {
  if (this.emonosUrl) return this.emonosUrl;
  if (this.emonosId) return `https://emonos.mn/products/${this.emonosId}`;
  return null;
});

// Static method to find by language and slug
ProductSchema.statics.findBySlug = function(slug: string, lang: 'mn' | 'en' | 'zh' = 'mn') {
  const query: any = { isActive: true, isPublished: true };
  query[`slug.${lang}`] = slug;
  return this.findOne(query);
};

// Static method to search products
ProductSchema.statics.search = function(searchTerm: string, lang: 'mn' | 'en' | 'zh' = 'mn') {
  const regex = new RegExp(searchTerm, 'i');
  return this.find({
    isActive: true,
    isPublished: true,
    $or: [
      { [`name.${lang}`]: regex },
      { [`description.${lang}`]: regex },
      { [`shortDescription.${lang}`]: regex },
      { [`category.${lang}`]: regex },
      { [`manufacturer.${lang}`]: regex }
    ]
  });
};

export default mongoose.model<IProduct>('Product', ProductSchema);