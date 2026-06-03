/**
 * Payment brand logos shown in the site footer (icons only).
 * Assets live under public/image/gateways/
 */
export interface FooterPaymentLogo {
  key: string;
  name: string;
  imagePath: string;
}

export const FOOTER_PAYMENT_LOGOS: FooterPaymentLogo[] = [
  { key: 'tabby', name: 'Tabby', imagePath: '/image/gateways/tabby.webp' },
  { key: 'tamara', name: 'Tamara', imagePath: '/image/gateways/tamara.png' },
  { key: 'mispay', name: 'MisPay', imagePath: '/image/gateways/mispay.png' },
  { key: 'madfu', name: 'Madfu', imagePath: '/image/gateways/madfu.png' },
  { key: 'mada', name: 'Mada', imagePath: '/image/gateways/mada.png' },
  { key: 'apple-pay', name: 'Apple Pay', imagePath: '/image/gateways/apple-pay.png' },
  { key: 'mastercard', name: 'Mastercard', imagePath: '/image/gateways/mastercard.png' },
  { key: 'visa', name: 'Visa', imagePath: '/image/gateways/visa.png' }
];
