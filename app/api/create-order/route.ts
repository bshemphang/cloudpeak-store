import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { logger } from '../../../lib/logger';

export async function POST(request: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    logger.error('Razorpay credentials are not configured in environment variables.');
    return NextResponse.json(
      { error: 'Razorpay payment gateway is not configured.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    // Validate amount
    if (typeof amount !== 'number' || amount < 100) {
      logger.warn(`Invalid order amount: ${amount}. Minimum amount is 100 paise.`);
      return NextResponse.json(
        { error: 'Amount must be at least 100 paise (₹1).' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    logger.info(`Creating Razorpay order for receipt: ${receipt}, amount: ${amount} paise`);

    const rzpOrder = await razorpay.orders.create({
      amount,
      currency,
      receipt,
    });

    logger.info(`Successfully created Razorpay order: ${rzpOrder.id}`);

    return NextResponse.json({
      order_id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    });
  } catch (error: any) {
    logger.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create Razorpay order.' },
      { status: 500 }
    );
  }
}
