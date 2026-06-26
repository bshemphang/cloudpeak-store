import { SITE } from './site';
import type { CreateOrderPayload, CustomerDetails, Order, OrderItem } from '../types/order';

export function generateOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CP-${stamp}-${rand}`;
}

export function calculatePrebookAmount(subtotal: number): number {
  return subtotal;
}

export function buildOrder(payload: CreateOrderPayload): Order {
  return {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    status: 'pending_prebook',
    customer: payload.customer,
    items: payload.items,
    subtotal: payload.subtotal,
    prebookAmount: payload.subtotal,
  };
}

export function formatPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith('91') && digits.length === 12) return digits;
  return digits;
}

export function generatePrebookMessageToCustomer(order: Order): string {
  const itemLines = order.items
    .map(
      (item) =>
        `• ${item.name}${item.color ? ` · ${item.color}` : ''}${item.size ? ` · ${item.size}` : ''} × ${item.quantity} — ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
    )
    .join('\n');

  return [
    `Hi ${order.customer.fullName}! 👋`,
    '',
    `Thank you for your ${SITE.name} order *#${order.id}*.`,
    '',
    '*Your items:*',
    itemLines,
    '',
    `*Order total:* ₹${order.subtotal.toLocaleString('en-IN')}`,
    '',
    'Your order is pending online payment via Razorpay. Once paid, your items will be confirmed and processed for shipping.',
    '',
    '— Team Cloudpeak',
  ].join('\n');
}

export function validateCustomerDetails(customer: CustomerDetails): string | null {
  if (!customer.fullName.trim()) return 'Full name is required.';
  if (!/^\d{10}$/.test(customer.phone.replace(/\D/g, '').slice(-10)))
    return 'Enter a valid 10-digit phone number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return 'Enter a valid email address.';
  if (!customer.address.trim()) return 'Delivery address is required.';
  if (!customer.city.trim()) return 'City is required.';
  if (!customer.state.trim()) return 'State is required.';
  if (!/^\d{6}$/.test(customer.pincode)) return 'Enter a valid 6-digit PIN code.';
  return null;
}

export function validateOrderItems(items: OrderItem[]): string | null {
  if (!items.length) return 'Your cart is empty.';
  for (const item of items) {
    if (!item.id || !item.name || item.quantity < 1 || item.price < 0)
      return 'Invalid cart items.';
  }
  return null;
}
