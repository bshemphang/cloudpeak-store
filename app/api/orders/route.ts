import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, adminAuthErrorMessage } from '../../../lib/admin-auth';
import { getAllOrders, saveOrder } from '../../../lib/orders-store';
import { buildOrder, validateCustomerDetails, validateOrderItems } from '../../../lib/order-utils';
import type { CreateOrderPayload } from '../../../types/order';
import { logger } from '../../../lib/logger';

// IP-based Rate Limiter Store (In-Memory MVP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count++;
  if (record.count > RATE_LIMIT_COUNT) {
    return true;
  }
  return false;
}

function sanitize(str: string): string {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';

  // 1. Rate Limiting check
  if (checkRateLimit(ip)) {
    logger.warn(`Rate limit exceeded for IP: ${ip} on order placement.`);
    return NextResponse.json(
      { error: 'Too many orders placed from this connection. Please wait 15 minutes and try again.' },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as CreateOrderPayload;

    // 2. Input Sanitization
    if (body.customer) {
      body.customer.fullName = sanitize(body.customer.fullName);
      body.customer.phone = sanitize(body.customer.phone);
      body.customer.email = sanitize(body.customer.email);
      body.customer.address = sanitize(body.customer.address);
      body.customer.city = sanitize(body.customer.city);
      body.customer.state = sanitize(body.customer.state);
      body.customer.pincode = sanitize(body.customer.pincode);
      body.customer.notes = sanitize(body.customer.notes || '');
    }

    const itemsError = validateOrderItems(body.items ?? []);
    if (itemsError) {
      logger.warn(`Order validation failed (items): ${itemsError}`, { ip });
      return NextResponse.json({ error: itemsError }, { status: 400 });
    }

    const customerError = validateCustomerDetails(body.customer);
    if (customerError) {
      logger.warn(`Order validation failed (customer): ${customerError}`, { ip });
      return NextResponse.json({ error: customerError }, { status: 400 });
    }

    const computedSubtotal = body.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (computedSubtotal !== body.subtotal) {
      logger.warn(`Order subtotal mismatch: client ${body.subtotal} vs server ${computedSubtotal}`, { ip });
      return NextResponse.json({ error: 'Order total mismatch. Please refresh and try again.' }, { status: 400 });
    }

    const order = buildOrder(body);
    
    // Save order (wrapped with retry logic inside the store)
    await saveOrder(order);

    logger.info(`Successfully placed order: ${order.id}`, { orderId: order.id, ip });
    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    logger.error('Failed to process order placement API call.', err, { ip });
    return NextResponse.json({ error: 'Failed to place order. Please try again.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    logger.warn('Unauthorized attempt to access all orders API.');
    return NextResponse.json({ error: adminAuthErrorMessage(auth) }, { status: 401 });
  }

  try {
    const orders = await getAllOrders();
    logger.info(`Admin fetched ${orders.length} orders.`);
    return NextResponse.json({ orders });
  } catch (err) {
    logger.error('Failed to fetch orders for admin.', err);
    return NextResponse.json({ error: 'Failed to fetch orders.' }, { status: 500 });
  }
}
