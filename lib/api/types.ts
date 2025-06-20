export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
}

// Address types
export interface Country {
  id: number;
  name: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  states_count: string;
  cities_count: string;
}

export interface City {
  id: number;
  name: string;
  code: string;
  active: boolean;
  country_id: number;
  state_id: number;
  created_at: string;
  updated_at: string;
}

export interface State {
  id: number;
  name: string;
  shipping_amount: number;
  code: number;
  active: boolean;
  country_id: number;
  created_at: string;
  updated_at: string;
  cities_count: string;
}

export interface AddressListParams {
  search?: string;
  country_id?: string;
  state_id?: string;
  [key: string]: string | undefined;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyEmailRequest {
  email_verify_token: string;
}

export interface AuthResponse {
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
  };
  token?: string;
  message?: string;
}

export interface ValidationError {
  [field: string]: string[];
}

// Guest Token types
export interface GuestTokenResponse {
  guest_token: string;
  message?: string;
}

// Cart types
export interface CartItem {
  id: number;
  qty: number;
  product_id: number;
  product_variant_id?: number;
  product?: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  qyt: number;
  product_id: number;
  product_variant_id?: number;
}

export interface UpdateCartRequest {
  qyt: number;
}

export interface CartResponse {
  cart: CartItem[] | null;
  sub_total: number;
  total_price: number;
  discount: number;
  tax: number;
  total_items: number;
}

export interface ApiConfig {
  baseURL: string;
  headers?: Record<string, string>;
  language?: string;
  guestToken?: string;
  authToken?: string;
}

// Category types
export interface CategoryTranslation {
  id: number;
  category_id: number;
  name: string;
  locale: string;
}

export interface Category {
  id: number;
  parent_id: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  products_count: string;
  name: string;
  translations: CategoryTranslation[];
}

export interface CategoriesResponse {
  category: Category[];
  categories: Category[];
}

export interface CategoryListParams {
  search?: string;
  select?: string;
  category_id?: string;
  [key: string]: string | undefined;
}

// Product types
export interface ProductImage {
  id: number;
  title: string;
  path: string;
  size: string;
  type: string;
  extension: string;
  external_link?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductTranslation {
  id: number;
  product_id: number;
  title: string;
  description: string;
  product_attributes?: Record<string, any>;
  locale: string;
}

export interface Product {
  id: number;
  images: string[];
  thumbnail_img: string;
  stock: number;
  min_stock: string;
  meta_keywords: string;
  meta_description: string;
  sku: string;
  slug: string;
  price: number;
  discount: number;
  discount_type: 'fixed' | 'percentage';
  recomended: boolean;
  active: boolean;
  category_id: number;
  created_at: string;
  updated_at: string;
  selling_count: string | null;
  final_price: number;
  title: string;
  description: string;
  product_attributes?: Record<string, any>;
  thumbnail?: ProductImage;
  category: Category;
  translations: ProductTranslation[];
}

export interface ProductListParams {
  search?: string;
  select?: string;
  category_id?: string;
  page?: string;
  recomended?: string;
  order_by?: 'selling_count' | 'created_at';
  per_page?: string;
  [key: string]: string | undefined;
}

export interface ProductsResponse {
  products: {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface ProductResponse {
  product: Product;
  images: ProductImage[];
  attributes: any[];
  combinations: any[];
}

// Settings types
export interface GlobalSettings {
  site_title: string;
  site_description: string;
  site_footer_copyright: string;
  [key: string]: any;
}

export interface PaymentSettings {
  fawaterk_gateway: string;
  paymob_card_gateway: string;
  paymob_wallet_gateway: string;
  cash_on_delivery: string;
  cash_on_site: string;
  send_receipt: string;
  [key: string]: any;
}

export interface Language {
  id: number;
  name: string;
  slug: string;
  direction: 'rtl' | 'ltr';
  default: boolean;
  created_at: string;
  updated_at: string;
}

export interface LanguageSettings {
  languages: Language[];
  defaultLang: Language;
  all_word: Record<string, string>;
}

export interface Slider {
  id: number;
  title: string;
  description?: string;
  image: string;
  link?: string;
  active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface SlidersResponse {
  sliders: Slider[];
}
