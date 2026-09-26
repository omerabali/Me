import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/ui/Reveal';
import { Tag } from '../components/ui/Tag';
import { useInView } from '../lib/hooks/useInView';

const CLUSTERS = [
  {
    title: 'Yapay Zeka & Bilgisayarlı Görü',
    stack: [
      'PyTorch',
      'OpenCV',
      'Google Gemini API',
      'Pandas',
      'NumPy',
      'Generative AI',
      'CV Pipeline',
      'Scikit-Learn',
    ],
  },
  {
    title: 'Arka Uç & Dağıtık Sistemler',
    stack: [
      'Python 3.12+',
      'FastAPI',
      'AsyncIO',
      'HTTPX',
      'Pydantic v2',
      'PostgreSQL',
      'Redis',
      'Docker',
      'REST API',
    ],
  },
  {
    title: 'Ön Yüz & Mobil',
    stack: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Flutter',
      'Dart',
      'Kotlin',
    ],
  },
  {
    title: 'Diller & Temel Sistemler',
    stack: [
      'C',
      'C++',
      'Java',
      'C#',
      'SQL / MySQL',
      'Git & GitHub Actions',
      'Linux',
    ],
  },
];

const LANGUAGES = [
  { name: 'Türkçe', level: 'Ana dil', percent: 100 },
  { name: 'İngilizce', level: 'İleri düzey — profesyonel çalışma', percent: 85 },
  { name: 'Almanca', level: 'Başlangıç düzeyi', percent: 30 },
];

const CERTIFICATES = [
  { title: 'Machine Learning Bootcamp', issuer: 'Tech Istanbul', year: '2024' },
  { title: 'İleri Seviye Algoritmalar ve Veri Yapıları', issuer: 'BTK Akademi', year: '2024' },
  { title: 'Veri Modelleme & İlişkisel Tasarım', issuer: 'BTK Akademi', year: '2024' },
  { title: 'Algoritma Tasarımı ve Karmaşıklık', issuer: 'BTK Akademi', year: '2024' },
  { title: 'Sıfırdan İleri Seviye C++ ve Programlama', issuer: 'Udemy', year: '2023' },
  { title: 'LinkedIn ile Etkili Profil Oluşturma', issuer: 'BTK Akademi', year: '2024' },
  { title: 'Bilgi Teknolojilerine Giriş & Donanım', issuer: 'BTK Akademi', year: '2023' },
];

/** Dil yeterlilik göstergesi — ekrana girdiğinde dolar. */
const LanguageMeter: React.FC<(typeof LANGUAGES)[number]> = ({
  name,
  level,
  percent,
}) => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 });

  return (
    <div ref={ref} className="border-b border-rule py-5">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-meta font-semibold text-ink">{name}</h3>
        <p className="text-meta text-ink-2">{level}</p>
      </div>

      <div
        role="meter"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name} yeterlilik düzeyi`}
        className="mt-3 h-px w-full bg-rule"
      >
        <div
          className="h-full bg-ink transition-[width] duration-1000 ease-editorial"
          style={{ width: inView ? `${percent}%` : '0%' }}
        />
      </div>
    </div>
  );
};

export const StackPage: React.FC = () => {
  return (
    <div className="shell pb-8">
      <PageHeader
        eyebrow="Bölüm 03"
        title="Yetkinlikler"
        description="Günlük olarak kullandığım teknolojiler, dil yeterlilikleri ve resmi akreditasyonlar."
      />

      {/* Teknoloji kümeleri */}
      <section className="py-16">
        <Reveal>
          <SectionHeading index="01" title="Teknoloji Yığını" />
        </Reveal>

        <div className="mt-4">
          {CLUSTERS.map((cluster, i) => (
            <Reveal key={cluster.title} delay={i * 80}>
              <div className="grid grid-cols-1 gap-4 border-b border-rule py-8 md:grid-cols-12 md:gap-6">
                <h3 className="text-h3 text-ink md:col-span-4">
                  {cluster.title}
                </h3>

                <ul className="flex flex-wrap gap-2 md:col-span-8">
                  {cluster.stack.map((tech) => (
                    <li key={tech}>
                      <Tag>{tech}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Diller */}
      <section className="py-16">
        <Reveal>
          <SectionHeading index="02" title="Yabancı Diller" />
        </Reveal>

        <div className="mt-6 max-w-2xl">
          {LANGUAGES.map((lang) => (
            <LanguageMeter key={lang.name} {...lang} />
          ))}
        </div>
      </section>

      {/* Sertifikalar */}
      <section className="py-16">
        <Reveal>
          <SectionHeading index="03" title="Sertifikalar" />
        </Reveal>

        <ul className="mt-4">
          {CERTIFICATES.map((cert, i) => (
            <Reveal as="li" key={cert.title} delay={i * 45}>
              <div className="grid grid-cols-1 items-baseline gap-2 border-b border-rule py-5 md:grid-cols-12 md:gap-6">
                <span className="font-mono text-micro text-ink-3 tabular-nums md:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3 className="text-meta font-semibold text-ink md:col-span-7">
                  {cert.title}
                </h3>

                <p className="text-meta text-ink-2 md:col-span-3">
                  {cert.issuer}
                </p>

                <p className="font-mono text-micro text-ink-3 md:col-span-1 md:text-right">
                  {cert.year}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>
    </div>
  );
};
