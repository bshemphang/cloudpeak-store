import PolicyLayout from '../../components/PolicyLayout';
import { SITE } from '../../lib/site';

export const metadata = {
  title: 'Return & Refund Policy | Cloudpeak',
  description: 'Cloudpeak return, exchange, and refund policy for streetwear and apparel orders.',
};

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout
      title="Return & Refund Policy"
      subtitle="Fair, transparent returns for every Cloudpeak order."
    >
      <section className="space-y-4">
        <h2>1. Overview</h2>
        <p>
          At {SITE.name}, we stand behind the quality of every product we sell — whether it is
          premium apparel, footwear, or curated streetwear. We want you to
          shop with confidence. If something isn&apos;t right, we&apos;re here to make it right.
        </p>
        <p>
          This Return &amp; Refund Policy applies to all purchases made through our website or via
          official WhatsApp ordering channels. Please read this policy carefully before initiating
          a return or exchange.
        </p>
      </section>

      <section className="space-y-4">
        <h2>2. Return Window</h2>
        <p>
          You may return eligible items within <strong>15 days</strong> of the date of delivery for
          a refund or exchange. The return window begins on the day your order is marked as
          delivered by the courier.
        </p>
        <p>
          To be eligible, items must be unused, unworn, unwashed, and in their original condition
          with all tags, labels, and packaging intact.
        </p>
      </section>

      <section className="space-y-4">
        <h2>3. Custom &amp; Special Edition Products</h2>
        <p>
          Custom items are produced specifically for you after your order is placed. Because of this
          made-to-order nature, the following conditions apply:
        </p>
        <ul>
          <li>
            <strong>Standard apparel items</strong> (pre-designed Cloudpeak graphics, no custom text):
            eligible for return within 15 days if unworn and in original condition.
          </li>
          <li>
            <strong>Custom / personalised items</strong> (custom names, text, or uploaded
            designs): <strong>not eligible for return or exchange</strong> unless the item is
            defective, misprinted, or materially different from what was ordered.
          </li>
          <li>
            Slight colour variations between screen preview and printed product are normal in apparel
            production and do not qualify as defects.
          </li>
        </ul>
        <p>
          If you receive a custom item with a printing defect, incorrect size, or wrong design, contact
          us within 48 hours of delivery with clear photos. We will arrange a free replacement or
          full refund at no cost to you.
        </p>
      </section>

      <section className="space-y-4">
        <h2>4. Footwear &amp; Select Accessories</h2>
        <p>
          Select footwear, accessories, and lifestyle items are subject to the same 15-day return window, provided
          they meet the condition requirements above.
        </p>
        <ul>
          <li>Footwear must be tried indoors only — shoes showing outdoor wear are not eligible</li>
          <li>Original shoe box and all included accessories must be returned</li>
          <li>Returns may require shipping to a designated hub; we will provide a prepaid label where applicable</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2>5. Non-Returnable Items</h2>
        <p>The following items cannot be returned or exchanged:</p>
        <ul>
          <li>Custom or personalised products (unless defective or incorrect)</li>
          <li>Items marked as final sale or clearance</li>
          <li>Undergarments, socks, and intimate apparel (for hygiene reasons)</li>
          <li>Items returned after the 15-day window</li>
          <li>Items that show signs of wear, washing, alteration, or damage caused by the customer</li>
          <li>Items returned without original tags, packaging, or proof of purchase</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2>6. How to Initiate a Return</h2>
        <ol>
          <li>
            Contact us within 15 days of delivery via WhatsApp or email at{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </li>
          <li>
            Provide your order number, item(s) to return, and reason for return
          </li>
          <li>
            Include clear photos of the item and packaging (required for defect claims)
          </li>
          <li>
            Our team will review your request and respond within 2 business days with return
            instructions and, where applicable, a prepaid return label or pickup arrangement
          </li>
          <li>
            Pack the item securely in its original packaging and dispatch as instructed
          </li>
        </ol>
        <p>
          <strong>Do not send returns without prior approval.</strong> Unauthorised returns may not
          be processed.
        </p>
      </section>

      <section className="space-y-4">
        <h2>7. Refunds</h2>
        <p>
          Once we receive and inspect your returned item, we will notify you of the approval or
          rejection of your refund within 3 business days.
        </p>
        <ul>
          <li>
            <strong>Approved refunds</strong> are processed to your original payment method within
            5–10 business days. Bank processing times may vary.
          </li>
          <li>
            <strong>WhatsApp / UPI orders</strong> are refunded to the UPI ID or bank account used
            for payment.
          </li>
          <li>
            Original shipping charges are non-refundable unless the return is due to our error
            (wrong item, defect, or non-delivery).
          </li>
          <li>
            Return shipping costs are borne by the customer unless the return is due to a Cloudpeak
            error or defective product.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2>8. Exchanges</h2>
        <p>
          We offer exchanges for a different size or colour of the same product, subject to
          availability. To request an exchange, follow the return process above and specify the
          desired replacement. If the replacement item is priced higher, you will be charged the
          difference. If lower, we will refund the difference.
        </p>
        <p>
          Exchanges for custom items are not available. Exchanges for standard items are processed within 7–14 business days after we receive the original item.
        </p>
      </section>

      <section className="space-y-4">
        <h2>9. Damaged, Defective, or Wrong Items</h2>
        <p>
          If your order arrives damaged, defective, or incorrect, contact us within{' '}
          <strong>48 hours</strong> of delivery with:
        </p>
        <ul>
          <li>Your order number</li>
          <li>Photos of the damaged/incorrect item</li>
          <li>Photos of the packaging and shipping label</li>
        </ul>
        <p>
          We will arrange a free replacement or full refund, including any shipping costs. No return
          shipping fee will be charged for items that are our fault.
        </p>
      </section>

      <section className="space-y-4">
        <h2>10. Lost or Undelivered Orders</h2>
        <p>
          If your tracking shows delivered but you have not received your package, contact us within
          48 hours. We will investigate with the courier and either reship your order or issue a
          full refund if the package cannot be located within 10 business days of the investigation.
        </p>
      </section>

      <section className="space-y-4">
        <h2>11. Cancellations</h2>
        <p>
          Orders may be cancelled within 2 hours of placement, provided
          the order has not yet been dispatched. Custom orders may enter production quickly and may not be
          cancellable once production has begun. Contact us immediately via WhatsApp for the fastest
          cancellation processing.
        </p>
      </section>

      <section className="space-y-4">
        <h2>12. Contact Us</h2>
        <p>
          <strong>{SITE.name} — Returns &amp; Support</strong><br />
          {SITE.location}<br />
          Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
          WhatsApp: Available via our website chat button
        </p>
      </section>
    </PolicyLayout>
  );
}
