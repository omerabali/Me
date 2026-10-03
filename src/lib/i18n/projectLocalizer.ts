import type { Project } from '../../types/project';
import type { Language } from './translations';

export const CATEGORY_TRANSLATIONS: Record<Language, Record<string, string>> = {
  tr: {
    'Yapay Zeka': 'Yapay Zeka',
    'AI/ML': 'AI / Makine Öğrenmesi',
    'Makine Öğrenmesi': 'Makine Öğrenmesi & Veri',
    'Bilgisayarlı Görü': 'Bilgisayarlı Görü',
    'Mobil Uygulama': 'Mobil Uygulamalar',
    'Mobil & Yapay Zeka': 'Mobil & Yapay Zeka',
    'Yazılım': 'Yazılım & Algoritmalar',
    'Web / Bulut': 'Web & Bulut',
    'Web & İletişim': 'Web & İletişim',
    'Veri & Analitik': 'Veri & Analitik',
    'Backend': 'Arka Uç (Backend)',
    'Backend / Systems': 'Arka Uç & Sistemler',
    'Mobil': 'Mobil Uygulamalar',
    'Full-Stack': 'Full-Stack Web',
  },
  en: {
    'Yapay Zeka': 'Artificial Intelligence',
    'AI/ML': 'AI / Machine Learning',
    'Makine Öğrenmesi': 'Machine Learning & Data',
    'Bilgisayarlı Görü': 'Computer Vision',
    'Mobil Uygulama': 'Mobile Applications',
    'Mobil & Yapay Zeka': 'Mobile & AI',
    'Yazılım': 'Software & Algorithms',
    'Web / Bulut': 'Web & Cloud',
    'Web & İletişim': 'Web & Real-Time',
    'Veri & Analitik': 'Data & Analytics',
    'Backend': 'Backend & Systems',
    'Backend / Systems': 'Backend & Systems',
    'Mobil': 'Mobile Applications',
    'Full-Stack': 'Full-Stack Web',
  },
  de: {
    'Yapay Zeka': 'Künstliche Intelligenz',
    'AI/ML': 'KI / Maschinelles Lernen',
    'Makine Öğrenmesi': 'Maschinelles Lernen & Daten',
    'Bilgisayarlı Görü': 'Computer Vision',
    'Mobil Uygulama': 'Mobile Anwendungen',
    'Mobil & Yapay Zeka': 'Mobile & KI',
    'Yazılım': 'Software & Algorithmen',
    'Web / Bulut': 'Web & Cloud',
    'Web & İletişim': 'Web & Echtzeit',
    'Veri & Analitik': 'Daten & Analytik',
    'Backend': 'Backend & Systeme',
    'Backend / Systems': 'Backend & Systeme',
    'Mobil': 'Mobile Anwendungen',
    'Full-Stack': 'Full-Stack Web',
  },
};

export function getLocalizedCategory(category: string | undefined | null, lang: Language): string {
  if (!category) return lang === 'tr' ? 'Yazılım' : lang === 'de' ? 'Software' : 'Software';
  return CATEGORY_TRANSLATIONS[lang]?.[category] || category;
}

interface ProjectTextMap {
  display_name?: string;
  description: string;
  readme_summary?: string;
  tech_stack?: string[];
  features?: string[];
}

const PROJECT_TRANSLATIONS: Record<string, Partial<Record<Language, ProjectTextMap>>> = {
  'staj22001': {
    tr: {
      display_name: 'STAJ22001 — Staj Dosyası & Projeleri',
      description: 'Staj süreci boyunca geliştirilen alt projeleri, Web Workers performans çalışmalarını ve staj uygulamalarını içeren ana staj deposu.',
      readme_summary: 'Web Workers ile paralel hesaplama, ThreadLab visualizer ve staj dönemi teknik çalışmalar arşivi.',
      tech_stack: ['TypeScript', 'Astro', 'React', 'Node.js', 'PostgreSQL'],
      features: [
        'Web Workers ve paralel işleme optimizasyon laboratuvarı',
        'Modern web mimarileri ve full-stack prototipler',
        '40 günlük staj süreci teknik arşiv ve dokümantasyonu',
      ],
    },
    en: {
      display_name: 'STAJ22001 — Internship Projects & Archive',
      description: 'Main internship repository containing sub-projects, Web Workers performance studies, and technical prototypes.',
      readme_summary: 'Web Workers parallel computing, ThreadLab visualizer, and internship technical project archive.',
      tech_stack: ['TypeScript', 'Astro', 'React', 'Node.js', 'PostgreSQL'],
      features: [
        'Web Workers and parallel processing optimization lab',
        'Modern web architectures and full-stack prototypes',
        '40-day internship technical archive and documentation',
      ],
    },
    de: {
      display_name: 'STAJ22001 — Praktikumsprojekte & Archiv',
      description: 'Haupt-Praktikums-Repository mit Teilprojekten, Web-Worker-Performance-Studien und technischen Prototypen.',
      readme_summary: 'Web Worker Parallelverarbeitung, ThreadLab Visualizer und technisches Archiv des Praktikums.',
      tech_stack: ['TypeScript', 'Astro', 'React', 'Node.js', 'PostgreSQL'],
      features: [
        'Web Workers und Parallelverarbeitungs-Optimierungslabor',
        'Moderne Webarchitekturen und Full-Stack-Prototypen',
        '40-tägiges technisches Praktikumsarchiv und Dokumentation',
      ],
    },
  },
  'skill-identity-engine': {
    tr: {
      display_name: 'Skill Identity Engine — Yetkinlik Radarı',
      description: 'AI Destekli Kariyer Radarı: CV & GitHub analizi, dinamik yetkinlik eşleştirme, skill-gap tespiti ve kişiselleştirilmiş AI kariyer yol haritası motoru.',
      readme_summary: 'Kullanıcıların özgeçmişlerini ve GitHub aktivitelerini analiz eden yapay zeka destekli kariyer koçu ve yetkinlik motoru.',
      tech_stack: ['Python', 'FastAPI', 'PyTorch', 'Transformers', 'Cosine Radar', 'TypeScript'],
      features: [
        'CV & GitHub aktivitelerinden otomatik yetkinlik grafiği çıkarma',
        'Sektör standartlarına göre dinamik skill-gap radarı ve analizi',
        'Kişiselleştirilmiş AI kariyer yol haritası ve optimizasyon motoru',
      ],
    },
    en: {
      display_name: 'Skill Identity Engine — Talent Radar',
      description: 'AI Career Intelligence: CV & GitHub parsing, automated skill gap radar, personalized AI coach, and dynamic career roadmap engine.',
      readme_summary: 'AI-driven career coach and competency engine analyzing developer resumes and GitHub activities.',
      tech_stack: ['Python', 'FastAPI', 'PyTorch', 'Transformers', 'Cosine Radar', 'TypeScript'],
      features: [
        'Automated competency extraction from resume and GitHub activity',
        'Dynamic skill-gap radar benchmarked against market requirements',
        'Personalized AI career coaching and roadmap generation engine',
      ],
    },
    de: {
      display_name: 'Skill Identity Engine — Talent-Radar',
      description: 'KI-Karriereplattform: CV- & GitHub-Analyse, Skill-Gap-Erkennung, personalisierter KI-Coach und dynamische Karriere-Roadmap-Engine.',
      readme_summary: 'KI-gestützter Karriere-Coach und Kompetenzmotor zur Analyse von Lebensläufen und GitHub-Aktivitäten.',
      tech_stack: ['Python', 'FastAPI', 'PyTorch', 'Transformers', 'Cosine Radar', 'TypeScript'],
      features: [
        'Automatische Kompetenzextraktion aus Lebenslauf und GitHub-Aktivität',
        'Dynamisches Skill-Gap-Radar im Vergleich zu Marktstandards',
        'Personalisierte KI-Karriereberatung und Entwicklungs-Roadmap',
      ],
    },
  },
  'ai-job-genie': {
    tr: {
      display_name: 'AI-Job-Genie',
      description: 'Yapay zeka destekli akıllı kariyer ve iş eşleştirme motoru. LLM tabanlı analiz ve otomatik optimizasyon sistemi.',
      readme_summary: 'Yapay zeka destekli akıllı kariyer ve iş eşleştirme motoru.',
    },
    en: {
      display_name: 'AI-Job-Genie',
      description: 'AI-powered intelligent career and job matchmaking engine. LLM-based CV parsing and automated profile optimization system.',
      readme_summary: 'AI-powered career matchmaking and resume enhancement engine.',
    },
    de: {
      display_name: 'AI-Job-Genie',
      description: 'KI-gestützte Karriere- und Job-Matching-Engine. LLM-basierte Profilanalyse und automatisiertes Optimierungssystem.',
      readme_summary: 'KI-gestützte Jobvermittlungs- und Lebenslauf-Optimierungsplattform.',
    },
  },
  'readme-genie': {
    tr: {
      display_name: 'Readme GenAI',
      description: 'Geliştirici takımları ve açık kaynak depoları için yapay zeka destekli, kurumsal standartlarda otomatik README ve teknik dokümantasyon üretim motoru.',
      readme_summary: 'Yapay zeka ile saniyeler içinde kurumsal standartlarda README ve teknik dokümantasyon üreten SaaS platformu.',
    },
    en: {
      display_name: 'Readme GenAI',
      description: 'Enterprise-grade documentation engine for high-velocity teams, generating production-ready READMEs and technical specs in seconds.',
      readme_summary: 'AI-powered documentation engine turning raw codebases into enterprise README files.',
    },
    de: {
      display_name: 'Readme GenAI',
      description: 'KI-gestützte Dokumentations-Engine zur sekundenschnellen automatisierten Erstellung professioneller READMEs und technischer Spezifikationen.',
      readme_summary: 'KI-gestützte Dokumentationsplattform für Entwicklerteams und Open-Source-Repositories.',
    },
  },
  'desk-ai': {
    tr: {
      display_name: 'DeskAI (YOLOv8 & Ergonomi)',
      description: 'YOLOv8 mimarisi ve FastAPI tabanlı, otonom masa düzeni ve ergonomi değerlendirme ekosistemi.',
      readme_summary: 'YOLOv8 ile çalışma masası ergonomisini ve düzenini gerçek zamanlı puanlayan yapay zeka vizyon sistemi.',
    },
    en: {
      display_name: 'DeskAI (YOLOv8 & Ergonomics)',
      description: 'Autonomous desk layout and ergonomic posture evaluation ecosystem powered by YOLOv8 and FastAPI.',
      readme_summary: 'Computer Vision platform scoring desk ergonomics in real-time using YOLOv8.',
    },
    de: {
      display_name: 'DeskAI (YOLOv8 & Ergonomie)',
      description: 'Autonomes System zur Bewertung von Schreibtischordnung und Ergonomie basierend auf YOLOv8 und FastAPI.',
      readme_summary: 'Computer Vision Plattform zur Echtzeit-Bewertung von Schreibtischergonomie mit YOLOv8.',
    },
  },
  'quiz-app': {
    tr: {
      display_name: 'Quiz Hub (Flutter Mobil)',
      description: 'Flutter ve Dart ile geliştirilmiş, interaktif akademik değerlendirme ve dinamik mobil soru platformu.',
      readme_summary: 'Flutter tabanlı zengin kullanıcı deneyimi sunan interaktif mobil test ve sınav uygulaması.',
    },
    en: {
      display_name: 'Quiz Hub (Flutter Mobile)',
      description: 'Interactive academic assessment and dynamic mobile quiz platform built with Flutter and Dart.',
      readme_summary: 'Fluid mobile quiz and interactive testing application built with Flutter & Dart.',
    },
    de: {
      display_name: 'Quiz Hub (Flutter Mobile)',
      description: 'Interaktive akademische Bewertungs- und dynamische mobile Quizplattform, entwickelt mit Flutter und Dart.',
      readme_summary: 'Mobile Quiz- und interaktive Testanwendung mit Flutter & Dart.',
    },
  },
  'ai-home-design': {
    tr: {
      display_name: 'AI Home Design',
      description: 'Generative AI & Computer Vision tabanlı iç mekan tasarımı ve 3D görselleştirme SaaS uygulaması.',
      readme_summary: 'Oda fotoğraflarını yükleyerek yapay zeka ile saniyeler içinde iç mekan tasarımı ve 3D görselleştirme üreten SaaS platformu.',
    },
    en: {
      display_name: 'AI Home Design',
      description: 'Generative AI & Computer Vision powered interior design and 3D visualization SaaS platform.',
      readme_summary: 'SaaS platform generating photorealistic 3D interior architecture renders from room photos via diffusion models.',
    },
    de: {
      display_name: 'AI Home Design',
      description: 'Generative KI- & Computer Vision-gestützte Innenarchitektur- und 3D-Visualisierungs-SaaS-Plattform.',
      readme_summary: 'SaaS-Plattform zur Erstellung fotorealistischer 3D-Innenraumdesigns aus Fotos mittels generativer KI.',
    },
  },
  'farm-ai': {
    tr: {
      display_name: 'Farm AI',
      description: 'AgriTech SaaS & Akıllı Tarım Karar Destek Sistemi. Mobil entegrasyon, yapay zeka asistanı ve ürün verimlilik analizleri.',
      readme_summary: 'Bitki hastalık tespiti ve hava durumu öngörüsü sunan Flutter & Python tabanlı akıllı tarım asistanı.',
    },
    en: {
      display_name: 'Farm AI',
      description: 'AgriTech SaaS & Smart Agriculture Decision Support System with mobile integration and AI-driven crop analytics.',
      readme_summary: 'Flutter & Python powered intelligent AgriTech assistant for crop disease diagnosis and yield prediction.',
    },
    de: {
      display_name: 'Farm AI',
      description: 'AgriTech SaaS & Intelligentes landwirtschaftliches Entscheidungsunterstützungssystem mit mobiler App und KI-Assistent.',
      readme_summary: 'Flutter- & Python-basierter Agrar-Assistent für Pflanzendiagnostik und Ertragsanalysen.',
    },
  },
  'ai-medium-engine': {
    tr: {
      display_name: 'AI Medium Engine',
      description: 'Otonom yapay zeka içerik üretim motoru ve SaaS platformu. Trend analizi, SEO optimizasyonu ve sıfır kesinti mimarisi.',
      readme_summary: 'Yapay zeka ile trend analizleri ve otonom teknik makale yayını yapan SaaS içerik yönetim platformu.',
    },
    en: {
      display_name: 'AI Medium Engine',
      description: 'Autonomous AI content generation engine & SaaS platform with trend scraping, SEO optimization, and zero-downtime architecture.',
      readme_summary: 'Autonomous AI technical publishing ecosystem with live trends and smart fallback generation.',
    },
    de: {
      display_name: 'AI Medium Engine',
      description: 'Autonome KI-Content-Generierungs-Engine & SaaS-Plattform mit Trendanalyse, SEO-Optimierung und Zero-Downtime-Architektur.',
      readme_summary: 'Autonomes KI-Publishing-System mit Live-Trends und intelligenter Ausfallsicherheit.',
    },
  },
  'ai-medium-design': {
    tr: {
      display_name: 'AI Medium Engine — Otonom İçerik SaaS',
      description: 'Otonom yapay zeka içerik üretim motoru ve SaaS platformu. Canlı trend analizi, SEO optimizasyonu ve sıfır kesinti (Zero-Downtime) mimarisi.',
      readme_summary: 'Yapay zeka ile trend analizleri ve otonom teknik makale yayını yapan SaaS içerik yönetim platformu.',
      tech_stack: ['React 18', 'Gemini 1.5 Flash', 'Tailwind CSS', 'Express.js', 'Framer Motion'],
      features: [
        'Gemini 1.5 Flash ile trend analizi ve otonom teknik makale üretimi',
        'Zero-Downtime Smart Fallback ile kesintisiz içerik operasyonu',
        'Doğrudan blog yayını ve çoklu kullanıcı SaaS abonelik mimarisi',
      ],
    },
    en: {
      display_name: 'AI Medium Engine — Autonomous Content SaaS',
      description: 'Autonomous AI content generation engine & SaaS platform with trend scraping, SEO optimization, and zero-downtime architecture.',
      readme_summary: 'Autonomous AI technical publishing ecosystem with live trends and smart fallback generation.',
      tech_stack: ['React 18', 'Gemini 1.5 Flash', 'Tailwind CSS', 'Express.js', 'Framer Motion'],
      features: [
        'Live trend scraping with Gemini 1.5 Flash technical generation',
        'Zero-Downtime Smart Fallback ensuring 100% operational uptime',
        'One-click direct blog publishing and multi-tenant SaaS architecture',
      ],
    },
    de: {
      display_name: 'AI Medium Engine — Autonomes Content-SaaS',
      description: 'Autonome KI-Content-Generierungs-Engine & SaaS-Plattform mit Trendanalyse, SEO-Optimierung und Zero-Downtime-Architektur.',
      readme_summary: 'Autonomes KI-Publishing-System mit Live-Trends und intelligenter Ausfallsicherheit.',
      tech_stack: ['React 18', 'Gemini 1.5 Flash', 'Tailwind CSS', 'Express.js', 'Framer Motion'],
      features: [
        'Live-Trend-Analyse mit autonomer Gemini 1.5 Flash Generierung',
        'Zero-Downtime Smart Fallback für kontinuierliche Verfügbarkeit',
        'Direkte Blog-Veröffentlichung und mandantenfähige SaaS-Architektur',
      ],
    },
  },
  'hotelmailbot': {
    tr: {
      display_name: 'InfluencerAI / HotelMailBot',
      description: 'Otel ve konaklama sektörü için Gemini 2.5 Flash destekli otonom e-posta yanıtlama ve niyet sınıflandırma platformu.',
      readme_summary: 'Otel e-postalarını yapay zeka ile otomatik sınıflandıran ve yanıt taslağı oluşturan sistem.',
    },
    en: {
      display_name: 'InfluencerAI / HotelMailBot',
      description: 'Enterprise AI email triage and intent classification platform powered by Gemini 2.5 Flash for the hospitality industry.',
      readme_summary: 'Autonomous digital concierge classifying inbound hotel emails and drafting context-aware responses.',
    },
    de: {
      display_name: 'InfluencerAI / HotelMailBot',
      description: 'KI-gestützte E-Mail-Klassifizierungs- und Antwortplattform mit Gemini 2.5 Flash für die Hotellerie.',
      readme_summary: 'Autonomer digitaler Concierge zur Klassifizierung und automatisierten Beantwortung von Gäste-E-Mails.',
    },
  },
  'chatter-stream': {
    tr: {
      display_name: 'Chatter Stream',
      description: 'Gerçek zamanlı asenkron mesajlaşma platformu. WebSocket mimarisi, uçtan uca şifreleme ve yüksek eşzamanlılık.',
      readme_summary: 'WebSocket tabanlı yüksek performanslı gerçek zamanlı mesajlaşma ve dosya paylaşım sistemi.',
    },
    en: {
      display_name: 'Chatter Stream',
      description: 'Real-time asynchronous communication platform built with WebSockets, end-to-end security, and high concurrency.',
      readme_summary: 'High-throughput real-time chat platform with rooms, live typing indicators, and media sharing.',
    },
    de: {
      display_name: 'Chatter Stream',
      description: 'Echtzeit-Nachrichtenplattform mit WebSocket-Architektur, Ende-zu-Ende-Sicherheit und hoher Parallelität.',
      readme_summary: 'Hochperformante Echtzeit-Chat-Plattform mit Live-Streaming und Raumverwaltung.',
    },
  },
  'health-insurance-pricing': {
    tr: {
      display_name: 'Health Insurance Pricing AI',
      description: 'Makine öğrenmesi tabanlı sağlık sigortası prim tahminleme ve risk analizi motoru. XGBoost ve FastAPI.',
      readme_summary: 'XGBoost ve FastAPI tabanlı sağlık sigortası prim ve risk tahminleme platformu.',
    },
    en: {
      display_name: 'Health Insurance Pricing AI',
      description: 'Machine Learning powered health insurance premium prediction and demographic risk scoring engine using XGBoost and FastAPI.',
      readme_summary: 'Health insurance risk analytics and premium prediction engine.',
    },
    de: {
      display_name: 'Health Insurance Pricing AI',
      description: 'Maschinelles Lernen für Krankenversicherungsprämien-Vorhersage und demografische Risikobewertung mit XGBoost und FastAPI.',
      readme_summary: 'KI-gestützte Risikobewertung und Prämienprognose für Versicherungen.',
    },
  },
  'lexis-app': {
    tr: {
      display_name: 'Lexis App — Dil Öğrenme',
      description: 'Flutter ile geliştirilmiş yapay zeka destekli kişiselleştirilmiş dil öğrenme ve aralıklı tekrar mobil uygulaması.',
      readme_summary: 'Kişiselleştirilmiş kelime kartları ve AI ses pratiği sunan Flutter mobil dil uygulaması.',
    },
    en: {
      display_name: 'Lexis App — Language Learning',
      description: 'Flutter-powered AI language companion with spaced repetition, speech analysis, and personalized learning paths.',
      readme_summary: 'Intelligent mobile vocabulary and spaced repetition language platform.',
    },
    de: {
      display_name: 'Lexis App — Sprachlern-App',
      description: 'Flutter-basierte KI-Sprachbegleit-App mit Spaced-Repetition, Sprachanalyse und personalisierten Lernpfaden.',
      readme_summary: 'Intelligente mobile Vokabel- und Spaced-Repetition-Plattform.',
    },
  },
  'terrawatch': {
    tr: {
      display_name: 'TerraWatch — Uydu & CBS Analizi',
      description: 'Yapay zeka ve uydu görüntüleri ile arazi değişimi, ormansızlaşma ve çevresel risk izleme platformu.',
      readme_summary: 'Uydu görüntüleri üzerinden otomatik çevresel değişim ve risk tespit platformu.',
    },
    en: {
      display_name: 'TerraWatch — Satellite & GIS AI',
      description: 'Geospatial AI platform analyzing multispectral satellite imagery for deforestation and environmental risk monitoring.',
      readme_summary: 'Satellite imagery processing platform for environmental monitoring and risk detection.',
    },
    de: {
      display_name: 'TerraWatch — Satelliten- & GIS-KI',
      description: 'Geodaten-KI-Plattform zur Analyse von multispektralen Satellitenbildern zur Überwachung von Entwaldung und Umweltrisiken.',
      readme_summary: 'Satellitenbild-Verarbeitungsplattform für Umweltmonitoring und Risikobewertung.',
    },
  },
};

export function getLocalizedProject(project: Project, lang: Language): Project {
  const rawKey = (project.slug || project.name || '').toLowerCase().replace(/_/g, '-');
  const cleanKey = rawKey.replace(/-/g, '');

  const translation =
    PROJECT_TRANSLATIONS[rawKey]?.[lang] ||
    PROJECT_TRANSLATIONS[cleanKey]?.[lang] ||
    Object.entries(PROJECT_TRANSLATIONS).find(([k]) => rawKey.includes(k) || k.includes(rawKey))?.[1]?.[lang];

  const localizedCat = getLocalizedCategory(project.category, lang);

  if (!translation) {
    return {
      ...project,
      category: localizedCat,
    };
  }

  return {
    ...project,
    display_name: translation.display_name || project.display_name || project.name,
    description: translation.description || project.description,
    readme_summary: translation.readme_summary || project.readme_summary,
    tech_stack: translation.tech_stack || project.tech_stack,
    features: translation.features || project.features,
    category: localizedCat,
  };
}
