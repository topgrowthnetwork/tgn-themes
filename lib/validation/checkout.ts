import { z } from 'zod';

// Payment gateway options - matching CheckoutRequest exactly
const paymentGatewayEnum = z.enum([
  'cash_on_site',
  'cash_on_delivery',
  'fawaterk_gateway',
  'send_receipt',
  'paymob_card_gateway',
  'paymob_wallet_gateway'
]);

// Shipping address schema - matching CheckoutRequest.shipping_address
export const shippingAddressSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required')
});

// Personal information schema
export const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number must be at least 6 characters')
});

// Payment information schema - matching CheckoutRequest exactly
export const paymentInfoSchema = z.object({
  payment_gateway: paymentGatewayEnum,
  coupon_code: z.string().optional(),
  receipt_image: z.string().optional(),
  wallet_number: z.string().optional()
});

// Complete checkout form schema - matching CheckoutRequest exactly
export const checkoutFormSchema = z.object({
  shipping_address: shippingAddressSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number must be at least 6 characters'),
  payment_gateway: paymentGatewayEnum,
  coupon_code: z.string().optional(),
  receipt_image: z.string().optional(),
  wallet_number: z.string().optional()
});

// Server action input schema (for form data from server actions)
// This handles the flattened form data from HTML forms
// FormData.get() returns null for missing fields, so we handle that
export const serverActionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number must be at least 6 characters'),
  shipping_address_country: z.string().min(1, 'Country is required'),
  shipping_address_state: z.string().min(1, 'State is required'),
  shipping_address_city: z.string().min(1, 'City is required'),
  shipping_address_address: z.string().min(1, 'Address is required'),
  payment_gateway: paymentGatewayEnum,
  coupon_code: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  receipt_image: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  wallet_number: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === null ? undefined : val))
});

// Type exports
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type PaymentInfo = z.infer<typeof paymentInfoSchema>;
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type ServerActionData = z.infer<typeof serverActionSchema>;

// Helper function to transform server action data to CheckoutRequest format
export const transformServerActionData = (data: ServerActionData): CheckoutFormData => {
  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    shipping_address: {
      country: data.shipping_address_country,
      state: data.shipping_address_state,
      city: data.shipping_address_city,
      address: data.shipping_address_address
    },
    payment_gateway: data.payment_gateway,
    coupon_code: data.coupon_code,
    receipt_image: data.receipt_image,
    wallet_number: data.wallet_number
  };
};

// Helper function to validate server action data
export const validateServerActionData = (data: unknown) => {
  return serverActionSchema.safeParse(data);
};

// Helper function to validate checkout form data
export const validateCheckoutFormData = (data: unknown) => {
  return checkoutFormSchema.safeParse(data);
};
