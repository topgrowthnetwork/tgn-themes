export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  status_code?: number;
  errors?: Record<string, string[]>;
  [key: string]: any;
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

export interface CartItemDetail {
  id: number;
  cart_id: number;
  product_id: number;
  product_variant_id: number;
  qyt: number;
  product: Product;
  variant?: ProductVariant;
}

export interface AddToCartRequest {
  qyt: number;
  product_id: number;
  product_variant_id?: number;
}

export interface UpdateCartRequest {
  qyt: number;
}

// Response for addToCart() - single cart item
export interface CartItemResponse {
  cart_item: {
    id: number;
    cart_id: number;
    product_id: number;
    product_variant_id: number;
    qyt: number;
    product: Product;
    variant: ProductVariant;
  };
  message: string;
}

// Response for getCart() - full cart with multiple items
export interface CartResponse {
  cart: {
    id: number;
    user_id: number | null;
    guest_token: string;
    coupon_code: string | null;
    created_at: string;
    updated_at: string;
    cart_items: CartItemDetail[];
    coupon: any | null;
  } | null;
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
  timeout?: number; // Timeout in milliseconds
  retry?: {
    maxAttempts?: number; // Maximum number of retry attempts (default: 3)
    delayMs?: number; // Base delay between retries in milliseconds (default: 1000)
    backoffMultiplier?: number; // Exponential backoff multiplier (default: 2)
    retryableStatusCodes?: number[]; // HTTP status codes to retry (default: [408, 429, 500, 502, 503, 504])
    retryableErrors?: string[]; // Error messages to retry (default: ['Network error occurred', 'Request timeout'])
  };
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
  parent: Category | null;
  thumbnail: ProductImage | null;
  children: Category[];
  all_children: Category[];
  translations: CategoryTranslation[];
}

export interface CategoriesResponse {
  category: Category;
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

export interface ProductAttributeValue {
  value: string;
  hex?: string;
}

export interface ProductAttributes {
  [key: string]: ProductAttributeValue[];
}

export interface ProductAttributeValueDetail {
  id: number;
  attribute_id: number;
  value: string;
  hex: string | null;
  created_at: string;
  updated_at: string;
  pivot: {
    product_variant_id: string;
    attribute_value_id: string;
  };
  attribute: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: number;
  final_price: number;
  stock: number;
  images: number[];
  created_at: string;
  updated_at: string;
  images_url: string[];
  attribute_values: ProductAttributeValueDetail[];
}

export interface Product {
  id: number;
  images: string[];
  thumbnail_img: string;
  stock: number;
  min_stock: number;
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
  thumbnail: ProductImage | null;
  category: Category;
  variants: ProductVariant[];
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

export interface ProductCombination {
  Color: string;
  Size: string;
  variant_id: number;
  stock: number;
  price: number;
  images: number[];
}

export interface ProductResponse {
  product: Product;
  images: ProductImage[] | null;
  attributes: ProductAttributes;
  combinations: ProductCombination[];
}

// Settings types
export interface GlobalSettings {
  site_title: string;
  site_description: string | null;
  site_footer_copyright: string;
  site_logo: ProductImage | null;
  site_favicon: ProductImage | null;
  invoice_logo: ProductImage | null;
  footer_logo: ProductImage | null;
  page_header_img: ProductImage | null;
  site_color: string;
  tax_fee_amount: string;
  tax_fee_type: string;
  site_global_currency: string;
  show_social_links: string;
  facebook_link: string;
  youtube_link: string;
  twitter_link: string;
  instagram_link: string;
  linkedin_link: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  max_order_amount: string;
  min_order_amount: string;
  avilable_guest_orders: string;
  back_primary_color: string | null;
  back_secondary_color: string | null;
  front_primary_color: string | null;
  front_primary_color_hover: string | null;
  front_secondary_color: string | null;
  front_secondary_color_hover: string | null;
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
  link?: string;
  btn_text?: string;
  image: string;
  mobile_image: string;
  created_at: string;
  updated_at: string;
  img: ProductImage | null;
  mob_img: ProductImage | null;
}

export interface SlidersResponse {
  sliders: Slider[];
}

// Order types
export interface ShippingAddress {
  country: string;
  state: string;
  city: string;
  address: string;
}

export interface CheckoutRequest {
  shipping_address: ShippingAddress;
  name: string;
  email: string;
  phone: string;
  payment_gateway:
    | 'cash_on_site'
    | 'cash_on_delivery'
    | 'fawaterk_gateway'
    | 'send_receipt'
    | 'paymob_card_gateway'
    | 'paymob_wallet_gateway'
    | '';
  coupon_code?: string;
  receipt_image?: string;
  wallet_number?: string;
}

export interface Order {
  user_id: number | null;
  guest_token: string;
  guest_name: string;
  guest_email: string;
  phone: string;
  shipping_address: ShippingAddress;
  invoice_no: string;
  payment_gateway: string;
  discount: number;
  wallet_number: string | null;
  tax_fee_amount: number;
  shipping_amount: number;
  total_price: number;
  payable_amount: number;
  refund_amount: number;
  refund_status: boolean;
  status: number;
  payment_status: string;
  updated_at: string;
  created_at: string;
  id: number;
  receipt_image_url: string | null;
}

export interface CheckoutResponse {
  order: Order;
  response: any | null;
}

// Contact types
export interface ContactRequest {
  name: string;
  email?: string;
  phone: string;
  message: string;
  data?: { [key: string]: string };
}

export interface ContactResponse {
  success: boolean;
  status_code: number;
  data: null;
  message: string;
}

export interface ActionResponse {
  message: string;
  success: boolean;
}
