import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Mail, AlertCircle, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'DMCA & Copyright Policy',
  description:
    'RomanceToon respects intellectual property rights and complies with the Digital Millennium Copyright Act (DMCA). Learn how to submit a copyright notice.',
};

export default function DmcaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb / Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-rose-soft transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="rounded-3xl border border-surface-border bg-surface p-8 sm:p-12 shadow-xl">
        <div className="flex items-center gap-3 pb-6 border-b border-surface-border">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-accent/15 text-rose-accent ring-1 ring-rose-accent/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              DMCA & Copyright Policy
            </h1>
            <p className="text-xs text-text-dim mt-0.5">
              Digital Millennium Copyright Act Compliance Notification
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6 text-sm text-text-muted leading-relaxed">
          <p>
            <strong>RomanceToon</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) respects the intellectual property rights of creators, publishers, and copyright holders. In accordance with the <strong>Digital Millennium Copyright Act (Title 17, United States Code, Section 512)</strong>, RomanceToon will respond expeditiously to notices of alleged copyright infringement that are reported to our designated copyright agent.
          </p>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            1. Notice of Claimed Copyright Infringement
          </h2>
          <p>
            If you are a copyright owner, authorized to act on behalf of one, or authorized to act under any exclusive right under copyright, please report alleged copyright infringements taking place on or through the RomanceToon website by submitting a Notice containing the following information:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
            </li>
            <li>
              Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works are covered by a single notification, a representative list of such works.
            </li>
            <li>
              Identification of the material that is claimed to be infringing or to be the subject of infringing activity, including the <strong>exact URLs</strong> where the material is located on RomanceToon.
            </li>
            <li>
              Information reasonably sufficient to permit us to contact you, such as your full name, physical address, telephone number, and an active email address.
            </li>
            <li>
              A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
            </li>
            <li>
              A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
            </li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            2. Designated Copyright Agent Contact
          </h2>
          <p>
            All DMCA notices must be sent to our Designated Copyright Agent via email:
          </p>

          <div className="rounded-2xl border border-rose-accent/30 bg-rose-accent/5 p-4 sm:p-6 flex items-start gap-4">
            <Mail className="w-5 h-5 text-rose-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-text-main">RomanceToon Copyright Compliance Team</p>
              <p className="text-rose-soft mt-1 font-mono text-sm">dmca@romancetoon.com</p>
              <p className="text-xs text-text-dim mt-2">
                Subject line should read: <em>&ldquo;DMCA Takedown Notice - [Series Name]&rdquo;</em>
              </p>
            </div>
          </div>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            3. Response & Takedown Procedure
          </h2>
          <p>
            Upon receipt of a valid and complete notification, RomanceToon will review the claim and promptly remove or disable access to the infringing material (typically within 24 to 48 business hours). We will also notify the user or uploader who posted the content of the takedown.
          </p>

          <h2 className="font-serif text-lg font-bold text-text-main pt-4 border-t border-surface-border/60">
            4. Counter-Notification
          </h2>
          <p>
            If you believe that your content was removed by mistake or misidentification, you may submit a written counter-notification to our designated agent pursuant to 17 U.S.C. § 512(g)(3). A valid counter-notification must include your contact information, the URL of the removed material, a statement under penalty of perjury of good faith belief that the removal was in error, and consent to federal court jurisdiction.
          </p>

          <div className="rounded-2xl border border-surface-border bg-surface-card p-4 flex items-start gap-3 mt-6">
            <AlertCircle className="w-5 h-5 text-text-dim shrink-0 mt-0.5" />
            <p className="text-xs text-text-dim">
              <strong>Disclaimer:</strong> Under 17 U.S.C. § 512(f), any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability for damages, including court costs and attorneys&apos; fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
