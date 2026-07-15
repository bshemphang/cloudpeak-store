import PolicyLayout from '../../components/PolicyLayout';
import { SITE } from '../../lib/site';

export const metadata = {
  title: 'Terms & Conditions | Cloudpeak',
  description: 'Cloudpeak platform terms and conditions, purchasing agreements, print-on-demand details, and liability rules.',
};

export default function TermsAndConditionsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      subtitle="Rules and guidelines for using the Cloudpeak platform."
    >
      <section className="space-y-4">
        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing or using the {SITE.name} website (located at <a href="https://cloudpeak.in">cloudpeak.in</a>) 
          or placing an order through our digital channels, you agree to be bound by these Terms &amp; Conditions 
          and all applicable laws in India. If you do not agree to all of these terms, you are prohibited from 
          using this site.
        </p>
      </section>

      <section className="space-y-4">
        <h2>2. Use of Site &amp; Services</h2>
        <p>
          You must be at least 18 years old or visiting the site under the supervision of a parent or guardian. 
          We grant you a limited, non-transferable, and revocable license to use our website for personal, 
          non-commercial shopping purposes only.
        </p>
        <p>
          Any commercial use, scraping, copying of source assets, or unauthorized access to our administrative 
          dashboards is strictly prohibited and may result in legal action or termination of your account access.
        </p>
      </section>

      <section className="space-y-4">
        <h2>3. Intellectual Property</h2>
        <p>
          All content on this website, including text, graphics, designs, logos, images, typography, and site code, 
          is the exclusive property of {SITE.name} or our content suppliers and is protected by Indian and 
          international copyright, trademark, and intellectual property laws.
        </p>
        <p>
          You may not reproduce, distribute, display, sell, lease, transmit, or create derivative works from any 
          portion of this site unless explicitly authorized by us in writing.
        </p>
      </section>

      <section className="space-y-4">
        <h2>4. Product Info &amp; Pricing</h2>
        <p>
          While we strive for absolute accuracy, typographical errors, pricing inaccuracies, or stock descriptions 
          may occur. We reserve the right to correct any errors, inaccuracies, or omissions, and to change or 
          update information or cancel orders if any information on the site is inaccurate at any time without prior 
          notice (including after you have submitted your order).
        </p>
        <p>
          All prices listed on the site are in Indian Rupees (INR) and are inclusive of standard local taxes unless 
          stated otherwise.
        </p>
      </section>

      <section className="space-y-4">
        <h2>5. Order Production &amp; Fulfilment</h2>
        <p>
          {SITE.name} manages the design, production, and shipment of products through our local manufacturing and logistics networks.
        </p>
        <ul>
          <li>
            <strong>Production:</strong> Apparel items are processed and prepared for shipping immediately after payment confirmation.
          </li>
          <li>
            <strong>Delivery Estimates:</strong> Shipping times displayed are estimates. Sourcing, manufacturing, and shipping are managed in coordination with logistics networks, which may occasionally cause delays.
          </li>
          <li>
            <strong>Cancellations:</strong> Once an order is processed and enters the shipping phase, it cannot be canceled or altered.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2>6. Payments &amp; Security</h2>
        <p>
          We accept payments through standard credit/debit cards, UPI, Net Banking, and authorized digital wallets 
          processed securely by third-party payment gateways. We do not store or process your credit/debit card numbers 
          directly. You agree to provide current, complete, and accurate purchase and account information for all 
          purchases made at our store.
        </p>
      </section>

      <section className="space-y-4">
        <h2>7. Returns, Exchanges, &amp; Refunds</h2>
        <p>
          All returns, exchanges, and refunds are governed strictly by our 
          <a href="/return-policy"> Return &amp; Refund Policy</a>. Please inspect your goods upon arrival and report 
          any defective items within 48 hours.
        </p>
      </section>

      <section className="space-y-4">
        <h2>8. Limitation of Liability</h2>
        <p>
          In no event shall {SITE.name}, its directors, officers, employees, or partners be liable for any indirect, 
          incidental, punitive, or consequential damages arising from your use of the website or products purchased 
          herein. Our total liability for any claim shall not exceed the price of the individual product purchased.
        </p>
      </section>

      <section className="space-y-4">
        <h2>9. Governing Law</h2>
        <p>
          These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India. 
          Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction 
          of the courts in India.
        </p>
      </section>

      <section className="space-y-4">
        <h2>10. Modifications to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to update, change, or replace any part of these Terms &amp; 
          Conditions by posting updates and changes to our website. It is your responsibility to check our website 
          periodically for changes. Your continued use of or access to our website following the posting of any 
          changes constitutes acceptance of those changes.
        </p>
      </section>

      <section className="space-y-4">
        <h2>11. Contact Information</h2>
        <p>
          Questions about the Terms &amp; Conditions should be sent to us at:
          <br />
          <strong>{SITE.name} Support</strong>
          <br />
          Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <br />
          Collab Inquiries: <a href={`mailto:${SITE.collabEmail}`}>{SITE.collabEmail}</a>
          <br />
          HQ: {SITE.location}
          <br />
          Last updated: {SITE.lastPolicyUpdate}
        </p>
      </section>
    </PolicyLayout>
  );
}
