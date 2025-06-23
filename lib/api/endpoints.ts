import { TAGS } from 'lib/constants';
import { ApiClient } from './client';
import {
  AddressListParams,
  AddToCartRequest,
  AuthResponse,
  CartItemResponse,
  CartResponse,
  CategoriesResponse,
  CategoryListParams,
  City,
  Country,
  ForgotPasswordRequest,
  GlobalSettings,
  GuestTokenResponse,
  LanguageSettings,
  LoginRequest,
  PaymentSettings,
  ProductListParams,
  ProductResponse,
  ProductsResponse,
  RegisterRequest,
  ResetPasswordRequest,
  SlidersResponse,
  State,
  UpdateCartRequest,
  VerifyEmailRequest
} from './types';

export class ApiEndpoints {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  // Addresses
  async getAllCountries(params?: AddressListParams) {
    return this.client.get<{ countries: Country[] }>('/api/addresses/all-countries', params);
  }

  async getAllCities(params?: AddressListParams) {
    return this.client.get<{ cities: City[] }>('/api/addresses/all-cities', params);
  }

  async getAllStates(params?: AddressListParams) {
    return this.client.get<{ states: State[] }>('/api/addresses/all-states', params);
  }

  // Categories
  async getCategories(params?: CategoryListParams) {
    return this.client.get<CategoriesResponse>('/api/categories', params);
  }

  // Auth
  async login(data: LoginRequest) {
    return this.client.post<AuthResponse>('/api/login', data);
  }

  async register(data: RegisterRequest) {
    return this.client.post<AuthResponse>('/api/register', data);
  }

  async forgotPassword(data: ForgotPasswordRequest) {
    return this.client.post<{ message: string }>('/api/forgot-password', data);
  }

  async resetPassword(data: ResetPasswordRequest) {
    return this.client.post<{ message: string }>('/api/reset-password', data);
  }

  async verifyEmail(data: VerifyEmailRequest) {
    return this.client.post<{ message: string }>('/api/verify-email', data);
  }

  async sendVerificationEmail() {
    return this.client.post<{ message: string }>('/api/email/verification-notification');
  }

  async logout() {
    return this.client.post<{ message: string }>('/api/logout');
  }

  async refreshToken() {
    return this.client.post<AuthResponse>('/api/refresh');
  }

  // Guest Token
  async generateGuestToken() {
    return this.client.post<GuestTokenResponse>('/api/guest-token');
  }

  // Cart
  async getCart() {
    return this.client.get<CartResponse>('/api/carts', undefined, [TAGS.cart]);
  }

  async addToCart(data: AddToCartRequest) {
    return this.client.post<CartItemResponse>('/api/carts', data);
  }

  async updateCartItem(cartItemId: number, data: UpdateCartRequest) {
    return this.client.put<CartResponse>(`/api/carts/${cartItemId}`, data);
  }

  async deleteCartItem(cartItemId: number) {
    return this.client.delete<{ message: string }>(`/api/carts/${cartItemId}`);
  }

  // Products
  async getProducts(params?: ProductListParams) {
    return this.client.get<ProductsResponse>('/api/products', params);
  }

  async getProduct(productSlug: string) {
    return this.client.get<ProductResponse>(`/api/products/${productSlug}`);
  }

  // Settings
  async getGlobalSettings() {
    return this.client.get<GlobalSettings>('/api/global-settings');
  }

  async getPaymentSettings() {
    return this.client.get<PaymentSettings>('/api/payment-settings');
  }

  async getLanguageSettings() {
    return this.client.get<LanguageSettings>('/api/language-settings');
  }

  async getSliders() {
    return this.client.get<SlidersResponse>('/api/sliders');
  }
}
