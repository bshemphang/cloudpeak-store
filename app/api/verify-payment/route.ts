import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateOrderStatus } from '../../../lib/orders-store';
import { logger } from '../../../lib/logger';

export async function POST(request: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    logger.error('Razorpay key secret is not configured in environment variables.');
    return NextResponse.json(
      { error: 'Razorpay configuration error.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      db_order_id,
    } = body;

    // Validate inputs
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !db_order_id) {
      logger.warn('Payment verification failed due to missing fields.');
      return NextResponse.json(
        { error: 'Missing required parameters for verification.' },
        { status: 400 }
      );
    }

    // Generate expected signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      logger.warn(`Signature verification failed for order ${db_order_id}. Signature mismatch.`);
      return NextResponse.json(
        { error: 'Payment verification failed: Signature mismatch.' },
        { status: 400 }
      );
    }

    // Update order status in the database/store with payment details
    logger.info(`Signature verified. Updating order status to prebook_paid for order ID: ${db_order_id}`);
    const updatedOrder = await updateOrderStatus(db_order_id, 'prebook_paid', {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      method: 'Razorpay Online Checkout',
    });

    if (!updatedOrder) {
      logger.error(`Order ${db_order_id} not found in store after successful verification.`);
      return NextResponse.json(
        { error: 'Order not found, but payment was verified.' },
        { status: 404 }
      );
    }

    // Send payment confirmation email!
    try {
      const { sendEmail } = await import('../../../lib/email-service');
      const { buildOrderPaidTemplate } = await import('../../../lib/email-templates');
      const emailHtml = buildOrderPaidTemplate(updatedOrder);
      await sendEmail({
        to: updatedOrder.customer.email,
        subject: `Payment Confirmed - Order #${updatedOrder.id} 🏔️`,
        html: emailHtml,
      });
    } catch (emailErr) {
      logger.error('Failed to send payment confirmation email:', emailErr);
    }

    logger.info(`Successfully processed payment and updated order: ${db_order_id}`);
    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    logger.error('Error during payment verification:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error during verification.' },
      { status: 500 }
    );
  }
}
