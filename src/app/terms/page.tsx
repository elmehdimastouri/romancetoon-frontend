import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowLeft, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the terms of service and usage conditions for RomanceToon webtoon reader platform.',
};

export default function TermsPage() {
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
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              Terms of Service
            </h1>
            <p className="text-xs text-text-dim mt-0.5">
              Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6 text-sm text-text-muted leading-relaxed">
          <p>
            Welcome to <strong>RomanceToon</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By accessing or using our website, services, and online manhwa reader platform located at romance toon domains, you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not use our website.
          </p>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            1. Acceptance of Terms & Eligibility
          </h2>
          <p>
            You must be at least 13 years of age to access RomanceToon. If you are under the age of majority in your jurisdiction, you must have the consent of your parent or legal guardian to use our platform. By continuing to use the service, you affirm that you meet these eligibility criteria.
          </p>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            2. Intellectual Property Rights & Content
          </h2>
          <p>
            All manhwa, webtoons, artwork, logos, and graphics displayed on RomanceToon are the property of their respective creators, publishers, and copyright owners. RomanceToon operates as a digital index and reader platform. We do not claim ownership over any serialized comics or third-party intellectual property hosted or indexed.
          </p>
          <p>
            For information regarding copyright concerns or to file a formal takedown notice, please consult our{' '}
            <Link href="/dmca" className="text-rose-soft hover:underline">
              DMCA & Copyright Policy
            </Link>.
          </p>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            3. Permitted Use & User Conduct
          </h2>
          <p>
            RomanceToon grants you a personal, non-exclusive, non-transferable, revocable license to access and read published webtoons for personal, non-commercial entertainment purposes. You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Engage in systematic scraping, automated data extraction, or mass downloading of reader images without prior written authorization.</li>
            <li>Attempt to probe, scan, or compromise the security or vulnerability of our servers, Cloudflare edge, or backend infrastructure.</li>
            <li>Use the platform in any way that violates applicable local, national, or international laws or regulations.</li>
            <li>Introduce malicious code, viruses, or disruptive scripts to the service.</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            4. Local Storage & Bookmarks
          </h2>
          <p>
            Features such as reading history and saved bookmarks are stored locally on your device via browser LocalStorage. RomanceToon does not guarantee permanent preservation of locally stored reading states if you clear your browser cache or browse in private mode.
          </p>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            5. Disclaimer of Warranties
          </h2>
          <p>
            RomanceToon is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, or uninterrupted availability.
          </p>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            6. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, RomanceToon, its operators, affiliates, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to, use of, or inability to access the platform.
          </p>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            7. Modifications to the Terms
          </h2>
          <p>
            We reserve the right to revise or replace these Terms at our sole discretion. Any modifications become effective immediately upon posting to this page with an updated effective date.
          </p>

          <div className="rounded-2xl border border-surface-border bg-surface-card p-4 flex items-start gap-3 mt-6">
            <ShieldAlert className="w-5 h-5 text-rose-soft shrink-0 mt-0.5" />
            <p className="text-xs text-text-dim">
              If you have any questions or legal inquiries regarding these Terms, please reach out to us at{' '}
              <a href="mailto:contact@romancetoon.com" className="text-rose-soft hover:underline">
                contact@romancetoon.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
