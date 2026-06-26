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

    let refundData: any = null;
    if (status === 'cancelled') {
      const currentOrder = await getOrderById(id);
      if (currentOrder && currentOrder.customer?.payment?.paymentId && !currentOrder.customer.payment.refund) {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (keyId && keySecret) {
          try {
            const Razorpay = (await import('razorpay')).default;
            const razorpay = new Razorpay({
              key_id: keyId,
              key_secret: keySecret,
            });

            // Trigger Razorpay Refund
            const refund = await razorpay.payments.refund(currentOrder.customer.payment.paymentId, {
              amount: currentOrder.subtotal * 100, // full amount in paise
              notes: { reason: 'Order cancelled / rejected by admin' },
            });

            refundData = {
              refundId: refund.id,
              amount: Number(refund.amount ?? (currentOrder.subtotal * 100)) / 100,
              status: refund.status,
              createdAt: new Date().toISOString(),
            };
          } catch (refundErr: any) {
            console.error('Failed to trigger Razorpay refund:', refundErr);
            // Allow the status update to proceed even if refund fails (e.g. sandbox credentials error)
          }
        }
      }
    }

    const paymentUpdate = refundData ? { refund: refundData } : undefined;
    const order = await updateOrderStatus(id, status, paymentUpdate);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Send cancellation / refund confirmation email
    if (status === 'cancelled') {
      try {
        const { sendEmail } = await import('../../../../lib/email-service');
        const { buildOrderCancelledTemplate } = await import('../../../../lib/email-templates');
        const emailHtml = buildOrderCancelledTemplate(order);
        await sendEmail({
          to: order.customer.email,
          subject: `Order Cancelled - Refund Receipt #${order.id} ✕`,
          html: emailHtml,
        });
      } catch (emailErr) {
        console.error('Failed to send order cancellation email:', emailErr);
      }
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Failed to update order.' }, { status: 500 });
  }
}
