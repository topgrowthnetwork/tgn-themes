/**
 * Centralized Payment Gateway Configuration
 *
 * This module provides a single source of truth for all payment gateway configurations
 * used throughout the application (checkout forms, footer, etc.)
 *
 * Environment Variable Usage:
 * - NEXT_PUBLIC_FOOTER_GATEWAYS: Comma-separated list of gateway keys to display in footer
 *   Example: "tabby,tamara"
 *
 * Available gateway keys:
 * - cash_on_delivery
 * - cash_on_site
 * - fawaterk
 * - send_receipt
 * - paymob_card
 * - paymob_wallet
 * - tabby
 * - tamara
 */

/**
 * Payment Gateway Configuration Interface
 *
 * @property key - Unique identifier for the payment gateway
 * @property name - Display name of the payment gateway
 * @property faviconPath - Path to the small icon (used in payment forms)
 * @property imagePath - Path to the larger image (used in footer and marketing)
 */
export interface PaymentGatewayConfig {
  key: string;
  name: string;
  faviconPath?: string;
  imagePath?: string;
}

export const PAYMENT_GATEWAYS: Record<string, PaymentGatewayConfig> = {
  cash_on_delivery: {
    key: 'cash_on_delivery',
    name: 'Cash on Delivery'
  },
  cash_on_site: {
    key: 'cash_on_site',
    name: 'Cash on Site'
  },
  fawaterk: {
    key: 'fawaterk',
    name: 'Fawaterak',
    faviconPath: '/image/gateways/favicons/fawaterak.jpeg',
    imagePath: '/image/gateways/favicons/fawaterak.jpeg'
  },
  send_receipt: {
    key: 'send_receipt',
    name: 'Send Receipt'
  },
  paymob_card: {
    key: 'paymob_card',
    name: 'Paymob Card',
    faviconPath: '/image/gateways/favicons/paymob.png',
    imagePath: '/image/gateways/favicons/paymob.png'
  },
  paymob_wallet: {
    key: 'paymob_wallet',
    name: 'Paymob Wallet',
    faviconPath: '/image/gateways/favicons/paymob.png',
    imagePath: '/image/gateways/favicons/paymob.png'
  },
  tabby: {
    key: 'tabby',
    name: 'Tabby',
    faviconPath: '/image/gateways/favicons/tabby.png',
    imagePath: '/image/gateways/favicons/tabby.png'
  },
  tamara: {
    key: 'tamara',
    name: 'Tamara',
    faviconPath: '/image/gateways/favicons/tamara.png',
    imagePath: '/image/gateways/favicons/tamara.png'
  }
};

/**
 * Get payment gateway configuration by key
 */
export function getPaymentGateway(key: string): PaymentGatewayConfig | undefined {
  return PAYMENT_GATEWAYS[key];
}

/**
 * Get multiple payment gateways by keys
 */
export function getPaymentGateways(keys: string[]): PaymentGatewayConfig[] {
  return keys
    .map((key) => PAYMENT_GATEWAYS[key])
    .filter((gateway): gateway is PaymentGatewayConfig => gateway !== undefined);
}

/**
 * Get all payment gateway configurations
 */
export function getAllPaymentGateways(): PaymentGatewayConfig[] {
  return Object.values(PAYMENT_GATEWAYS);
}

/**
 * Parse comma-separated gateway keys from environment variable
 */
export function parseGatewayKeysFromEnv(envValue?: string): string[] {
  if (!envValue) return [];
  return envValue
    .split(',')
    .map((key) => key.trim())
    .filter((key) => key.length > 0);
}
