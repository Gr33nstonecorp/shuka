export default function PrivacyPage() {
  return (
    <main style={pageStyle}>
      <h1>Privacy Policy</h1>

      <p><strong>Effective Date:</strong> March 25, 2026</p>

      <p>
        This Privacy Policy explains how Gr33nstonecorp ("Company", "we", "us")
        collects, uses, and protects information in connection with ShukAI.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Account information such as email address</li>
        <li>Purchase requests, quote activity, vendor selections, and workflow data</li>
        <li>Subscription and billing information processed through Stripe</li>
        <li>Usage and diagnostic information related to the platform</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>To operate and provide the Service</li>
        <li>To generate supplier and procurement workflows</li>
        <li>To manage billing and subscriptions</li>
        <li>To improve features, reliability, and performance</li>
        <li>To communicate with users about service-related matters</li>
      </ul>

      <h2>3. Third-Party Providers</h2>
      <p>
        We use third-party service providers such as Supabase for infrastructure and data storage,
        and Stripe for payment processing. These providers may process information on our behalf.
      </p>

      <h2>4. Data Ownership</h2>
      <p>
        You retain ownership of the data you submit to the Service. We use that data solely
        to provide, maintain, and improve the Service.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We take reasonable steps to protect data, but no system can guarantee absolute security.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain data for as long as necessary to operate the Service, comply with legal obligations,
        resolve disputes, and enforce agreements.
      </p>

      <h2>7. Your Choices</h2>
      <p>
        You may stop using the Service at any time. You may also contact us regarding account-related
        data questions.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update this Privacy Policy from time to time. Continued use of the Service after
        changes become effective constitutes acceptance of the updated policy.
      </p>

      <h2>9. Contact</h2>
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
