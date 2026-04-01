export interface Category {
  id: string;
  name: string;
  slug: string;
  banner_url?: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  thumbnail_url: string;
  images?: string[];
  differentials?: string[];
  is_popular?: boolean;
  is_kit?: boolean;
  is_available?: boolean;
  tags?: string[];
  handle?: string;
  details?: ProductDetailsData;
  variations?: ProductVariation[];
}


export interface ProductVariation {
  id: string;
  product_id: string;
  name: string;
  price?: number;
  price_modifier?: number;
  sku_token?: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  mobile_image_url: string;
  target_url: string;
  is_active: boolean;
}

export interface PromotionalKit {
  id: string;
  name: string;
  description: string;
  base_price: number;
  discount_percentage: number;
  thumbnail_url: string;
}

export interface Video {
  id: string;
  product_id: string;
  title: string;
  url: string;
  thumbnail_url: string;
}

// New Detailed Product Structure
export interface ProductDetailsData {
  subtitle?: string;
  reviews?: {
    rating: number;
    count: number;
    items?: Array<{
      user: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  };
  main_features?: string[] | { title: string; items: string[] };
  timeline?: any; // Suporta tanto o objeto de label/items quanto o array de TimelineItem
  benefits?: any; // Suporta o array legado e o novo
  formula?: {
    title: string;
    description: string;
    image?: string;
  };
  comparison?: any;
  how_to_use?: {
    title: string;
    description: string;
    steps: string[];
  };
  faq?: any[];
  video_url?: string;
  nutrition_facts?: {
    serving_size: string;
    items: NutritionItem[];
  };
  kits?: ProductKit[];
  testimonials?: Testimonial[];
  flavors?: string[];
}

export interface Benefit {
  icon: string; // Could be an emoji or an icon name
  title: string;
  description: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  points: string[];
}

export interface FormulaFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ComparisonItem {
  attribute: string;
  age_solution: boolean;
  others: boolean;
}

export interface ProductKit {
  id: string;
  pots: number;
  old_price: number;
  price: number;
  installments: string;
  is_best_seller: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
}

export interface NutritionItem {
  nutrient: string;
  quantity: string;
  daily_value: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variation?: ProductVariation;
}
