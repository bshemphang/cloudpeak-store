import { Order } from '../types/order';

const emailStyles = `
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f7f6f2; color: #0A1628; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2ddd4; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
  .header { background-color: #0A1628; padding: 30px; text-align: center; }
  .header h1 { font-family: Impact, "Bebas Neue", sans-serif; font-size: 36px; color: #D4A843; margin: 0; letter-spacing: 0.05em; text-transform: uppercase; }
  .header p { color: rgba(255,255,255,0.7); font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; margin: 8px 0 0 0; font-weight: bold; }
  .content { padding: 30px; }
  .content h2 { font-size: 20px; margin-top: 0; color: #0A1628; text-transform: uppercase; border-bottom: 2px solid #e2ddd4; padding-bottom: 10px; }
  .content p { font-size: 14px; line-height: 1.6; color: rgba(10, 22, 40, 0.85); }
  .btn { display: inline-block; background-color: #0A1628; color: #D4A843 !important; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; text-decoration: none; padding: 14px 28px; border-radius: 4px; margin: 15px 0; text-align: center; }
  .footer { background-color: #f4f1eb; padding: 20px 30px; text-align: center; font-size: 11px; color: rgba(10, 22, 40, 0.5); border-top: 1px solid #e2ddd4; }
  .footer a { color: #B8922F; text-decoration: underline; }
  .item-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  .item-table th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(10, 22, 40, 0.5); text-align: left; padding-bottom: 8px; border-bottom: 1px solid #e2ddd4; }
  .item-table td { padding: 12px 0; border-bottom: 1px solid #f4f1eb; font-size: 13px; }
  .total-row { font-weight: bold; border-top: 2px solid #e2ddd4; font-size: 15px; }
  .badge { display: inline-block; padding: 4px 10px; font-size: 10px; font-weight: bold; text-transform: uppercase; tracking: 0.1em; border-radius: 3px; }
  .badge-pending { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
  .badge-paid { background-color: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
  .badge-cancelled { background-color: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
`;

function buildEmailHtml(title: string, body: string, footerNote?: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Cloudpeak</h1>
      <p>Premium Streetwear</p>
    </div>
    <div class="content">
      ${body}
    </div>
    <div class="footer">
      <p>This is a transaction email regarding your account or order at Cloudpeak.</p>
      <p>© ${new Date().getFullYear()} Cloudpeak. India.</p>
      <p><a href="https://cloudpeak.in/return-policy">Return Policy</a> · <a href="https://cloudpeak.in/terms-and-conditions">Terms of Service</a></p>
      ${footerNote ? `<p style="margin-top:15px; font-style:italic;">${footerNote}</p>` : ''}
    </div>
  </div>
</body>
</html>`;
}

export function buildOrderPlacedTemplate(order: Order, baseUrl: string): string {
  const itemRows = order.items
    .map(
      (item) => `
    <tr>
      <td>
        <strong>${item.name}</strong><br>
        <span style="font-size:11px; color:rgba(10,22,40,0.5)">${item.color || 'Default'} / ${item.size || 'Standard'}</span>
      </td>
      <td style="text-align:center;">${item.quantity}</td>
      <td style="text-align:right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>`
    )
    .join('');

  const body = `
    <h2>Order Placed (#${order.id})</h2>
    <p>Hi ${order.customer.fullName},</p>
    <p>Thank you for placing your order at Cloudpeak. We have received your order details, but <strong>your online payment is currently pending</strong>.</p>
    
    <div style="margin: 20px 0; text-align: center;">
      <a href="${baseUrl}/order-confirmation/${order.id}" class="btn">Complete Online Payment</a>
    </div>
    
    <h3>Order Summary</h3>
    <table class="item-table">
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
        <tr class="total-row">
          <td colspan="2">Amount Due</td>
          <td style="text-align:right; color:#B8922F;">₹${order.subtotal.toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>
    
    <p><strong>Shipping Details:</strong><br>
    ${order.customer.fullName}<br>
    ${order.customer.address}, ${order.customer.city}<br>
    ${order.customer.state} - ${order.customer.pincode}<br>
    Phone: ${order.customer.phone}</p>
    
    <p>Your order items will be held for a limited time. Please complete the online payment to confirm the purchase.</p>
  `;

  return buildEmailHtml(`Order Placed - ${order.id}`, body);
}

export function buildOrderPaidTemplate(order: Order): string {
  const itemRows = order.items
    .map(
      (item) => `
    <tr>
      <td>
        <strong>${item.name}</strong><br>
        <span style="font-size:11px; color:rgba(10,22,40,0.5)">${item.color || 'Default'} / ${item.size || 'Standard'}</span>
      </td>
      <td style="text-align:center;">${item.quantity}</td>
      <td style="text-align:right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>`
    )
    .join('');

  const body = `
    <h2>Payment Confirmed! (#${order.id})</h2>
    <p>Hi ${order.customer.fullName},</p>
    <p>Excellent news! We have successfully verified your payment of <strong>₹${order.subtotal.toLocaleString('en-IN')}</strong> via Razorpay. Your order is now officially confirmed and sent to our team for processing and fulfillment!</p>
    
    <p><span class="badge badge-paid">Paid via Razorpay</span></p>
    
    <h3>Confirmed Order Details</h3>
    <table class="item-table">
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
        <tr class="total-row">
          <td colspan="2">Total Paid</td>
          <td style="text-align:right; color:#065f46;">₹${order.subtotal.toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>
    
    <p><strong>Shipping Address:</strong><br>
    ${order.customer.fullName}<br>
    ${order.customer.address}, ${order.customer.city}<br>
    ${order.customer.state} - ${order.customer.pincode}</p>
    
    <p>We'll send you another email with your tracking details as soon as the package is handed over to our courier partners.</p>
  `;

  return buildEmailHtml(`Payment Confirmed for Order ${order.id}`, body);
}

export function buildOrderCancelledTemplate(order: Order): string {
  const body = `
    <h2>Order Cancelled (#${order.id})</h2>
    <p>Hi ${order.customer.fullName},</p>
    <p>Your order <strong>#${order.id}</strong> has been cancelled and marked as rejected.</p>
    
    <p><span class="badge badge-cancelled">Cancelled / Refunded</span></p>
    
    ${
      order.customer.payment?.paymentId
        ? `<p>Since payment was captured via Razorpay, we have automatically initiated a full refund of <strong>₹${order.subtotal.toLocaleString('en-IN')}</strong> to your original payment method (Razorpay Ref: <code>${order.customer.payment.paymentId}</code>). The money should reflect in your account within 5-7 business days.</p>`
        : '<p>Since no payment was completed for this order, no refund transaction was required.</p>'
    }
    
    <p>If you have any questions or did not intend to cancel this order, please contact our helpdesk at cloudpeakindia@gmail.com.</p>
  `;

  return buildEmailHtml(`Order Cancelled - ${order.id}`, body);
}

export function buildNewsletterWelcomeTemplate(email: string): string {
  const body = `
    <h2>Welcome to the Peak! 🏔️</h2>
    <p>Hi there,</p>
    <p>Thank you for subscribing to the Cloudpeak newsletter. You are now officially part of our community!</p>
    <p>Get ready for:</p>
    <ul>
      <li>Exclusive early access to streetwear collections and drops.</li>
      <li>Exclusive styling tips and brand collaborations.</li>
      <li>Culture updates, local designer highlights, and brand news.</li>
    </ul>
    <p>We are dedicated to crafting premium, visionary streetwear. Stay tuned — our next drop is coming sooner than you think!</p>
    
    <div style="margin: 20px 0; text-align: center;">
      <a href="https://cloudpeak.in/shop" class="btn">Browse Collection</a>
    </div>
  `;

  return buildEmailHtml('Welcome to the Cloudpeak Community!', body);
}
