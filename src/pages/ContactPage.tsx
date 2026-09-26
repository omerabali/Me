import React, { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Mail,
  Phone,
  Send,
} from 'lucide-react';
import { SITE } from '../lib/constants/site';
import { LinkedinIcon } from '../components/ui/Icons';
import { Reveal } from '../components/ui/Reveal';
import { useTranslation } from '../lib/i18n/LanguageContext';

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: '', email: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  const validate = (): boolean => {
    const errs: Errors = {};
    if (!values.name.trim()) errs.name = t.contact.nameRequired;
    if (!values.email.trim()) {
      errs.email = t.contact.emailRequired;
    } else if (!EMAIL_RE.test(values.email.trim())) {
      errs.email = t.contact.emailInvalid;
    }
    if (!values.message.trim()) {
      errs.message = t.contact.messageRequired;
    } else if (values.message.trim().length < 10) {
      errs.message = t.contact.messageMin;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // 1. Veritabanına (Neon PostgreSQL / API) kaydet
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
    } catch {
      // Backend kapalıysa bile e-posta akışına devam et
    }

    // 2. E-posta istemcisini hazırla ve tetikle
    const subject = encodeURIComponent(`${values.name} — Portfolio Contact`);
    const body = encodeURIComponent(
      `Hello Ömer,\n\n${values.message}\n\nSender: ${values.name} (${values.email})`
    );

    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="shell py-12 md:py-16">
      {/* -------------------------------------------------------------------
          BAŞLIK & AÇIKLAMA (Screenshot 5 Referansı: "Get In Touch")
      ------------------------------------------------------------------- */}
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
            {t.contact.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-2 md:text-base">
            {t.contact.subtitle}
          </p>
        </Reveal>
      </div>

      {/* -------------------------------------------------------------------
          ÜST 3 DOĞRUDAN İLETİŞİM KARTI (Screenshot 5)
      ------------------------------------------------------------------- */}
      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
        {/* 1. E-posta Kartı */}
        <Reveal delay={50}>
          <div
            onClick={copyEmail}
            className="neo-card group flex cursor-pointer flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 dark:bg-accent/20 text-accent transition-transform duration-300 group-hover:scale-110">
              <Mail className="h-6 w-6" />
            </div>

            <h2 className="mt-4 font-display text-base font-bold text-ink">
              {t.contact.emailCardTitle}
            </h2>

            <p className="mt-1 font-mono text-xs text-ink-2 truncate max-w-full">
              {SITE.email}
            </p>

            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-accent">
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-positive" />
                  <span className="text-positive">{t.contact.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>{t.contact.copy}</span>
                </>
              )}
            </span>
          </div>
        </Reveal>

        {/* 2. Telefon Kartı */}
        <Reveal delay={100}>
          <a
            href={`tel:${SITE.phoneHref}`}
            className="neo-card group flex flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 dark:bg-accent/20 text-accent transition-transform duration-300 group-hover:scale-110">
              <Phone className="h-6 w-6" />
            </div>

            <h2 className="mt-4 font-display text-base font-bold text-ink">
              {t.contact.phoneCardTitle}
            </h2>

            <p className="mt-1 font-mono text-xs text-ink-2">
              {SITE.phone}
            </p>

            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-accent">
              <span>{t.contact.callNow}</span>
            </span>
          </a>
        </Reveal>

        {/* 3. LinkedIn Kartı */}
        <Reveal delay={150}>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-card group flex flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 dark:bg-accent/20 text-accent transition-transform duration-300 group-hover:scale-110">
              <LinkedinIcon className="h-6 w-6" />
            </div>

            <h2 className="mt-4 font-display text-base font-bold text-ink">
              {t.contact.linkedinCardTitle}
            </h2>

            <p className="mt-1 font-mono text-xs text-ink-2 truncate max-w-full">
              in/omerabali
            </p>

            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-accent">
              <span>{t.contact.viewProfile}</span>
              <ExternalLink className="h-3 w-3" />
            </span>
          </a>
        </Reveal>
      </div>

      {/* -------------------------------------------------------------------
          ALT FORM KARTI (Screenshot 5)
      ------------------------------------------------------------------- */}
      <div className="mx-auto mt-10 max-w-2xl">
        <Reveal delay={200}>
          <div className="neo-card p-8 md:p-10 border border-rule/80 dark:border-rule-strong/80 shadow-md">
            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-positive/10 text-positive">
                  <Check className="h-7 w-7" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold text-ink">
                  {t.contact.successTitle}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink-2">
                  {t.contact.successDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setValues(EMPTY);
                    setErrors({});
                  }}
                  className="mt-6 rounded-xl border border-rule bg-surface px-5 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-ink"
                >
                  {t.contact.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold tracking-wider text-ink uppercase"
                  >
                    {t.contact.nameLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={values.name}
                    placeholder={t.contact.namePlaceholder}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, name: e.target.value }));
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    className={`mt-2 w-full rounded-xl border bg-surface dark:bg-surface-card px-4 py-3.5 text-sm text-ink placeholder:text-ink-3 transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none ${
                      errors.name
                        ? 'border-red-500 ring-1 ring-red-500/30'
                        : 'border-rule dark:border-rule-strong'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold tracking-wider text-ink uppercase"
                  >
                    {t.contact.emailLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={values.email}
                    placeholder={t.contact.emailPlaceholder}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, email: e.target.value }));
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={`mt-2 w-full rounded-xl border bg-surface dark:bg-surface-card px-4 py-3.5 text-sm text-ink placeholder:text-ink-3 transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none ${
                      errors.email
                        ? 'border-red-500 ring-1 ring-red-500/30'
                        : 'border-rule dark:border-rule-strong'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-bold tracking-wider text-ink uppercase"
                  >
                    {t.contact.messageLabel} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={values.message}
                    placeholder={t.contact.messagePlaceholder}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, message: e.target.value }));
                      setErrors((prev) => ({ ...prev, message: undefined }));
                    }}
                    className={`mt-2 w-full resize-none rounded-xl border bg-surface dark:bg-surface-card px-4 py-3.5 text-sm text-ink placeholder:text-ink-3 transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none ${
                      errors.message
                        ? 'border-red-500 ring-1 ring-red-500/30'
                        : 'border-rule dark:border-rule-strong'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-accent to-accent-deep px-6 py-4 text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 hover:brightness-110 active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  <span>{isSubmitting ? t.contact.sending : t.contact.sendButton}</span>
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
};
