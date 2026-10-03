export type Language = 'tr' | 'en' | 'de';

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface EducationItem {
  degree: string;
  school: string;
  period: string;
  gpa: string;
  description: string;
}

export interface ExperienceItem {
  period: string;
  duration: string;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface CertificateItem {
  title: string;
  issuer: string;
  period: string;
  description: string;
}

export interface HomeServiceItem {
  title: string;
  desc: string;
  tags: string[];
}

export interface HomeWhyWorkItem {
  number: string;
  title: string;
  desc: string;
}

export interface Translations {
  nav: {
    home: string;
    about: string;
    projects: string;
    experience: string;
    contact: string;
    cvDownload: string;
    skipToContent: string;
  };
  hero: {
    greetingBadge: string;
    titleMain: string;
    titleAccent: string;
    ctaProjects: string;
    ctaContact: string;
    statusBadge: string;
    badge1: string;
    badge2: string;
    badge3: string;
    titleRole: string;
    bio: string;
    viewProfile: string;
    downloadCv: string;
    statRepos: string;
    statReposSub: string;
    statGpa: string;
    statGpaSub: string;
    statArea: string;
    statAreaSub: string;
  };
  home: {
    marqueeItems: string[];
    manifestoTitle: string;
    readJourney: string;
    manifestoBio: string;
    statRepos: string;
    statHonors: string;
    statAlgorithms: string;
    featuredHeading: string;
    viewAllRepos: string;
    servicesTitle: string;
    servicesSubtitle: string;
    services: HomeServiceItem[];
    whyWorkTitle: string;
    whyWorkItems: HomeWhyWorkItem[];
    finalCtaTitle: string;
    copied: string;
    sendMessage: string;
  };
  featured: {
    badge: string;
    title: string;
    viewAll: string;
    inspect: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaButton: string;
    liveProduction: string;
    architectureReadme: string;
    liveDemo: string;
  };
  about: {
    title: string;
    roleBadge: string;
    bioP1: string;
    bioP2: string;
    bioP3: string;
    quote: string;
    skillsTitle: string;
    skillCategories: SkillCategory[];
    educationTitle: string;
    educationItems: EducationItem[];
    certificatesTitle: string;
    certificateItems: CertificateItem[];
  };
  experience: {
    eyebrow: string;
    title: string;
    description: string;
    items: ExperienceItem[];
  };
  projects: {
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    allFilter: string;
    searchPlaceholder: string;
    noResults: string;
    noResultsHint: string;
    clearFilters: string;
    code: string;
    readme: string;
    demo: string;
  };
  contact: {
    title: string;
    subtitle: string;
    emailCardTitle: string;
    phoneCardTitle: string;
    linkedinCardTitle: string;
    copy: string;
    copied: string;
    callNow: string;
    viewProfile: string;
    nameLabel: string;
    namePlaceholder: string;
    nameRequired: string;
    emailLabel: string;
    emailPlaceholder: string;
    emailRequired: string;
    emailInvalid: string;
    messageLabel: string;
    messagePlaceholder: string;
    messageRequired: string;
    messageMin: string;
    sendButton: string;
    sending: string;
    successTitle: string;
    successDesc: string;
    sendAnother: string;
  };
  footer: {
    description: string;
    systemStatus: string;
    quickLinks: string;
    connect: string;
    rights: string;
    poweredBy: string;
    backToTop: string;
  };
  modal: {
    stars: string;
    forks: string;
    viewOnGithub: string;
    liveDemo: string;
    techStack: string;
    readmeTitle: string;
    close: string;
  };
}

export const translations: Record<Language, Translations> = {
  tr: {
    nav: {
      home: 'Ana Sayfa',
      about: 'Hakkımda',
      projects: 'Projeler',
      experience: 'Deneyim',
      contact: 'İletişim',
      cvDownload: 'CV İndir',
      skipToContent: 'İçeriğe Atla',
    },
    hero: {
      greetingBadge: 'MERHABA, BEN ÖMER ABALI',
      titleMain: 'YAZILIM',
      titleAccent: 'MÜHENDİSİ',
      ctaProjects: 'PROJELERİ İNCELE',
      ctaContact: 'İLETİŞİME GEÇ',
      statusBadge: 'YENİ PROJELER İÇİN UYGUN',
      badge1: 'Full-Stack Geliştirici',
      badge2: 'Yapay Zeka & LLM',
      badge3: 'Mobil Uygulama Geliştirici',
      titleRole: 'AI Engineer · Mobile & Full-Stack Developer',
      bio: 'Machine Learning ve Derin Öğrenme modellerini; Flutter ile akıcı mobil uygulamalara ve React & FastAPI ile modern Full-Stack web platformlarına dönüştürüyorum. AI Engineering ve Full-Stack Developer olarak ilerlemeyi hedefliyorum.',
      viewProfile: 'Profili Görüntüle',
      downloadCv: 'CV İndir',
      statRepos: 'Açık Kaynak',
      statReposSub: 'GitHub deposu & mimari çözümler',
      statGpa: 'Akademik Başarı',
      statGpaSub: 'Yazılım Mühendisliği GPA / 4.00',
      statArea: 'Uzmanlık Alanı',
      statAreaSub: 'Yapay Zeka, Mobil & Web Mimarileri',
    },
    home: {
      marqueeItems: [
        'PYTHON • C# • JAVA • TYPESCRIPT • DART',
        'YAPAY ZEKA & MAKİNE ÖĞRENMESİ (AI / ML)',
        'REACT & TAILWINDCSS FULL-STACK',
        'FLUTTER & KOTLIN MOBİL GELİŞTİRME',
        'GENERATIVE AI & IMAGE-TO-IMAGE TRANSFORMATION',
        'BİLGİSAYARLI GÖRÜ (COMPUTER VISION)',
        'DOCKER, AWS & LINUX DEVOPS',
        'WEBSOCKET GERÇEK ZAMANLI MİMARİLER (REAL-TIME)',
        'POSTGRESQL, MYSQL & FIREBASE',
        'CLEAN ARCHITECTURE & ÖLÇEKLENEBİLİR SAAS',
      ],
      manifestoTitle:
        'Algoritmik düşünceyi ve modern yapay zeka çözümlerini, kullanıcı odaklı ve yüksek performanslı yazılımlara dönüştürüyorum.',
      readJourney: 'Kariyer Yolculuğunu & Detayları Oku',
      manifestoBio:
        'Sistem mimarisi, yapay zeka modelleri ve interaktif modern web deneyimlerinin kesişiminde çalışıyorum. Tasarım ve mühendisliği birbirinden kopuk aşamalar olarak görmek yerine, tek bir akıcı süreçte birleştiriyorum. Otonom LLM ve RAG mimarilerinden mikrosaniye seviyesinde yanıt veren bulut servislerine kadar geliştirdiğim her çözümü, ölçeklenebilir standartlarda inşa ediyorum.',
      statRepos: 'GitHub Reposu',
      statHonors: 'Yüksek Onur (CGPA)',
      statAlgorithms: 'Algoritma Çözümü',
      featuredHeading: 'Öne Çıkan Mimariler & Çalışmalar',
      viewAllRepos: 'Tüm Repoları İncele',
      servicesTitle: 'Mühendislik ve Geliştirme Çözümleri',
      servicesSubtitle:
        'Modern ürünler, ölçeklenebilir platformlar ve yapay zeka tabanlı sistemler için sunduğum temel uzmanlıklar.',
      services: [
        {
          title: 'Full-Stack Web Geliştirme',
          desc: 'React, Vite, TypeScript ve FastAPI ile geliştirilen modern, ultra hızlı web mimarileri. Temiz kod yapısı, SEO görünürlüğü, yüksek erişilebilirlik ve sürdürülebilirlik odaklı mühendislik.',
          tags: ['React', 'TypeScript', 'FastAPI', 'Tailwind', 'PostgreSQL'],
        },
        {
          title: 'AI & Derin Öğrenme Sistemleri',
          desc: 'Canlıya hazır LLM pipeline\'ları, RAG mimarisi (Retrieval-Augmented Generation), vektörel veritabanı entegrasyonu (pgvector) ve otonom akıllı ajan sistemleri.',
          tags: ['Gemini / LLM', 'RAG Pipeline', 'pgvector', 'PyTorch', 'Embeddings'],
        },
        {
          title: 'Asenkron Mikroservisler & Bulut',
          desc: 'Yüksek eşzamanlılığa dayanıklı FastAPI asenkron servisleri, Neon Serverless PostgreSQL mimarisi, Docker konteynerizasyon ve güvenilir bulut veri tabanı altyapısı.',
          tags: ['FastAPI', 'Neon PostgreSQL', 'Docker', 'REST API', 'Redis'],
        },
        {
          title: 'Flutter & Çapraz Platform Mobil',
          desc: 'iOS ve Android ortamlarında tek bir kod tabanıyla çalışan, akıcı 60fps arayüz geçişlerine ve yerel platform performansına sahip modern mobil uygulamalar.',
          tags: ['Flutter', 'Dart', 'BLoC / Provider', 'iOS & Android', 'State Management'],
        },
      ],
      whyWorkTitle: 'Neden Birlikte Çalışmalıyız',
      whyWorkItems: [
        {
          number: '01',
          title: 'Doğrudan İletişim',
          desc: 'Aracı veya proje yöneticisi kalabalığı olmadan, doğrudan sistemi tasarlayan ve kodlayan mühendisle birebir iletişim.',
        },
        {
          number: '02',
          title: 'Tasarım ve Kod Uyumu',
          desc: 'Görsel zarafet ile sağlam mimarinin tek elden çıkması; tasarım ile nihai kod arasında hiçbir detay kaybı yaşanmaması.',
        },
        {
          number: '03',
          title: 'Canlıya Hazır Temiz Kod',
          desc: 'Yalnızca görsel maketler değil; tip güvenli, test edilebilir, mikroservis ve bulut veritabanı hazır production kalitesi.',
        },
        {
          number: '04',
          title: 'Hızlı İterasyon',
          desc: 'Yapay zeka destekli modern mühendislik araçlarıyla gereksiz gecikmeleri ortadan kaldıran yüksek tempolu teslimatlar.',
        },
      ],
      finalCtaTitle: 'Birlikte Etkileyici Bir Proje Geliştirelim.',
      copied: 'KOPYALANDI!',
      sendMessage: 'MESAJ GÖNDER',
    },
    featured: {
      badge: 'Portfolyo',
      title: 'Seçilmiş Projeler',
      viewAll: 'Tümünü Gör',
      inspect: 'İncele',
      ctaTitle: 'Birlikte yeni bir proje geliştirelim.',
      ctaDesc:
        'Fikirlerinizi yapay zeka destekli mobil ve full-stack mimarilere dönüştürmek için iletişime geçebilirsiniz.',
      ctaButton: 'İletişime Geç',
      liveProduction: 'CANLI PRODUCTION',
      architectureReadme: 'Mimari & README',
      liveDemo: 'Canlı Demo',
    },
    about: {
      title: 'Hakkımda',
      roleBadge: 'AI ENGINEER · MOBILE & FULL-STACK',
      bioP1:
        'Mühendislik vizyonumu; Machine Learning, Derin Öğrenme ve Üretken Yapay Zeka (AI) alanındaki teknik tutkum ile şekillendiriyorum. Kariyerimi yapay zekanın dönüştürücü gücüne adarken, bu modelleri yalnızca teoride bırakmayıp; gerçek dünya ihtiyaçlarına doğrudan yanıt veren uçtan uca üretime hazır ürünlere dönüştürüyorum.',
      bioP2:
        'Yapay zeka zekasını kullanıcının parmak uçlarına taşımak adına; Flutter ve Dart ile modern, reaktif ve yüksek performanslı cross-platform mobil uygulamalar geliştiriyorum. Eş zamanlı olarak React, Next.js, TypeScript ve FastAPI ile asenkron, ölçeklenebilir ve sağlam Full-Stack web mimarileri inşa ediyorum.',
      bioP3:
        'Kırklareli Üniversitesi Yazılım Mühendisliği akademik başarım (3.62 GPA), Yukatek Bilişim A.Ş. bünyesinde tamamladığım Retrieval-Augmented Generation (RAG) & LLM Ar-Ge stajım ve açık kaynak ekosisteminde geliştirdiğim 60+ proje ile; Python, Java, C#, Dart ve TypeScript teknolojilerinde yüksek mühendislik standartlarıyla çözümler üretiyorum.',
      quote:
        'Machine Learning ve Derin Öğrenme vizyonunu; modern mobil ve full-stack mühendisliğiyle buluşturarak hayatı kolaylaştıran dijital ekosistemler inşa ediyorum.',
      skillsTitle: 'Yetenekler & Uzmanlıklar',
      skillCategories: [
        {
          title: 'Yapay Zeka, ML & Derin Öğrenme',
          skills: [
            'PyTorch & Derin Öğrenme',
            'Makine Öğrenmesi (Regression / Classification)',
            'Retrieval-Augmented Generation (RAG) & LLMs',
            'Bilgisayarlı Görü (YOLOv8, SAM-2, OpenCV)',
            'Vektör Veritabanları (pgvector, ChromaDB)',
            'Pandas & NumPy Veri İşleme',
            'Semantik Arama & Embedding Mimarisi',
            'AI Ajanları & Prompt Mühendisliği',
          ],
        },
        {
          title: 'Mobil Uygulama Geliştirme (Mobile Dev)',
          skills: [
            'Flutter & Dart',
            'Cross-Platform Mobil Mimari (iOS / Android)',
            'Mobil UI/UX & Akıcı Animasyonlar',
            'State Management (Bloc / Provider)',
            'Firebase Mobile Backend Entegrasyonu',
            'Çevrimdışı Veri Yönetimi & Yerel Depolama',
            'RESTful & WebSocket Mobil İstemcileri',
            'Capacitor & Hibrit Mobil Dağıtımlar',
          ],
        },
        {
          title: 'Arka Uç (Backend) & Asenkron Mimariler',
          skills: [
            'Python & FastAPI (Asenkron API)',
            'Java & C# (OOP & Tasarım Desenleri)',
            'PostgreSQL & MySQL & DynamoDB',
            'SQLAlchemy, Pydantic & ORM',
            'Mikroservis Mimarisi & RESTful APIs',
            'Docker & Konteynerleştirme',
            'Redis & Alt-Milisaniye Önbellekleme',
            'WebSocket Gerçek Zamanlı Akışlar',
          ],
        },
        {
          title: 'Ön Yüz (Frontend) & Web Sistemleri',
          skills: [
            'React & Next.js',
            'TypeScript & Modern JavaScript',
            'Tailwind CSS v4 & Tasarım Sistemleri',
            'Framer Motion & 3D Etkileşimler',
            'State & Cache Yönetimi (SWR / React Query)',
            'Responsive Tasarım & Web Erişilebilirliği',
            'Performans & Core Web Vitals Optimizasyonu',
            'Figma to Production Code',
          ],
        },
        {
          title: 'Sistem Mimarisi, Bulut & Disiplin',
          skills: [
            'Temiz Mimari (Clean Architecture)',
            'Tasarım Desenleri (GoF Design Patterns)',
            'Git & GitHub Versiyon Kontrolü',
            'CI/CD Boru Hatları & GitHub Actions',
            'Linux / Bash Otomasyonu',
            'AWS & Bulut Dağıtım Süreçleri',
            'Veri Modellemesi & ETL',
            'Akademik Mühendislik Disiplini (3.62 GPA)',
          ],
        },
      ],
      educationTitle: 'Eğitim',
      educationItems: [
        {
          degree: 'Yazılım Mühendisliği Lisans',
          school: 'Kırklareli Üniversitesi',
          period: '2023 — 2027',
          gpa: 'GPA: 3.62 / 4.00 (Yüksek Onur)',
          description:
            'Algoritma analizi, dağıtık sistemler mimarisi, yapay zeka, görüntü işleme ve veri yapıları odaklı lisans mühendisliği eğitimi.',
        },
      ],
      certificatesTitle: 'Sertifikalar & Eğitimler',
      certificateItems: [
        {
          title: 'Makine Öğrenmesi Bootcamp',
          issuer: 'Tech Istanbul',
          period: '2024',
          description:
            'Derin öğrenme modelleri (CNN, ResNet), PyTorch optimizasyonları, makine öğrenmesi algoritmaları ve uçtan uca AI veri işleme boru hatları geliştirme eğitimi.',
        },
        {
          title: 'İleri Düzey Algoritmalar ve Veri Yapıları',
          issuer: 'BTK Akademi',
          period: '2024',
          description:
            'Karmaşıklık analizi (Asymptotic Notation & Big-O), dinamik programlama, graf teorisi, ağaç veri modelleri ve ileri algoritma optimizasyonları.',
        },
        {
          title: 'Algoritma Tasarımı',
          issuer: 'BTK Akademi',
          period: '2024',
          description:
            'Algoritmik düşünme stratejileri, böl ve yönet (Divide & Conquer), greedy yaklaşımlar ve sistematik problem çözme yöntemleri.',
        },
        {
          title: 'Veri Modelleme',
          issuer: 'BTK Akademi',
          period: '2024',
          description:
            'İlişkisel veritabanı tasarımı (RDBMS), normalizasyon aşamaları, varlık-ilişki (ER) diyagramları ve SQL optimizasyon prensipleri.',
        },
        {
          title: 'Sıfırdan C++ ve Programlama',
          issuer: 'Udemy',
          period: '2023',
          description:
            'Nesne yönelimli programlama (OOP), dinamik bellek yönetimi (pointers, references), Modern C++ özellikleri ve STL kütüphanesi.',
        },
        {
          title: 'Bilgi Teknolojilerine Giriş',
          issuer: 'BTK Akademi',
          period: '2023',
          description:
            'Bilgisayar mimarisi, işletim sistemleri temelleri, ağ protokolleri ve modern bilişim ekosistemlerinin altyapı standartları.',
        },
        {
          title: 'LinkedIn\'de Etkili Profil Oluşturma',
          issuer: 'BTK Akademi',
          period: '2024',
          description:
            'Mühendislik portfolyosu yönetimi, profesyonel ağ geliştirme, teknik yetkinliklerin doğru sunumu ve sektör görünürlüğü stratejileri.',
        },
      ],
    },
    experience: {
      eyebrow: 'Kariyer & Yolculuk',
      title: 'Deneyim',
      description:
        'Yazılım mühendisliği stajım, açık kaynaklı ve bağımsız SaaS çözümlerim ile teknoloji yolculuğum.',
      items: [
        {
          period: '2025 (8 Hafta / 40 İş Günü)',
          duration: 'Staj',
          role: 'Yazılım Mühendisliği Stajyeri',
          company: 'Yukatek Bilişim A.Ş.',
          location: 'Hibrit / İstanbul',
          description:
            'Modern web mimarileri, Web Workers ile performans optimizasyonu ve kurumsal seviye RAG (Retrieval-Augmented Generation) tabanlı CV analiz platformu (Beacon) geliştirilmesi.',
          achievements: [
            'ThreadLab Visualizer: Web Workers ile JavaScript ana iş parçacığı (main thread) tıkanıklığını engelleyen asenkron görev dağıtımı ve performans analizi sistemi kuruldu.',
            'Beacon RAG Pipeline: OpenAI text-embedding-3-small ve PostgreSQL pgvector (HNSW indeksi) ile 1536-boyutlu vektörleştirme ve milisaniyelik semantik aday arama altyapısı geliştirildi.',
            'Asenkron Kuyruk & Hibrit Karar: Redis + BullMQ ile 4 paralel worker üzerinden asenkron CV işleme kuyruğu ve GPT-4o-mini destekli hibrit (%20 Vektör + %80 LLM) reranking karar motoru inşa edildi.',
          ],
          skills: [
            'Astro 5',
            'TypeScript',
            'Express.js',
            'PostgreSQL (pgvector)',
            'Redis & BullMQ',
            'OpenAI API (RAG)',
            'Prisma',
            'Docker',
          ],
        },
        {
          period: '2024 — Günümüz',
          duration: 'Aktif',
          role: 'Full-Stack & Mobil / AI Proje Geliştirici',
          company: 'Bağımsız Projeler & Açık Kaynak',
          location: 'Uzaktan (Remote)',
          description:
            'Flutter ile modern mobil uygulamalar, React & TypeScript web platformları ve üretken yapay zeka (LLM & Makine Öğrenmesi) entegrasyonlu SaaS sistemleri geliştirme.',
          achievements: [
            'Skill-Identity-Engine: CV ve GitHub analizleriyle yetenek açığı tespiti ve kişiselleştirilmiş AI kariyer yol haritası üreten tam teşekküllü SaaS platformu geliştirildi.',
            'AI Medium Design: Trend verilerini kazıyarak Gemini API ile otonom teknik makale üreten ve otomatik yayınlayan içerik otomasyonu mimarisi kuruldu.',
            'Lexis App & Farm AI: Flutter ve Dart ile cross-platform mobil mimari, reaktif durum yönetimi ve yapay zeka destekli karar destek mekanizmaları entegre edildi.',
            'Chatter Stream: WebSocket protokolü ve event-driven mimari ile anlık çift yönlü iletişim sağlayan gerçek zamanlı mesajlaşma sistemi geliştirildi.',
          ],
          skills: [
            'React',
            'TypeScript',
            'Flutter & Dart',
            'Python',
            'FastAPI',
            'Machine Learning',
            'Gemini API',
            'Tailwind CSS',
            'PostgreSQL',
            'Docker',
          ],
        },
      ],
    },
    projects: {
      titlePrefix: 'Öne Çıkan',
      titleHighlight: 'Projelerim',
      subtitle:
        'GitHub üzerinden aktif olarak senkronize edilen, mimari yaklaşımlarımı ve yazılım projelerimi sergileyen çalışmalarım.',
      allFilter: 'Tümü',
      searchPlaceholder: 'Proje veya teknoloji ara...',
      noResults: 'Eşleşen proje bulunamadı.',
      noResultsHint: 'Filtreleri sıfırlamayı deneyin.',
      clearFilters: 'Filtreleri Temizle',
      code: 'Kod',
      readme: 'README İncele',
      demo: 'Demo',
    },
    contact: {
      title: 'İletişime Geçin',
      subtitle:
        'Bir projeniz mi var veya birlikte çalışmak mı istiyorsunuz? Fikirlerinizi konuşmaktan mutluluk duyarım.',
      emailCardTitle: 'E-posta',
      phoneCardTitle: 'Telefon',
      linkedinCardTitle: 'LinkedIn',
      copy: 'Kopyala',
      copied: 'Kopyalandı!',
      callNow: 'Hemen Ara',
      viewProfile: 'Profili Gör',
      nameLabel: 'Ad Soyad',
      namePlaceholder: 'Adınız ve Soyadınız',
      nameRequired: 'Lütfen adınızı ve soyadınızı girin.',
      emailLabel: 'E-posta',
      emailPlaceholder: 'ornek@alanadi.com',
      emailRequired: 'Lütfen e-posta adresinizi girin.',
      emailInvalid: 'Geçerli bir e-posta adresi girin.',
      messageLabel: 'Mesaj',
      messagePlaceholder: 'Projenizden veya iş birliği fikrinizden bahsedin...',
      messageRequired: 'Lütfen mesajınızı yazın.',
      messageMin: 'Mesajınız en az 10 karakter olmalıdır.',
      sendButton: 'Mesajı Gönder',
      sending: 'Kaydediliyor...',
      successTitle: 'Mesajınız Kaydedildi & İstemciniz Açıldı!',
      successDesc:
        'Mesajınız veritabanımıza kaydedildi ve e-posta uygulamanıza taslak olarak aktarıldı.',
      sendAnother: 'Yeni Mesaj Gönder',
    },
    footer: {
      description:
        'Yapay zeka, modern mobil mimariler ve ölçeklenebilir web sistemleri üzerine kurulu, kullanıcı deneyimini ve mühendislik kalitesini önceliklendiren kişisel portfolyo.',
      systemStatus: 'Sistem Durumu: Çevrimiçi',
      quickLinks: 'Hızlı Bağlantılar',
      connect: 'İletişim & Sosyal',
      rights: 'Tüm hakları saklıdır.',
      poweredBy: 'React & FastAPI ile güçlendirildi',
      backToTop: 'Başa Dön',
    },
    modal: {
      stars: 'Yıldız',
      forks: 'Fork',
      viewOnGithub: 'GitHub Repo',
      liveDemo: 'Canlı Demo',
      techStack: 'Kullanılan Teknolojiler',
      readmeTitle: 'GitHub README & Proje Dokümantasyonu',
      close: 'Kapat',
    },
  },

  en: {
    nav: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      experience: 'Experience',
      contact: 'Contact',
      cvDownload: 'Download CV',
      skipToContent: 'Skip to Content',
    },
    hero: {
      greetingBadge: "HELLO, I'M ÖMER ABALI",
      titleMain: 'SOFTWARE',
      titleAccent: 'ENGINEER',
      ctaProjects: 'EXPLORE PROJECTS',
      ctaContact: 'GET IN TOUCH',
      statusBadge: 'AVAILABLE FOR NEW PROJECTS',
      badge1: 'Full-Stack Developer',
      badge2: 'AI & LLM Engineer',
      badge3: 'Mobile App Developer',
      titleRole: 'AI Engineer · Mobile & Full-Stack Developer',
      bio: 'Transforming Machine Learning and Deep Learning models into fluid Flutter mobile apps and modern full-stack web platforms using React & FastAPI. Advancing as an AI Engineer and Full-Stack Developer.',
      viewProfile: 'View Profile',
      downloadCv: 'Download CV',
      statRepos: 'Open Source',
      statReposSub: 'GitHub repositories & architecture solutions',
      statGpa: 'Academic GPA',
      statGpaSub: 'Software Engineering GPA / 4.00',
      statArea: 'Primary Focus',
      statAreaSub: 'AI/ML, Mobile & Full-Stack Systems',
    },
    home: {
      marqueeItems: [
        'PYTHON • C# • JAVA • TYPESCRIPT • DART',
        'AI & MACHINE LEARNING (AI / ML)',
        'REACT & TAILWINDCSS FULL-STACK',
        'FLUTTER & KOTLIN MOBILE DEVELOPMENT',
        'GENERATIVE AI & IMAGE-TO-IMAGE TRANSFORMATION',
        'COMPUTER VISION & DEEP LEARNING',
        'DOCKER, AWS & LINUX DEVOPS',
        'WEBSOCKET REAL-TIME ARCHITECTURES',
        'POSTGRESQL, MYSQL & FIREBASE',
        'CLEAN ARCHITECTURE & SCALABLE SAAS',
      ],
      manifestoTitle:
        'Transforming algorithmic thinking and modern AI solutions into user-centric, high-performance software.',
      readJourney: 'Read Career Journey & Details',
      manifestoBio:
        'I operate at the intersection of system architecture, AI models, and interactive modern web experiences. Rather than treating design and engineering as disconnected steps, I unite them into a single fluid workflow. From autonomous LLMs and RAG pipelines to microsecond-latency cloud services, I build every solution to scalable production standards.',
      statRepos: 'GitHub Repositories',
      statHonors: 'High Honors (CGPA)',
      statAlgorithms: 'Algorithm Solutions',
      featuredHeading: 'Featured Architectures & Works',
      viewAllRepos: 'Explore All Repositories',
      servicesTitle: 'Engineering & Development Solutions',
      servicesSubtitle:
        'Core specializations I deliver for modern products, scalable platforms, and AI-powered systems.',
      services: [
        {
          title: 'Full-Stack Web Development',
          desc: 'Modern, ultra-fast web architectures built with React, Vite, TypeScript, and FastAPI. Focused on clean code, SEO visibility, high accessibility, and engineering sustainability.',
          tags: ['React', 'TypeScript', 'FastAPI', 'Tailwind', 'PostgreSQL'],
        },
        {
          title: 'AI & Deep Learning Systems',
          desc: 'Production-ready LLM pipelines, Retrieval-Augmented Generation (RAG) architectures, vector database integration (pgvector), and autonomous AI agent systems.',
          tags: ['Gemini / LLM', 'RAG Pipeline', 'pgvector', 'PyTorch', 'Embeddings'],
        },
        {
          title: 'Asynchronous Microservices & Cloud',
          desc: 'High-concurrency resilient FastAPI async services, Neon Serverless PostgreSQL architecture, Docker containerization, and reliable cloud database infrastructures.',
          tags: ['FastAPI', 'Neon PostgreSQL', 'Docker', 'REST API', 'Redis'],
        },
        {
          title: 'Flutter & Cross-Platform Mobile',
          desc: 'Fluid 60fps native-performance mobile applications running on iOS and Android from a single shared codebase with reactive architecture.',
          tags: ['Flutter', 'Dart', 'BLoC / Provider', 'iOS & Android', 'State Management'],
        },
      ],
      whyWorkTitle: 'Why Work With Me',
      whyWorkItems: [
        {
          number: '01',
          title: 'Direct Communication',
          desc: 'Direct one-on-one communication with the engineer designing and implementing the software, free of middlemen or project clutter.',
        },
        {
          number: '02',
          title: 'Design & Code Cohesion',
          desc: 'Seamless synergy where visual aesthetics and robust engineering emerge from a single hand without loss in translation.',
        },
        {
          number: '03',
          title: 'Production-Ready Clean Code',
          desc: 'Beyond mockups: strongly typed, fully testable, microservice- and cloud-ready architectures engineered for production scale.',
        },
        {
          number: '04',
          title: 'Rapid Iteration',
          desc: 'High-tempo delivery eliminating needless friction through modern AI-assisted engineering and automated workflows.',
        },
      ],
      finalCtaTitle: "Let's Build an Impactful Project Together.",
      copied: 'COPIED!',
      sendMessage: 'SEND MESSAGE',
    },
    featured: {
      badge: 'Portfolio',
      title: 'Featured Projects',
      viewAll: 'View All',
      inspect: 'Inspect',
      ctaTitle: "Let's build a project together.",
      ctaDesc:
        'Reach out to turn your concepts into AI-powered mobile apps and high-performance digital systems.',
      ctaButton: 'Get in Touch',
      liveProduction: 'LIVE PRODUCTION',
      architectureReadme: 'Architecture & README',
      liveDemo: 'Live Demo',
    },
    about: {
      title: 'About Me',
      roleBadge: 'AI ENGINEER · MOBILE & FULL-STACK',
      bioP1:
        'I drive my software engineering journey through a profound passion for Machine Learning, Deep Learning, and Generative AI. While dedicating my career to the transformative power of artificial intelligence, I ensure these models go beyond research into production-ready, highly reliable real-world systems.',
      bioP2:
        'To deliver intelligence directly to users, I build sleek, reactive, and high-performance cross-platform mobile apps with Flutter & Dart. Concurrently, I architect scalable, asynchronous Full-Stack web systems powered by React 19, Next.js, TypeScript, and FastAPI.',
      bioP3:
        'Backed by my Software Engineering academic honors (Kırklareli University - 3.62 GPA), my R&D internship at Yukatek Bilişim A.Ş. focusing on RAG & LLMs, and 60+ open-source repositories; I deliver robust engineering solutions across Python, Java, C#, Dart, and TypeScript.',
      quote:
        'Channeling the visionary power of Machine Learning & Deep Learning into everyday life through cutting-edge mobile and full-stack engineering.',
      skillsTitle: 'Skills & Capabilities',
      skillCategories: [
        {
          title: 'AI, Machine Learning & Deep Learning',
          skills: [
            'PyTorch & Deep Learning',
            'Machine Learning (Regression / Classification)',
            'Retrieval-Augmented Generation (RAG) & LLMs',
            'Computer Vision (YOLOv8, SAM-2, OpenCV)',
            'Vector DBs (pgvector, ChromaDB)',
            'Pandas & NumPy Data Processing',
            'Semantic Search & Embedding Pipelines',
            'Autonomous AI Agents & Prompt Engineering',
          ],
        },
        {
          title: 'Mobile Application Development',
          skills: [
            'Flutter & Dart',
            'Cross-Platform Architecture (iOS / Android)',
            'Mobile UI/UX & Fluid Animations',
            'State Management (Bloc / Provider)',
            'Firebase Mobile Backend Integration',
            'Offline-First Data & Local Persistence',
            'RESTful & WebSocket Mobile Clients',
            'Capacitor & Hybrid Deployments',
          ],
        },
        {
          title: 'Backend & Asynchronous Architectures',
          skills: [
            'Python & FastAPI (Async API)',
            'Java & C# (OOP & Design Patterns)',
            'PostgreSQL & MySQL & DynamoDB',
            'SQLAlchemy, Pydantic & ORM',
            'Microservices Architecture & RESTful APIs',
            'Docker & Containerization',
            'Redis & Sub-Millisecond Caching',
            'WebSocket Real-Time Event Streams',
          ],
        },
        {
          title: 'Frontend & Web Systems',
          skills: [
            'React 19 & Next.js',
            'TypeScript & Modern JavaScript',
            'Tailwind CSS v4 & Design Systems',
            'Framer Motion & 3D Web Experiences',
            'State & Cache Management (SWR / React Query)',
            'Responsive Layouts & Web Accessibility',
            'Performance & Core Web Vitals Optimization',
            'Figma to Production Code',
          ],
        },
        {
          title: 'System Design, Cloud & Discipline',
          skills: [
            'Clean Architecture Principles',
            'GoF Design Patterns',
            'Git & GitHub Version Control',
            'CI/CD Pipelines & GitHub Actions',
            'Linux / Bash Automation',
            'AWS & Cloud Deployments',
            'Data Modeling & ETL Workflows',
            'Academic Engineering Rigor (3.62 GPA)',
          ],
        },
      ],
      educationTitle: 'Education',
      educationItems: [
        {
          degree: 'B.Sc. in Software Engineering',
          school: 'Kırklareli University',
          period: '2023 — 2027',
          gpa: 'GPA: 3.62 / 4.00 (High Honors)',
          description:
            'Rigorous engineering curriculum focusing on algorithm analysis, distributed systems architecture, artificial intelligence, image processing, and data structures.',
        },
      ],
      certificatesTitle: 'Certificates & Trainings',
      certificateItems: [
        {
          title: 'Machine Learning Bootcamp',
          issuer: 'Tech Istanbul',
          period: '2024',
          description:
            'Intensive training on Deep Learning models (CNN, ResNet), PyTorch optimizations, machine learning algorithms, and end-to-end AI pipelines.',
        },
        {
          title: 'Advanced Level Algorithms and Data Structures',
          issuer: 'BTK Academy',
          period: '2024',
          description:
            'Asymptotic complexity analysis (Big-O), dynamic programming, graph theory, tree data structures, and advanced algorithm optimizations.',
        },
        {
          title: 'Algorithm Design',
          issuer: 'BTK Academy',
          period: '2024',
          description:
            'Algorithmic thinking strategies, Divide & Conquer paradigms, greedy techniques, and systematic mathematical problem-solving.',
        },
        {
          title: 'Data Modeling',
          issuer: 'BTK Academy',
          period: '2024',
          description:
            'Relational database design (RDBMS), normalization lifecycle, ER diagramming, and SQL performance modeling principles.',
        },
        {
          title: 'Learn C++ and Programming from Scratch',
          issuer: 'Udemy',
          period: '2023',
          description:
            'Object-Oriented Programming (OOP), dynamic memory management (pointers/references), Modern C++ standards, and STL library.',
        },
        {
          title: 'Introduction to Information Technology',
          issuer: 'BTK Academy',
          period: '2023',
          description:
            'Computer architecture, operating systems foundations, network protocols, and modern computing ecosystem principles.',
        },
        {
          title: 'Creating an Effective Profile on LinkedIn',
          issuer: 'BTK Academy',
          period: '2024',
          description:
            'Engineering portfolio positioning, technical personal branding, industry networking, and professional presence strategies.',
        },
      ],
    },
    experience: {
      eyebrow: 'Career & Journey',
      title: 'Experience',
      description:
        'Software engineering internship, open-source initiatives, and independent SaaS development journey.',
      items: [
        {
          period: '2025 (8 Weeks / 40 Days)',
          duration: 'Internship',
          role: 'Software Engineering Intern',
          company: 'Yukatek Bilişim A.Ş.',
          location: 'Hybrid / Istanbul',
          description:
            'Focusing on modern web architectures, Web Workers performance optimization, and engineering the enterprise RAG-based CV analytics platform (Beacon).',
          achievements: [
            'ThreadLab Visualizer: Built asynchronous task distribution and performance benchmarking with Web Workers to prevent main-thread UI blocking in JavaScript.',
            'Beacon RAG Pipeline: Implemented layout-aware resume parsing, OpenAI text-embedding-3-small vectorization, and PostgreSQL pgvector (HNSW) milisecond semantic talent search.',
            'Asynchronous Queue & Hybrid Decision: Engineered an asynchronous queue with Redis and 4 parallel BullMQ workers, combined with a GPT-4o-mini hybrid (20% Vector + 80% LLM) reranking engine.',
          ],
          skills: [
            'Astro 5',
            'TypeScript',
            'Express.js',
            'PostgreSQL (pgvector)',
            'Redis & BullMQ',
            'OpenAI API (RAG)',
            'Prisma',
            'Docker',
          ],
        },
        {
          period: '2024 — Present',
          duration: 'Active',
          role: 'Full-Stack & Mobile / AI Developer',
          company: 'Independent Projects & Open Source',
          location: 'Remote',
          description:
            'Developing cross-platform mobile apps with Flutter, full-stack web platforms with React & TypeScript, and Generative AI-powered SaaS solutions.',
          achievements: [
            'Skill-Identity-Engine: Built an AI career SaaS that analyzes resumes and GitHub repositories to detect skill gaps and generate personalized learning roadmaps.',
            'AI Medium Design: Architected an automated publishing platform utilizing trend scraping and Gemini API for autonomous technical article generation.',
            'Lexis App & Farm AI: Created fluid cross-platform mobile apps using Flutter and Dart with reactive state management and intelligent decision support features.',
            'Chatter Stream: Implemented a low-latency real-time communication platform utilizing WebSocket architecture and event-driven data streaming.',
          ],
          skills: [
            'React',
            'TypeScript',
            'Flutter & Dart',
            'Python',
            'FastAPI',
            'Machine Learning',
            'Gemini API',
            'Tailwind CSS',
            'PostgreSQL',
            'Docker',
          ],
        },
      ],
    },
    projects: {
      titlePrefix: 'My',
      titleHighlight: 'Portfolio',
      subtitle:
        'Showcasing open-source repositories and software architecture solutions synced directly from GitHub.',
      allFilter: 'All',
      searchPlaceholder: 'Search projects or technologies...',
      noResults: 'No matching projects found.',
      noResultsHint: 'Try resetting the filters.',
      clearFilters: 'Clear Filters',
      code: 'Code',
      readme: 'View README',
      demo: 'Demo',
    },
    contact: {
      title: 'Get in Touch',
      subtitle:
        'Have a project in mind or looking to collaborate? I would love to hear from you.',
      emailCardTitle: 'Email',
      phoneCardTitle: 'Phone',
      linkedinCardTitle: 'LinkedIn',
      copy: 'Copy',
      copied: 'Copied!',
      callNow: 'Call Now',
      viewProfile: 'View Profile',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your full name',
      nameRequired: 'Please enter your full name.',
      emailLabel: 'Email Address',
      emailPlaceholder: 'you@domain.com',
      emailRequired: 'Please enter your email address.',
      emailInvalid: 'Please enter a valid email address.',
      messageLabel: 'Message',
      messagePlaceholder: 'Tell me about your project or collaboration idea...',
      messageRequired: 'Please write your message.',
      messageMin: 'Your message must be at least 10 characters.',
      sendButton: 'Send Message',
      sending: 'Saving...',
      successTitle: 'Message Saved & Email Client Opened!',
      successDesc:
        'Your message has been stored in our database and a draft has been prepared in your email app.',
      sendAnother: 'Send Another Message',
    },
    footer: {
      description:
        'Personal engineering portfolio showcasing cutting-edge AI integrations, responsive mobile applications, and scalable full-stack web architectures.',
      systemStatus: 'System Status: Online',
      quickLinks: 'Quick Links',
      connect: 'Connect & Social',
      rights: 'All rights reserved.',
      poweredBy: 'Powered by React 19 & FastAPI',
      backToTop: 'Back to Top',
    },
    modal: {
      stars: 'Stars',
      forks: 'Forks',
      viewOnGithub: 'GitHub Repo',
      liveDemo: 'Live Demo',
      techStack: 'Technologies Used',
      readmeTitle: 'GitHub README & Project Documentation',
      close: 'Close',
    },
  },

  de: {
    nav: {
      home: 'Startseite',
      about: 'Über mich',
      projects: 'Projekte',
      experience: 'Erfahrung',
      contact: 'Kontakt',
      cvDownload: 'Lebenslauf',
      skipToContent: 'Zum Inhalt springen',
    },
    hero: {
      greetingBadge: 'HALLO, ICH BIN ÖMER ABALI',
      titleMain: 'SOFTWARE',
      titleAccent: 'INGENIEUR',
      ctaProjects: 'PROJEKTE ENTDECKEN',
      ctaContact: 'KONTAKT AUFNEHMEN',
      statusBadge: 'VERFÜGBAR FÜR NEUE PROJEKTE',
      badge1: 'Full-Stack Entwickler',
      badge2: 'KI & LLM Ingenieur',
      badge3: 'Mobile App Entwickler',
      titleRole: 'AI Engineer · Mobile & Full-Stack Developer',
      bio: 'Transformation von Machine Learning- und Deep Learning-Modellen in intuitive Flutter-Mobil-Apps und moderne Full-Stack-Webplattformen mit React & FastAPI. Zielgerichtet auf dem Weg als AI Engineer und Full-Stack Developer.',
      viewProfile: 'Profil ansehen',
      downloadCv: 'Lebenslauf herunterladen',
      statRepos: 'Open Source',
      statReposSub: 'GitHub Repositories & Architekturlösungen',
      statGpa: 'Akademischer Erfolg',
      statGpaSub: 'Softwaretechnik GPA / 4.00',
      statArea: 'Schwerpunkt',
      statAreaSub: 'KI/ML, Mobile & Full-Stack Systeme',
    },
    home: {
      marqueeItems: [
        'PYTHON • C# • JAVA • TYPESCRIPT • DART',
        'KÜNSTLICHE INTELLIGENZ & MASCHINELLES LERNEN',
        'REACT & TAILWINDCSS FULL-STACK',
        'FLUTTER & KOTLIN MOBILE ENTWICKLUNG',
        'GENERATIVE KI & IMAGE-TO-IMAGE-TRANSFORMATION',
        'COMPUTER VISION & DEEP LEARNING',
        'DOCKER, AWS & LINUX DEVOPS',
        'WEBSOCKET ECHTZEIT-ARCHITEKTUREN',
        'POSTGRESQL, MYSQL & FIREBASE',
        'CLEAN ARCHITECTURE & SKALIERBARE SAAS',
      ],
      manifestoTitle:
        'Transformation algorithmischen Denkens und moderner KI-Lösungen in benutzerzentrierte, hochperformante Software.',
      readJourney: 'Karriereweg & Details lesen',
      manifestoBio:
        'Ich arbeite an der Schnittstelle von Systemarchitektur, KI-Modellen und interaktiven modernen Weberlebnissen. Anstatt Design und Engineering getrennt zu betrachten, vereine ich sie in einem fließenden Prozess. Von autonomen LLMs und RAG-Pipelines bis hin zu Cloud-Services mit Mikrosekunden-Latenz baue ich skalierbare Lösungen nach Industriestandards.',
      statRepos: 'GitHub-Repositories',
      statHonors: 'Hohe Auszeichnung (CGPA)',
      statAlgorithms: 'Algorithmenlösungen',
      featuredHeading: 'Ausgewählte Architekturen & Arbeiten',
      viewAllRepos: 'Alle Repositories durchsuchen',
      servicesTitle: 'Engineering- & Entwicklungslösungen',
      servicesSubtitle:
        'Kernkompetenzen für moderne Produkte, skalierbare Plattformen und KI-gestützte Systeme.',
      services: [
        {
          title: 'Full-Stack-Webentwicklung',
          desc: 'Moderne, ultraschnelle Webarchitekturen mit React, Vite, TypeScript und FastAPI. Fokus auf sauberen Code, SEO-Sichtbarkeit und Barrierefreiheit.',
          tags: ['React', 'TypeScript', 'FastAPI', 'Tailwind', 'PostgreSQL'],
        },
        {
          title: 'KI- & Deep-Learning-Systeme',
          desc: 'Produktionsreife LLM-Pipelines, RAG-Architekturen (Retrieval-Augmented Generation), Vektordatenbank-Integration (pgvector) und autonome KI-Agenten.',
          tags: ['Gemini / LLM', 'RAG Pipeline', 'pgvector', 'PyTorch', 'Embeddings'],
        },
        {
          title: 'Asynchrone Microservices & Cloud',
          desc: 'Hochgradig parallele FastAPI-Dienste, Neon Serverless PostgreSQL-Architektur, Docker-Containerisierung und zuverlässige Cloud-Infrastruktur.',
          tags: ['FastAPI', 'Neon PostgreSQL', 'Docker', 'REST API', 'Redis'],
        },
        {
          title: 'Flutter & Plattformübergreifendes Mobile',
          desc: 'Flüssige mobile 60fps-Apps für iOS und Android aus einer einzigen Codebasis mit nativer Performance und reaktivem Zustandsmanagement.',
          tags: ['Flutter', 'Dart', 'BLoC / Provider', 'iOS & Android', 'State Management'],
        },
      ],
      whyWorkTitle: 'Warum wir zusammenarbeiten sollten',
      whyWorkItems: [
        {
          number: '01',
          title: 'Direkte Kommunikation',
          desc: 'Direkter persönlicher Austausch mit dem Ingenieur, der das System entwirft und programmiert – ohne Vermittler.',
        },
        {
          number: '02',
          title: 'Design- und Code-Kohärenz',
          desc: 'Visuelle Eleganz und solide Architektur aus einer Hand; kein Detailverlust zwischen Konzeption und fertigem Code.',
        },
        {
          number: '03',
          title: 'Produktionsreifer sauberer Code',
          desc: 'Nicht nur Mockups: typsichere, testbare Architekturen mit Microservices und Cloud-Datenbanken für den Produktiveinsatz.',
        },
        {
          number: '04',
          title: 'Schnelle Iteration',
          desc: 'KI-gestützte moderne Entwicklungsmethoden für eine zügige und verzögerungsfreie Projektrealisierung.',
        },
      ],
      finalCtaTitle: 'Lassen Sie uns gemeinsam ein beeindruckendes Projekt verwirklichen.',
      copied: 'KOPIERT!',
      sendMessage: 'NACHRICHT SENDEN',
    },
    featured: {
      badge: 'Portfolio',
      title: 'Ausgewählte Projekte',
      viewAll: 'Alle anzeigen',
      inspect: 'Prüfen',
      ctaTitle: 'Lassen Sie uns gemeinsam ein Projekt entwickeln.',
      ctaDesc:
        'Nehmen Sie Kontakt auf, um Ihre Ideen in KI-gestützte mobile Apps und moderne Softwaresysteme umzusetzen.',
      ctaButton: 'Kontakt aufnehmen',
      liveProduction: 'PRODUKTION LIVE',
      architectureReadme: 'Architektur & README',
      liveDemo: 'Live-Demo',
    },
    about: {
      title: 'Über mich',
      roleBadge: 'KI-INGENIEUR · MOBILE & FULL-STACK',
      bioP1:
        'Meine Ingenieursreise wird von einer tiefen Leidenschaft für Machine Learning, Deep Learning und Generative KI angetrieben. Ich widme meine Karriere der transformativen Kraft der künstlichen Intelligenz und sorge dafür, dass diese Modelle zu praxistauglichen, produktionsreifen Systemen werden.',
      bioP2:
        'Um intelligente Funktionen direkt an Benutzer zu liefern, entwickle ich reaktive und performante Cross-Platform-Apps mit Flutter & Dart. Parallel dazu erstelle ich skalierbare, asynchrone Full-Stack-Webarchitekturen mit React 19, Next.js, TypeScript und FastAPI.',
      bioP3:
        'Mit akademischen Spitzenleistungen (Universität Kırklareli - 3.62 GPA), meinem F&E-Praktikum bei Yukatek Bilişim A.Ş. (RAG & LLMs) und 60+ Open-Source-Repositories liefere ich solide Ingenieurlösungen in Python, Java, C#, Dart und TypeScript.',
      quote:
        'Verbindung von Machine Learning & Deep Learning mit moderner mobiler und Full-Stack-Technik zur Entwicklung zukunftssicherer digitaler Produkte.',
      skillsTitle: 'Fähigkeiten & Kompetenzen',
      skillCategories: [
        {
          title: 'KI, Machine Learning & Deep Learning',
          skills: [
            'PyTorch & Deep Learning',
            'Machine Learning (Regression / Klassifikation)',
            'Retrieval-Augmented Generation (RAG) & LLMs',
            'Computer Vision (YOLOv8, SAM-2, OpenCV)',
            'Vektordatenbanken (pgvector, ChromaDB)',
            'Pandas & NumPy Datenverarbeitung',
            'Semantische Suche & Embedding-Pipelines',
            'Autonome KI-Agenten & Prompt Engineering',
          ],
        },
        {
          title: 'Mobile App-Entwicklung',
          skills: [
            'Flutter & Dart',
            'Cross-Platform-Architektur (iOS / Android)',
            'Mobile UI/UX & Flüssige Animationen',
            'State Management (Bloc / Provider)',
            'Firebase Mobile Backend Integration',
            'Offline-First & Lokale Persistenz',
            'RESTful & WebSocket Mobile Clients',
            'Capacitor & Hybride Deployments',
          ],
        },
        {
          title: 'Backend & Asynchrone Architekturen',
          skills: [
            'Python & FastAPI (Asynchrone API)',
            'Java & C# (OOP & Entwurfsmuster)',
            'PostgreSQL & MySQL & DynamoDB',
            'SQLAlchemy, Pydantic & ORM',
            'Microservices Architektur & RESTful APIs',
            'Docker & Containerisierung',
            'Redis & Sub-Millisekunden Caching',
            'WebSocket Echtzeit-Event-Streams',
          ],
        },
        {
          title: 'Frontend & Websysteme',
          skills: [
            'React 19 & Next.js',
            'TypeScript & Modernes JavaScript',
            'Tailwind CSS v4 & Design-Systeme',
            'Framer Motion & 3D Weberlebnisse',
            'State & Cache Management (SWR / React Query)',
            'Responsive Layouts & Barrierefreiheit',
            'Performance & Core Web Vitals Optimierung',
            'Figma zu Production Code',
          ],
        },
        {
          title: 'Systemdesign, Cloud & Disziplin',
          skills: [
            'Clean Architecture Prinzipien',
            'GoF Design Patterns',
            'Git & GitHub Versionskontrolle',
            'CI/CD Pipelines & GitHub Actions',
            'Linux / Bash Automatisierung',
            'AWS & Cloud Deployments',
            'Datenmodellierung & ETL',
            'Akademische Ingenieursdisziplin (3.62 GPA)',
          ],
        },
      ],
      educationTitle: 'Ausbildung',
      educationItems: [
        {
          degree: 'B.Sc. in Softwaretechnik',
          school: 'Universität Kırklareli',
          period: '2023 — 2027',
          gpa: 'GPA: 3.62 / 4.00 (Hohe Auszeichnung)',
          description:
            'Schwerpunkte in Algorithmen, verteilten Systemarchitekturen, Künstlicher Intelligenz, Bildverarbeitung und Datenstrukturen.',
        },
      ],
      certificatesTitle: 'Zertifikate & Weiterbildungen',
      certificateItems: [
        {
          title: 'Machine Learning Bootcamp',
          issuer: 'Tech Istanbul',
          period: '2024',
          description:
            'Intensivtraining zu Deep-Learning-Modellen (CNN, ResNet), PyTorch-Optimierungen und End-to-End-KI-Datenpipelines.',
        },
        {
          title: 'Fortgeschrittene Algorithmen und Datenstrukturen',
          issuer: 'BTK Akademie',
          period: '2024',
          description:
            'Asymptotische Komplexitätsanalyse (Big-O), dynamische Programmierung, Graphentheorie und Datenstrukturoptimierung.',
        },
        {
          title: 'Algorithmenentwurf',
          issuer: 'BTK Akademie',
          period: '2024',
          description:
            'Algorithmische Denkparadigmen, Divide & Conquer, Greedy-Methoden und systematische mathematische Problemlösung.',
        },
        {
          title: 'Datenmodellierung',
          issuer: 'BTK Akademie',
          period: '2024',
          description:
            'Relationales Datenbankdesign (RDBMS), Normalisierungsphasen, ER-Diagramme und SQL-Optimierungsprinzipien.',
        },
        {
          title: 'C++ und Programmierung von Grund auf',
          issuer: 'Udemy',
          period: '2023',
          description:
            'Objektorientierte Programmierung (OOP), dynamische Speicherverwaltung (Pointers/References), modernes C++ und STL.',
        },
        {
          title: 'Einführung in die Informationstechnologie',
          issuer: 'BTK Akademie',
          period: '2023',
          description:
            'Computerarchitektur, Betriebssystemgrundlagen, Netzwerkprotokolle und Standards moderner IT-Infrastrukturen.',
        },
        {
          title: 'Effektives LinkedIn-Profil aufbauen',
          issuer: 'BTK Akademie',
          period: '2024',
          description:
            'Ingenieurportfolio-Positionierung, technisches Branding, professionelles Networking und Branchensichtbarkeit.',
        },
      ],
    },
    experience: {
      eyebrow: 'Karriere & Werdegang',
      title: 'Erfahrung',
      description:
        'Software-Engineering-Praktikum, Open-Source-Initiativen und eigenständige SaaS-Entwicklung.',
      items: [
        {
          period: '2025 (8 Wochen / 40 Tage)',
          duration: 'Praktikum',
          role: 'Software-Engineering-Praktikant',
          company: 'Yukatek Bilişim A.Ş.',
          location: 'Hybrid / Istanbul',
          description:
            'Schwerpunkt auf modernen Webarchitekturen, Web-Worker-Performance-Optimierung und der Entwicklung der unternehmensweiten RAG-basierten Lebenslauf-Analyseplattform Beacon.',
          achievements: [
            'ThreadLab Visualizer: Entwicklung asynchroner Aufgabenverteilung mit Web Workern zur Vermeidung von UI-Blockaden im JavaScript Main Thread.',
            'Beacon RAG-Pipeline: Implementierung von strukturbewusstem CV-Parsing, OpenAI-Vektorisierung und PostgreSQL pgvector (HNSW) für semantische Kandidatensuche.',
            'Asynchrone Pipeline & Hybrides Reranking: Aufbau einer asynchronen Pipeline mit Redis und 4 parallelen BullMQ-Workern sowie einer GPT-4o-mini gestützten hybriden Reranking-Engine.',
          ],
          skills: [
            'Astro 5',
            'TypeScript',
            'Express.js',
            'PostgreSQL (pgvector)',
            'Redis & BullMQ',
            'OpenAI API (RAG)',
            'Prisma',
            'Docker',
          ],
        },
        {
          period: '2024 — Heute',
          duration: 'Aktiv',
          role: 'Full-Stack & Mobile / KI-Entwickler',
          company: 'Unabhängige & Open-Source-Projekte',
          location: 'Remote',
          description:
            'Entwicklung plattformübergreifender mobiler Apps mit Flutter, Full-Stack-Websystemen mit React & TypeScript und generativer KI-SaaS-Plattformen.',
          achievements: [
            'Skill-Identity-Engine: Entwicklung einer KI-Karriere-SaaS zur Analyse von Lebensläufen und GitHub-Profilen mit Erkennung von Wissenslücken und personalisierten Roadmaps.',
            'AI Medium Design: Aufbau einer Content-Automatisierungsplattform mit Trend-Scraping und Gemini-API zur autonomen Erstellung technischer Artikel.',
            'Lexis App & Farm AI: Entwicklung responsiver Flutter- und Dart-Mobil-Apps mit reaktivem State-Management und KI-gestützten Entscheidungshilfen.',
            'Chatter Stream: Bereitstellung einer latenzarmen Echtzeit-Kommunikationsplattform basierend auf WebSocket-Architektur und ereignisgesteuertem Streaming.',
          ],
          skills: [
            'React',
            'TypeScript',
            'Flutter & Dart',
            'Python',
            'FastAPI',
            'Machine Learning',
            'Gemini API',
            'Tailwind CSS',
            'PostgreSQL',
            'Docker',
          ],
        },
      ],
    },
    projects: {
      titlePrefix: 'Mein',
      titleHighlight: 'Portfolio',
      subtitle:
        'Präsentation von Open-Source-Repositories und Softwarearchitekturlösungen, die direkt mit GitHub synchronisiert werden.',
      allFilter: 'Alle',
      searchPlaceholder: 'Projekte oder Technologien suchen...',
      noResults: 'Keine passenden Projekte gefunden.',
      noResultsHint: 'Versuchen Sie, die Filter zurückzusetzen.',
      clearFilters: 'Filter zurücksetzen',
      code: 'Code',
      readme: 'README ansehen',
      demo: 'Demo',
    },
    contact: {
      title: 'Kontakt aufnehmen',
      subtitle:
        'Haben Sie ein Projekt im Kopf oder möchten Sie zusammenarbeiten? Ich freue mich auf Ihre Nachricht.',
      emailCardTitle: 'E-Mail',
      phoneCardTitle: 'Telefon',
      linkedinCardTitle: 'LinkedIn',
      copy: 'Kopieren',
      copied: 'Kopiert!',
      callNow: 'Jetzt anrufen',
      viewProfile: 'Profil ansehen',
      nameLabel: 'Vollständiger Name',
      namePlaceholder: 'Ihr vollständiger Name',
      nameRequired: 'Bitte geben Sie Ihren vollständigen Namen ein.',
      emailLabel: 'E-Mail-Adresse',
      emailPlaceholder: 'beispiel@domain.de',
      emailRequired: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
      emailInvalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      messageLabel: 'Nachricht',
      messagePlaceholder: 'Beschreiben Sie Ihr Projekt oder Ihre Idee...',
      messageRequired: 'Bitte schreiben Sie Ihre Nachricht.',
      messageMin: 'Ihre Nachricht muss mindestens 10 Zeichen lang sein.',
      sendButton: 'Nachricht senden',
      sending: 'Wird gespeichert...',
      successTitle: 'Nachricht gespeichert & E-Mail-Client geöffnet!',
      successDesc:
        'Ihre Nachricht wurde in unserer Datenbank gespeichert und ein Entwurf in Ihrer E-Mail-App vorbereitet.',
      sendAnother: 'Weitere Nachricht senden',
    },
    footer: {
      description:
        'Persönliches Portfolio mit Fokus auf zukunftsweisende KI-Integrationen, moderne mobile Anwendungen und skalierbare Full-Stack-Webarchitekturen.',
      systemStatus: 'Systemstatus: Online',
      quickLinks: 'Schnellzugriff',
      connect: 'Kontakt & Soziales',
      rights: 'Alle Rechte vorbehalten.',
      poweredBy: 'Entwickelt mit React 19 & FastAPI',
      backToTop: 'Nach oben',
    },
    modal: {
      stars: 'Sterne',
      forks: 'Forks',
      viewOnGithub: 'GitHub Repo',
      liveDemo: 'Live-Demo',
      techStack: 'Verwendete Technologien',
      readmeTitle: 'GitHub README & Projektdokumentation',
      close: 'Schließen',
    },
  },
};
