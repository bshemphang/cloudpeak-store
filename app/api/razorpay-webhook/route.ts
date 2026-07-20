import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getOrderById, updateOrderStatus } from '../../../lib/orders-store';
import { logger } from '../../../lib/logger';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error('Razorpay Webhook Secret is not configured in environment variables.');
    return NextResponse.json(
      { error: 'Webhook configuration error' },
      { status: 500 }
    );
  }

  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      logger.warn('Webhook request missing x-razorpay-signature header.');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      logger.warn('Webhook signature verification failed.');
      return NextResponse.json({ error: 'Signature mismatch' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    logger.info(`Received Razorpay Webhook Event: ${event.event}`);

    // Process order.paid event (contains order receipt & payment details)
    if (event.event === 'order.paid') {
      const orderEntity = event.payload?.order?.entity;
      const paymentEntity = event.payload?.payment?.entity;

      const dbOrderId = orderEntity?.receipt;
      const rzpOrderId = orderEntity?.id;
      const rzpPaymentId = paymentEntity?.id;
      const paymentMethod = paymentEntity?.method || 'online';

      if (!dbOrderId) {
        logger.warn(`Webhook order.paid payload is missing receipt (db_order_id). RzpOrderId: ${rzpOrderId}`);
        return NextResponse.json({ success: true, message: 'Missing receipt' });
      }

      const existingOrder = await getOrderById(dbOrderId);
      if (!existingOrder) {
        logger.error(`Webhook order.paid: Order ${dbOrderId} not found in store.`);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Skip if order is already processed as paid
      if (existingOrder.status === 'prebook_paid' || existingOrder.status === 'confirmed') {
        logger.info(`Webhook: Order ${dbOrderId} is already marked as ${existingOrder.status}. Skipping.`);
        return NextResponse.json({ success: true, message: 'Order already processed' });
      }

      logger.info(`Webhook verified. Updating order status to prebook_paid for order ID: ${dbOrderId}`);
      const updatedOrder = await updateOrderStatus(dbOrderId, 'prebook_paid', {
        paymentId: rzpPaymentId,
        orderId: rzpOrderId,
        method: `Razorpay Webhook (${paymentMethod})`,
      });

      if (updatedOrder) {
        try {
          const { sendEmail } = await import('../../../lib/email-service');
          const { buildOrderPaidTemplate } = await import('../../../lib/email-templates');
          const emailHtml = buildOrderPaidTemplate(updatedOrder);
          await sendEmail({
            to: updatedOrder.customer.email,
            subject: `Payment Confirmed - Order #${updatedOrder.id} 🏔️`,
            html: emailHtml,
          });
          logger.info(`Webhook successfully sent payment confirmation email for order ${dbOrderId}`);
        } catch (emailErr) {
          logger.error('Webhook failed to send payment confirmation email:', emailErr);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error('Error in Razorpay Webhook handler:', error);
    return NextResponse.json(
      { error: error?.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
