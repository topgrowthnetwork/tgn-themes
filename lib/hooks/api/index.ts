'use client';

// Fetcher utilities
export { buildQueryString, deleteFetcher, FetcherError, fetcher, postFetcher, putFetcher } from './fetcher';

// Products
export {
  useBestSellingProducts,
  useNewestProducts,
  useProduct,
  useProductImmutable,
  useProducts,
  useProductsByCategory,
  useProductSearch,
  useRecommendedProducts
} from './use-products';
export type { ProductData } from './use-products';

// Cart
export {
  addToCartAction,
  applyCouponAction,
  deleteCartItemAction,
  updateCartItemAction,
  useCart
} from './use-cart';

// Categories
export { useCategories, useCategoriesImmutable, useCategory } from './use-categories';

// Settings
export {
  useGlobalSettings,
  useGlobalSettingsImmutable,
  useLanguageSettings,
  useLanguageSettingsImmutable,
  usePaymentSettings,
  usePaymentSettingsImmutable,
  useSliders,
  useSlidersImmutable
} from './use-settings';

// Addresses
export {
  useAddressData,
  useCities,
  useCitiesByState,
  useCitiesImmutable,
  useCountries,
  useCountriesImmutable,
  useStates,
  useStatesByCountry,
  useStatesImmutable
} from './use-addresses';

// Auth
export {
  forgotPasswordAction,
  generateGuestTokenAction,
  loginAction,
  logoutAction,
  registerAction,
  resetPasswordAction,
  useAuth,
  verifyEmailAction
} from './use-auth';

// Partners
export { usePartners, usePartnersImmutable } from './use-partners';

// Checkout & Contact
export {
  checkoutAction,
  submitContactAction,
  useCheckout,
  useContact
} from './use-checkout';

