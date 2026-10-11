import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageSquare, ShieldCheck, ArrowLeft, Clock, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with RomanceToon team for inquiries, copyright notices, suggestions, and technical support.',
};

export default function ContactPage() {
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
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text-main">
              Contact RomanceToon
            </h1>
            <p className="text-xs text-text-dim mt-0.5">
              We&apos;re here to help with questions, feedback, and DMCA inquiries
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-8 text-sm text-text-muted leading-relaxed">
          <p>
            Have feedback, noticed a broken image link, or need to contact our copyright team? Feel free to reach out to us using the dedicated channels below.
          </p>

          {/* Contact Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* General Inquiries */}
            <div className="rounded-2xl border border-surface-border bg-surface-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-rose-soft" />
                  <h3 className="font-serif text-base font-bold text-text-main">General Support & Feedback</h3>
                </div>
                <p className="text-xs text-text-dim leading-relaxed">
                  For reader feedback, manhwa suggestions, bug reports, and general site questions.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-border">
                <a
                  href="mailto:contact@romancetoon.com"
                  className="inline-flex items-center gap-2 text-rose-soft font-semibold text-sm hover:underline"
                >
                  <Mail className="w-4 h-4" /> contact@romancetoon.com
                </a>
              </div>
            </div>

            {/* Copyright & DMCA */}
            <div className="rounded-2xl border border-surface-border bg-surface-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-rose-accent" />
                  <h3 className="font-serif text-base font-bold text-text-main">Copyright & DMCA Agent</h3>
                </div>
                <p className="text-xs text-text-dim leading-relaxed">
                  For formal DMCA notices, copyright claims, and rights holder requests.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-border">
                <a
                  href="mailto:dmca@romancetoon.com"
                  className="inline-flex items-center gap-2 text-rose-accent font-semibold text-sm hover:underline"
                >
                  <Mail className="w-4 h-4" /> dmca@romancetoon.com
                </a>
              </div>
            </div>
          </div>

          {/* Response Time Notice */}
          <div className="rounded-2xl border border-surface-border/80 bg-surface/80 p-5 flex items-start gap-3">
            <Clock className="w-5 h-5 text-rose-soft shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-text-main">Response Times</h4>
              <p className="text-xs text-text-dim mt-1">
                Our team typically reviews and replies to general messages within 24–48 hours. Urgent copyright and DMCA notices are prioritized and processed expeditiously.
              </p>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="rounded-2xl border border-surface-border/80 bg-surface/80 p-5 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-text-dim shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-text-main">Tips for Fast Inquiries</h4>
              <ul className="text-xs text-text-dim mt-1 list-disc pl-4 space-y-1">
                <li>Include the exact URL of the manhwa or chapter in question.</li>
                <li>If reporting a broken reader image, specify the chapter number and device/browser you are using.</li>
                <li>For DMCA claims, please review our requirements on the <Link href="/dmca" className="text-rose-soft hover:underline">DMCA Policy page</Link> first.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
