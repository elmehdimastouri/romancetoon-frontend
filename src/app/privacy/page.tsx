import { Metadata } from 'next';
import Link from 'next/link';
import { Lock, ArrowLeft, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'RomanceToon privacy policy details how we collect, store, and protect user data and respect user privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back to Home */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-rose-soft transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="rounded-3xl border border-surface-border bg-surface p-8 sm:p-12 shadow-xl">
        <div className="flex items-center gap-3 pb-6 border-b border-surface-border">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-accent/15 text-rose-accent ring-1 ring-rose-accent/30">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              Privacy Policy
            </h1>
            <p className="text-xs text-text-dim mt-0.5">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6 text-sm text-text-muted leading-relaxed">
          <p>
            At <strong>RomanceToon</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), we value your privacy and are committed to protecting the personal data and browsing choices of our users. This Privacy Policy describes how information is collected, used, and safeguarded when you visit our website.
          </p>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            1. Information We Collect
          </h2>
          <p>
            We adhere to data minimization principles. We do not require account registration or collect sensitive personal identifiers:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Client-Side Local Storage:</strong> We utilize your browser&apos;s HTML5 LocalStorage to save your personal preferences, including <em>Saved Bookmarks</em> and <em>Reading History</em>. This data remains entirely on your personal device and is not transmitted or sold to our servers.
            </li>
            <li>
              <strong>Server Log Data:</strong> Like most web platforms, our servers and edge CDN networks (Cloudflare) automatically log standard technical data such as your IP address, browser type, referring URL, operating system, and access timestamps for DDoS mitigation, performance caching, and security analysis.
            </li>
            <li>
              <strong>Cookies:</strong> RomanceToon uses minimal technical cookies necessary for security and cache verification. We do not use intrusive cross-site tracking cookies.
            </li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            2. How We Use Collected Data
          </h2>
          <p>
            Technical information gathered is used exclusively to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and optimize fast vertical image delivery through our Cloudflare edge network.</li>
            <li>Protect our platform against bot abuse, spam requests, and denial-of-service attacks.</li>
            <li>Understand aggregate traffic trends to enhance reader performance and navigation.</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            3. Third-Party Infrastructure & CDN Providers
          </h2>
          <p>
            We use trusted third-party providers including <strong>Cloudflare</strong> for reverse proxy, DNS resolution, and Content Delivery Network (CDN) image storage. These providers operate under stringent privacy and security standards and process network data in accordance with their respective privacy disclosures.
          </p>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            4. GDPR & CCPA Rights (Privacy Rights)
          </h2>
          <p>
            Depending on your location (including the European Economic Area, United Kingdom, or California), you may have specific statutory privacy rights:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The right to know what personal data is processed and request deletion.</li>
            <li>The right to opt out of the sale or sharing of personal data (RomanceToon <strong>does not sell</strong> user data).</li>
            <li>The right to non-discrimination for exercising your privacy choices.</li>
          </ul>
          <p>
            Because bookmark and history data resides locally in your browser, you can permanently erase this data at any time by clearing your browser cache or clicking &ldquo;Clear History&rdquo; on our{' '}
            <Link href="/library" className="text-rose-soft hover:underline">
              Library page
            </Link>.
          </p>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            5. Children&apos;s Privacy (COPPA Compliance)
          </h2>
          <p>
            RomanceToon does not knowingly solicit or collect personal information from children under the age of 13. If you believe a child has provided us with personal data, please contact us immediately so we can remove such records.
          </p>

          <div className="rounded-2xl border border-surface-border bg-surface-card p-4 flex items-start gap-3 mt-6">
            <Shield className="w-5 h-5 text-rose-soft shrink-0 mt-0.5" />
            <p className="text-xs text-text-dim">
              If you have any questions or data inquiries regarding this policy, please email us at{' '}
              <a href="mailto:privacy@romancetoon.com" className="text-rose-soft hover:underline">
                privacy@romancetoon.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
