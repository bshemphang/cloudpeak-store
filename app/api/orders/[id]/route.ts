import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, adminAuthErrorMessage } from '../../../../lib/admin-auth';
import { getOrderById, updateOrderStatus } from '../../../../lib/orders-store';
import type { OrderStatus } from '../../../../types/order';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const order = await getOrderById(id);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order.' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = checkAdminAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ error: adminAuthErrorMessage(auth) }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const status = body.status as OrderStatus;
    const valid: OrderStatus[] = ['pending_prebook', 'prebook_paid', 'confirmed', 'cancelled'];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order = await updateOrderStatus(id, status);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Failed to update order.' }, { status: 500 });
  }
}
