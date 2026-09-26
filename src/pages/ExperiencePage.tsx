import React from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { useTranslation } from '../lib/i18n/LanguageContext';

export const ExperiencePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="shell pb-14 pt-4">
      <PageHeader
        eyebrow={t.experience.eyebrow}
        title={t.experience.title}
        description={t.experience.description}
      />

      {/* Dikey Zaman Çizelgesi */}
      <div className="relative mt-12">
        {/* Merkez Bağlantı Çizgisi */}
        <div
          className="absolute left-4 top-4 bottom-4 w-0.5 bg-linear-to-b from-accent via-rule-strong to-transparent md:left-1/2 md:-translate-x-1/2"
          aria-hidden="true"
        />

        <div className="space-y-12">
          {t.experience.items.map((exp, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={exp.role + exp.period}
                className={`relative flex flex-col md:flex-row items-start ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Zaman Çizelgesi Noktası (Dot) */}
                <div className="absolute left-4 -translate-x-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-paper bg-accent text-white shadow-md md:left-1/2">
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </div>

                {/* İçerik Kartı */}
                <div
                  className={`ml-12 w-full md:ml-0 md:w-1/2 ${
                    isEven ? 'md:pl-10' : 'md:pr-10'
                  }`}
                >
                  <Reveal delay={index * 100}>
                    <div className="neo-card p-6 md:p-8 transition-transform hover:-translate-y-1">
                      {/* Tarih & Süre Rozeti */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-accent">
                            <Calendar className="h-3.5 w-3.5" />
                            {exp.period}
                          </span>
                          {exp.duration && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                              <Clock className="h-3 w-3" />
                              {exp.duration}
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-medium text-ink-3">
                          {exp.location}
                        </span>
                      </div>

                      {/* Rol ve Şirket */}
                      <div className="mt-4">
                        <h2 className="font-display text-lg font-bold text-ink">
                          {exp.role}
                        </h2>
                        <p className="mt-0.5 text-xs font-semibold text-ink-2">
                          {exp.company}
                        </p>
                      </div>

                      {/* Açıklama */}
                      <p className="mt-3 text-xs leading-relaxed text-ink-2">
                        {exp.description}
                      </p>

                      {/* Öne Çıkan Başarılar */}
                      <ul className="mt-4 space-y-2">
                        {exp.achievements.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-ink-2"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-positive mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Yetenek Rozetleri */}
                      <div className="mt-6 flex flex-wrap gap-1.5 border-t border-rule/60 pt-4">
                        {exp.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-rule bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-2"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
