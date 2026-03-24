export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1>Privacy Policy</h1>

      <p>Effective Date: [ADD DATE]</p>

      <h2>1. Data We Collect</h2>
      <ul>
        <li>Email address</li>
        <li>Purchase request data</li>
        <li>Usage analytics</li>
      </ul>

      <h2>2. How We Use Data</h2>
      <p>
        We use your data to operate the platform, generate supplier quotes, and
        improve the service.
      </p>

      <h2>3. Third Parties</h2>
      <p>
        We use third-party providers such as Supabase and Stripe to store data
        and process payments.
      </p>

      <h2>4. Data Security</h2>
      <p>
        We implement reasonable security measures but cannot guarantee absolute security.
      </p>

      <h2>5. Contact</h2>
      <p>Email: support@shukai.co</p>
    </main>
  );
}
