import React from 'react';
import {
  Award,
  Brain,
  CheckCircle2,
  Compass,
  Database,
  GraduationCap,
  Server,
  Smartphone,
  Sparkles,
  User,
} from 'lucide-react';
import { SITE } from '../lib/constants/site';
import { GithubIcon, LinkedinIcon } from '../components/ui/Icons';
import { Reveal } from '../components/ui/Reveal';
import { useTranslation } from '../lib/i18n/LanguageContext';

const SKILL_ICONS = [Brain, Smartphone, Server, Sparkles, Compass, Database];

export const AboutPage: React.FC = () => {
  const { t, language } = useTranslation();

  const verifiedBadge =
    language === 'en'
      ? 'Verified Training'
      : language === 'de'
        ? 'Verifizierter Nachweis'
        : 'Doğrulanmış Eğitim';

  return (
    <div className="shell py-10 md:py-14">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* -----------------------------------------------------------------
            SOL KOLON: Sabit Profil Kartı (Screenshot 2 Referansı)
        ----------------------------------------------------------------- */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 neo-card flex flex-col items-center p-8 text-center">
            {/* Profil Avatarı & Çevrimiçi Noktası */}
            <div className="relative mb-5 flex h-36 w-36 items-center justify-center overflow-hidden rounded-3xl border-2 border-rule bg-linear-to-b from-surface to-paper-sunk shadow-lg group">
              <picture>
                <source srcSet="/profile-avatar.webp" type="image/webp" />
                <img
                  src="/profile-avatar-sm.png"
                  alt="Ömer Abalı Profil Fotoğrafı"
                  width={640}
                  height={640}
                  decoding="async"
                  loading="eager"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </picture>
              <span
                className="absolute right-2 bottom-2 h-4 w-4 rounded-full border-2 border-surface bg-positive ring-2 ring-positive/30"
                title={t.hero.statusBadge}
              />
            </div>

            {/* İsim & Başlık */}
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              {SITE.name}
            </h2>

            <span className="mt-2 inline-flex items-center rounded-lg bg-accent/10 px-3 py-1 text-xs font-bold tracking-wider text-accent uppercase">
              {t.about.roleBadge}
            </span>

            <p className="mt-4 text-xs leading-relaxed text-ink-2">
              {t.hero.bio}
            </p>

            {/* Sosyal Medya İkon Butonları */}
            <div className="mt-6 flex items-center justify-center gap-3 border-t border-rule pt-6 w-full">
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-rule bg-surface text-ink transition-all hover:border-ink hover:text-accent hover:scale-105"
              >
                <GithubIcon className="h-4 w-4" />
              </a>

              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-rule bg-surface text-ink transition-all hover:border-ink hover:text-accent hover:scale-105"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </aside>

        {/* -----------------------------------------------------------------
            SAĞ KOLON: Hakkımda + Yetenekler + Eğitim + Sertifikalar
        ----------------------------------------------------------------- */}
        <main className="flex flex-col gap-10 lg:col-span-8">
          {/* ===============================================================
              1. BÖLÜM: HAKKIMDA
          =============================================================== */}
          <section className="neo-card p-7 md:p-9">
            <Reveal>
              <div className="flex items-center gap-3 border-b border-rule pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <User className="h-4 w-4" />
                </div>
                <h1 className="font-display text-xl font-bold text-ink">
                  {t.about.title}
                </h1>
              </div>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-2">
                <p>{t.about.bioP1}</p>
                <p>{t.about.bioP2}</p>
                <p>{t.about.bioP3}</p>
              </div>

              {/* Vurgulu Alıntı Kutusu */}
              <div className="mt-8 rounded-2xl border border-rule-strong bg-linear-to-r from-surface to-paper-sunk p-5 text-ink shadow-xs">
                <p className="font-display text-sm font-semibold italic text-ink">
                  &ldquo;{t.about.quote}&rdquo;
                </p>
              </div>
            </Reveal>
          </section>

          {/* ===============================================================
              2. BÖLÜM: YETENEKLER
          =============================================================== */}
          <section className="flex flex-col gap-5">
            <Reveal>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">
                  {t.about.skillsTitle}
                </h2>
              </div>
            </Reveal>

            {/* Yetenek Kartları Izgarası */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {t.about.skillCategories.map((cat, i) => {
                const IconComponent = SKILL_ICONS[i % SKILL_ICONS.length];
                return (
                  <Reveal key={cat.title} delay={i * 60}>
                    <div className="neo-card flex h-full flex-col justify-between p-6">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <IconComponent className="h-3.5 w-3.5" />
                          </div>
                          <h3 className="font-display text-sm font-bold text-ink">
                            {cat.title}
                          </h3>
                        </div>

                        {/* Yetenek Çipleri / Rozetleri */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {cat.skills.map((skill) => (
                            <span key={skill} className="skill-pill">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* ===============================================================
              3. BÖLÜM: EĞİTİM
          =============================================================== */}
          <section className="flex flex-col gap-5">
            <Reveal>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">
                  {t.about.educationTitle}
                </h2>
              </div>
            </Reveal>

            <div className="flex flex-col gap-4">
              {t.about.educationItems.map((item, i) => (
                <Reveal key={item.degree} delay={i * 80}>
                  <div className="neo-card flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-display text-base font-bold text-ink">
                          {item.degree}
                        </h3>
                        <span className="rounded-md border border-rule px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">
                          {item.gpa}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-medium text-ink-2">
                        {item.school} · <span className="font-mono text-ink-3">{item.period}</span>
                      </p>

                      <p className="mt-2 text-xs leading-relaxed text-ink-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Onay Rozeti İkonu */}
                    <div className="shrink-0 flex items-center justify-center self-end sm:self-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-surface text-positive shadow-2xs">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ===============================================================
              4. BÖLÜM: SERTİFİKALAR & EĞİTİMLER (CV Doğrulanmış 7 Sertifika)
          =============================================================== */}
          <section className="flex flex-col gap-5">
            <Reveal>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Award className="h-4 w-4" />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">
                  {t.about.certificatesTitle}
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {t.about.certificateItems.map((cert, i) => (
                <Reveal key={cert.title} delay={i * 50}>
                  <div className="neo-card flex h-full flex-col justify-between p-5 transition-transform duration-200 hover:-translate-y-1">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-surface px-2.5 py-1 font-mono text-[11px] font-semibold text-accent">
                          <Award className="h-3 w-3 text-accent" />
                          {cert.issuer}
                        </span>
                        <span className="font-mono text-xs text-ink-3">
                          {cert.period}
                        </span>
                      </div>

                      <h3 className="mt-3 font-display text-sm font-bold text-ink">
                        {cert.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-ink-3">
                        {cert.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-rule pt-3 text-[11px]">
                      <span className="flex items-center gap-1 font-medium text-positive">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {verifiedBadge}
                      </span>
                      <span className="font-mono text-[10px] text-ink-3/70">
                        {cert.issuer}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
