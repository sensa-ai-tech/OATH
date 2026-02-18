import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen px-4 py-12 max-w-2xl mx-auto">
      <Link
        href="/"
        className="text-sm underline mb-8 inline-block"
        style={{ color: 'var(--color-text-muted)' }}
      >
        &larr; Back
      </Link>

      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Privacy Policy
      </h1>

      <div
        className="space-y-6 text-sm leading-relaxed"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            1. Data We Collect
          </h2>
          <p>
            Oath collects the following information to provide personalized
            guidance: email address, birth date and time, birth location
            (optional), and timezone. This data is used exclusively for
            generating your natal chart and daily fortune readings.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            2. How We Use Your Data
          </h2>
          <p>
            Your birth data is processed by our astrological and Bazi calculation
            engines to generate personalized content. We do not share, sell, or
            rent your personal information to third parties.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            3. Data Storage &amp; Security
          </h2>
          <p>
            Your data is stored securely on Supabase servers with row-level
            security (RLS) policies ensuring only you can access your own data.
            All API communications use HTTPS encryption.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            4. Account Deletion
          </h2>
          <p>
            You may request account deletion at any time from the Profile page.
            Upon request, your account enters a 30-day cooling period during
            which you can restore it. After 30 days, all personal data is
            permanently and irreversibly deleted.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            5. Offline Data
          </h2>
          <p>
            Oath may cache your recent fortune readings in your browser&apos;s local
            storage for offline access. This data remains on your device and is
            automatically purged after 7 days.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            6. Contact
          </h2>
          <p>
            For privacy-related inquiries, please contact us at
            privacy@oath-app.com.
          </p>
        </section>

        <p style={{ color: 'var(--color-text-muted)' }}>
          Last updated: February 2026
        </p>
      </div>
    </main>
  );
}
