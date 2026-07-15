import PolicyLayout from '../../components/PolicyLayout';
import { SITE } from '../../lib/site';

export const metadata = {
  title: 'Privacy Policy | Cloudpeak',
  description: 'How Cloudpeak collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="Your privacy matters. Here's how we handle your data."
    >
      <section className="space-y-4">
        <h2>1. Introduction</h2>
        <p>
          Welcome to {SITE.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We operate an e-commerce
          platform based in {SITE.location}, offering streetwear, apparel,
          footwear, and lifestyle products across India.
        </p>
        <p>
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you visit our website, place an order, subscribe to our newsletter, or contact us via
          WhatsApp or email. By using our services, you agree to the practices described in this policy.
        </p>
      </section>

      <section className="space-y-4">
        <h2>2. Information We Collect</h2>
        <h3>Information you provide directly</h3>
        <ul>
          <li>Full name, delivery address, city, state, and PIN code</li>
          <li>Phone number and email address</li>
          <li>Order details, including products, sizes, and quantities</li>
          <li>Payment-related information (processed securely by third-party payment gateways — we do not store full card details)</li>
          <li>Communications you send us via WhatsApp, email, or contact forms</li>
          <li>Newsletter subscription email address</li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li>Device type, browser, operating system, and IP address</li>
          <li>Pages visited, time spent, and referral source</li>
          <li>Cookies and similar tracking technologies (see Section 8)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process, fulfil, and deliver your orders across India</li>
          <li>Communicate order confirmations, shipping updates, and customer support responses</li>
          <li>Coordinate production and shipping with our trusted logistics and manufacturing partners</li>
          <li>Process returns, refunds, and exchanges in accordance with our Return Policy</li>
          <li>Send promotional emails and updates (only if you have opted in; you may unsubscribe at any time)</li>
          <li>Improve our website, product catalogue, and customer experience</li>
          <li>Detect and prevent fraud, abuse, or unauthorised transactions</li>
          <li>Comply with applicable Indian laws and regulations</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2>4. Order Fulfillment</h2>
        <p>
          {SITE.name} manages product production and fulfillment. Some products are manufactured in collaboration with our manufacturing partners, while others are shipped directly from our warehouse.
        </p>
        <p>
          To fulfil your order, we share only the information necessary with our logistics and production partners — typically your name, delivery address, phone number, product specifications, and order reference. These partners are required to use your data solely for order fulfilment.
        </p>
      </section>

      <section className="space-y-4">
        <h2>5. Third-Party Service Providers</h2>
        <p>We work with trusted third parties who may process data on our behalf, including:</p>
        <ul>
          <li><strong>Payment processors</strong> — to handle secure online transactions (UPI, cards, net banking)</li>
          <li><strong>Shipping carriers</strong> — Delhivery, Blue Dart, India Post, and other pan-India logistics partners</li>
          <li><strong>Manufacturing partners</strong> — for apparel production</li>
          <li><strong>Warehousing &amp; fulfillment centers</strong> — for direct-to-customer dispatch of select products</li>
          <li><strong>Analytics providers</strong> — to understand site traffic and improve performance</li>
          <li><strong>WhatsApp / Meta</strong> — when you initiate contact or place orders via WhatsApp</li>
        </ul>
        <p>
          Each provider maintains its own privacy policy. We encourage you to review those policies
          where applicable. We do not sell your personal information to third parties.
        </p>
      </section>

      <section className="space-y-4">
        <h2>6. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to fulfil the purposes outlined
          in this policy, including satisfying legal, accounting, and tax obligations under Indian law.
          Order records are typically retained for a minimum of seven (7) years for compliance purposes.
          Marketing data is retained until you unsubscribe or request deletion.
        </p>
      </section>

      <section className="space-y-4">
        <h2>7. Your Rights</h2>
        <p>
          Under applicable Indian data protection laws, including the Digital Personal Data Protection
          Act, 2023 (DPDP Act), you may have the right to:
        </p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate or incomplete data</li>
          <li>Request erasure of your data, subject to legal retention requirements</li>
          <li>Withdraw consent for marketing communications at any time</li>
          <li>Lodge a grievance with our designated contact point</li>
        </ul>
        <p>
          To exercise any of these rights, email us at{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the subject line
          &quot;Data Privacy Request.&quot; We will respond within 30 days.
        </p>
      </section>

      <section className="space-y-4">
        <h2>8. Cookies &amp; Tracking</h2>
        <p>
          Our website uses cookies and similar technologies to maintain your shopping cart session,
          remember preferences, and analyse site traffic. You can control cookies through your browser
          settings. Disabling cookies may affect certain site features, including cart functionality.
        </p>
      </section>

      <section className="space-y-4">
        <h2>9. Children&apos;s Privacy</h2>
        <p>
          Our services are not directed to individuals under the age of 18. We do not knowingly
          collect personal information from minors. If you believe a minor has provided us with
          personal data, please contact us and we will promptly delete it.
        </p>
      </section>

      <section className="space-y-4">
        <h2>10. Security</h2>
        <p>
          We implement reasonable technical and organisational measures to protect your personal
          information against unauthorised access, alteration, disclosure, or destruction. However,
          no method of transmission over the internet is 100% secure, and we cannot guarantee
          absolute security.
        </p>
      </section>

      <section className="space-y-4">
        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated &quot;Last updated&quot; date. Continued use of our services after changes
          constitutes acceptance of the revised policy.
        </p>
      </section>

      <section className="space-y-4">
        <h2>12. Contact Us</h2>
        <p>
          <strong>{SITE.name}</strong><br />
          {SITE.location}<br />
          Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
          Grievance Officer: cloudpeakindia@gmail.com
        </p>
      </section>
    </PolicyLayout>
  );
}
