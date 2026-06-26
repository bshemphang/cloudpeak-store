import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '../../../lib/subscribers-store';
import { sendEmail } from '../../../lib/email-service';
import { buildNewsletterWelcomeTemplate } from '../../../lib/email-templates';
import { logger } from '../../../lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    const { success, duplicate } = await addSubscriber(email);

    if (duplicate) {
      return NextResponse.json(
        { error: 'This email address is already subscribed!' },
        { status: 400 }
      );
    }

    if (success) {
      // Send simulated welcome email!
      try {
        const emailHtml = buildNewsletterWelcomeTemplate(email);
        await sendEmail({
          to: email,
          subject: 'Welcome to the Cloudpeak Community! 🏔️',
          html: emailHtml,
        });
      } catch (err) {
        logger.error('Failed to trigger simulated welcome email:', err);
      }

      return NextResponse.json(
        { success: true, message: 'Thank you for subscribing!' },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  } catch (err: any) {
    logger.error('Newsletter subscribe API exception:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
