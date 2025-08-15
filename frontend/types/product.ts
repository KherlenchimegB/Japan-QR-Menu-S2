// Multilingual text type
export interface MultilingualText {
  mn: string; // Mongolian
  en: string; // English
  zh: string; // Chinese
}

// Language code type
export type LanguageCode = 'mn' | 'en' | 'zh';

// Media file type
export interface MediaFile {
  type: 'image' | 'video' | '3d';
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  alt?: string;
  cloudinaryId?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // for videos
}

// Category type
export interface Category {
  _id: string;
  name: MultilingualText;
  description?: MultilingualText;
  slug: MultilingualText;
  parent?: string | Category;
  level: number;
  path: string;
  icon?: string;
  image?: {
    url: string;
    filename: string;
    alt?: string;
  };
  metaTitle?: MultilingualText;
  metaDescription?: MultilingualText;
  keywords?: string[];
  isActive: boolean;
  isVisible: boolean;
  sortOrder: number;
  productCount?: number;
  children?: Category[];
  breadcrumbs?: Array<{
    _id: string;
    name: string;
    slug: string;
    path: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Product type
export interface Product {
  _id: string;
  name: MultilingualText;
  description: MultilingualText;
  shortDescription: MultilingualText;
  
  // Relationships
  category: string | Category;
  subcategory?: string | Category;
  
  // Product details
  sku: string;
  barcode?: string;
  manufacturer: MultilingualText;
  country: MultilingualText;
  
  // Pharmaceutical specific
  activeIngredient?: MultilingualText;
  dosage?: string;
  form: MultilingualText; // tablet, capsule, syrup, etc.
  packaging: MultilingualText;
  prescription: boolean;
  
  // Media files
  images: MediaFile[];
  videos: MediaFile[];
  models3d: MediaFile[];
  
  // emonos.mn integration
  emonosId?: string;
  emonosUrl?: string;
  emonosLink?: string; // computed property
  
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
  
  // Computed properties
  mainImage?: MediaFile;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// Search and filter types
export interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  sort?: 'name' | 'createdAt' | 'updatedAt' | 'sortOrder';
  page?: number;
  limit?: number;
  lang?: LanguageCode;
}

export interface CategoryFilters {
  parent?: string;
  level?: number;
  tree?: boolean;
  lang?: LanguageCode;
}

// Form types for admin
export interface ProductFormData {
  name: MultilingualText;
  description: MultilingualText;
  shortDescription: MultilingualText;
  category: string;
  subcategory?: string;
  sku: string;
  barcode?: string;
  manufacturer: MultilingualText;
  country: MultilingualText;
  activeIngredient?: MultilingualText;
  dosage?: string;
  form: MultilingualText;
  packaging: MultilingualText;
  prescription: boolean;
  emonosId?: string;
  emonosUrl?: string;
  metaTitle?: MultilingualText;
  metaDescription?: MultilingualText;
  keywords?: string[];
  isActive: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

export interface CategoryFormData {
  name: MultilingualText;
  description?: MultilingualText;
  parent?: string;
  icon?: string;
  metaTitle?: MultilingualText;
  metaDescription?: MultilingualText;
  keywords?: string[];
  isActive: boolean;
  isVisible: boolean;
  sortOrder: number;
}

// Utility type for getting localized text
export type LocalizedText<T extends { [K in LanguageCode]: string }> = T[LanguageCode];

// Component prop types
export interface ProductCardProps {
  product: Product;
  lang: LanguageCode;
  showCategory?: boolean;
  className?: string;
  onClick?: (product: Product) => void;
}

export interface CategoryCardProps {
  category: Category;
  lang: LanguageCode;
  showProductCount?: boolean;
  className?: string;
  onClick?: (category: Category) => void;
}

export interface ProductGridProps {
  products: Product[];
  lang: LanguageCode;
  loading?: boolean;
  error?: string;
  onProductClick?: (product: Product) => void;
}

export interface CategoryTreeProps {
  categories: Category[];
  lang: LanguageCode;
  selectedCategory?: string;
  onCategorySelect?: (category: Category) => void;
}

// 3D Model types
export interface Model3DProps {
  url: string;
  alt?: string;
  autoRotate?: boolean;
  controls?: boolean;
  className?: string;
}

// Video player types
export interface VideoPlayerProps {
  url: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
}

// Language switcher types
export interface LanguageSwitcherProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  className?: string;
}

// Search types
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export interface SearchResult {
  searchTerm: string;
  results: Product[];
  count: number;
}