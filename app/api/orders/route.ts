import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, adminAuthErrorMessage } from '../../../lib/admin-auth';
import { getAllOrders, saveOrder } from '../../../lib/orders-store';
import { buildOrder, validateCustomerDetails, validateOrderItems } from '../../../lib/order-utils';
import type { CreateOrderPayload } from '../../../types/order';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderPayload;

    const itemsError = validateOrderItems(body.items ?? []);
    if (itemsError) return NextResponse.json({ error: itemsError }, { status: 400 });

    const customerError = validateCustomerDetails(body.customer);
    if (customerError) return NextResponse.json({ error: customerError }, { status: 400 });

    const computedSubtotal = body.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (computedSubtotal !== body.subtotal) {
      return NextResponse.json({ error: 'Order total mismatch. Please refresh and try again.' }, { status: 400 });
    }

    const order = buildOrder(body);
    await saveOrder(order);

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to place order. Please try again.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: adminAuthErrorMessage(auth) }, { status: 401 });
  }

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders.' }, { status: 500 });
  }
}
