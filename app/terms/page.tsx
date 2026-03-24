export default function TermsPage() {
  return (
    <main style={pageStyle}>
      <h1>Terms of Service</h1>

      <p><strong>Effective Date:</strong> March 25, 2026</p>

      <p>
        These Terms of Service ("Terms") govern your access to and use of ShukAI,
        a procurement software platform operated by Gr33nstonecorp ("Company", "we", "us").
        By using the Service, you agree to these Terms.
      </p>

      <h2>1. Use of the Service</h2>
      <p>
        ShukAI allows users to create procurement requests, review supplier options,
        compare quotes, and manage purchasing workflows.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your login credentials
        and for all activity under your account.
      </p>

      <h2>3. Subscription and Billing</h2>
      <p>
        Certain features require a paid subscription. Billing is handled through third-party
        processors such as Stripe. Fees are non-refundable unless otherwise stated.
      </p>

      <h2>4. AI and Supplier Information Disclaimer</h2>
      <p>
        ShukAI may generate supplier recommendations, pricing estimates, and other outputs.
        These are for informational purposes only and may be inaccurate. We do not guarantee
        supplier availability, pricing, product quality, or fulfillment.
      </p>

      <h2>5. Customer Responsibility</h2>
      <p>
        You are solely responsible for your procurement decisions, approvals, purchases,
        and vendor relationships.
      </p>

      <h2>6. Prohibited Conduct</h2>
      <ul>
        <li>Attempting unauthorized access to the platform</li>
        <li>Using the Service for unlawful purposes</li>
        <li>Interfering with system performance or integrity</li>
        <li>Misusing automated features or generated outputs</li>
      </ul>

      <h2>7. Termination</h2>
      <p>
        We may suspend or terminate access to the Service if you violate these Terms.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        The Service is provided on an "as is" and "as available" basis, without warranties
        of any kind, express or implied.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Gr33nstonecorp shall not be liable for
        indirect, incidental, special, consequential, or punitive damages, or for lost profits,
        lost data, or business interruption.
      </p>

      <p>
        Our total liability shall not exceed the amount you paid to us in the preceding
        3 months.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of New York, without regard to
        conflict of law principles.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Service after
        changes become effective constitutes acceptance of the updated Terms.
      </p>

      <h2>12. Contact</h2>
      <p>Email: Gr33nstonecorp@gmail.com</p>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "24px",
  lineHeight: 1.7,
};
