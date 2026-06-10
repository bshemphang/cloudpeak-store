import type { Order } from '../types/order';
import { formatPhoneForWhatsApp, generatePrebookMessageToCustomer } from './order-utils';

type CartItem = {
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

const WHATSAPP_NUMBER = '910000000000';

export function generateOrderMessage(cart: CartItem[], total: number): string {
  if (cart.length === 0) {
    return "Hi Cloudpeak! I'd like to know more about your latest drops.";
  }

  const itemLines = cart
    .map(
      (item) =>
        `• ${item.name}${item.color ? ` · ${item.color}` : ''}${item.size ? ` · ${item.size}` : ''} × ${item.quantity} — ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
    )
    .join('\n');

  return [
    "Hi Cloudpeak! I'd like to place an order:",
    '',
    itemLines,
    '',
    `*Total: ₹${total.toLocaleString('en-IN')}*`,
    '',
    'Please confirm availability and payment details. Thanks!',
  ].join('\n');
}

export function generateInquiryMessage(): string {
  return "Hi Cloudpeak! I'm interested in the latest drops. Can you help me out?";
}

export function getWhatsAppLink(message: string, phone?: string): string {
  const number = phone ? formatPhoneForWhatsApp(phone) : WHATSAPP_NUMBER;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getCustomerPrebookWhatsAppLink(order: Order): string {
  return getWhatsAppLink(generatePrebookMessageToCustomer(order), order.customer.phone);
}

export { WHATSAPP_NUMBER };
