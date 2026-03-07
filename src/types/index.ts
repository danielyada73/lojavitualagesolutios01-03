export interface Category {
  id: string;
  name: string;
  slug: string;
  banner_url: string;
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
  is_popular: boolean;
  is_kit?: boolean;
  details?: {
    subtitle: string;
    reviews: {
      rating: number;
      count: number;
    };
    flavors?: string[];
    main_features: {
      title: string;
      items: string[];
    };
    benefits: {
      title: string;
      description: string;
      items: { icon: string; title: string; description: string }[];
    };
    timeline: { period: string; title: string; points: string[] }[];
    formula: {
      title: string;
      description: string;
      features: { icon: string; title: string; description: string }[];
    };
    comparison: {
      title: string;
      items: { attribute: string; age_solution: boolean; others: boolean }[];
    };
    how_to_use: {
      title: string;
      description: string;
      steps: string[];
    };
    kits: { id: string; pots: number; old_price: number; price: number; installments: string; is_best_seller: boolean }[];
    testimonials: { id: string; name: string; location: string; rating: number; comment: string }[];
    nutrition_facts: {
      serving_size: string;
      items: { nutrient: string; quantity: string; daily_value: string }[];
    };
    faq: { question: string; answer: string }[];
  };
}

export interface ProductVariation {
  id: string;
  product_id: string;
  name: string;
  price?: number;
  price_modifier: number;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Address {
  id: string;
  user_id: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Order {
  id: string;
  user_id: string;
  address_id: string;
  total_price: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shipping_cost: number;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_variation_id?: string;
  quantity: number;
  unit_price: number;
}

export interface CartItem {
  id: string;
  product: Product;
  variation?: ProductVariation;
  quantity: number;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  mobile_image_url?: string;
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
  product_id?: string;
  title: string;
  url: string;
  thumbnail_url: string;
}
