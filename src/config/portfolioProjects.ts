/**
 * Portfolyo Projeleri Yönetim ve Yapılandırma Dosyası
 * 
 * Burada:
 * 1. Portfolyoda görünmesini istemediğin (veya yinelenen) repoları EXCLUDED_REPOS içine ekleyebilirsin.
 * 2. Özel isim, açıklama ve kategori vermek istediğin projeleri PROJECT_OVERRIDES ile düzenleyebilirsin.
 * 3. GitHub'da henüz Private olan veya API'ye yansımamış 60. projeni MANUAL_ADDITIONAL_REPOS ile ekleyebilirsin.
 */

import type { Project } from '../types/project';

/**
 * Portfolyoda gösterilmeyecek / gizlenecek repolar:
 * - omerabali (Profil README deposu)
 * - public-apis (Fork repo)
 * - staj (STAJ22001'in eski kopyası / çift proje)
 * - Quiz_app (new_quiz_app ve QUIZ-APP varken eski yinelenen kopya)
 * - C-Mini-Projeler-Ornekleri (C-Mini-Projeler varken çift kopya)
 */
export const EXCLUDED_REPOS: string[] = [
  'omerabali',
  'public-apis',
  'staj',
  'quiz_app',
  'c-mini-projeler-ornekleri',
];

/**
 * Başlığı veya kategorisi hatalı okunan repolar için temiz başlıklar ve açıklamalar
 */
export const PROJECT_OVERRIDES: Record<
  string,
  {
    display_name?: string;
    description?: string;
    category?: string;
    image_url?: string;
    is_featured?: boolean;
  }
> = {
  'terrawatch': {
    display_name: 'TerraWatch — Akıllı Tarım & IoT Analiz Platformu',
    description: 'React 18, TypeScript ve Supabase ile geliştirilen otonom tarımsal sensör izleme ve sinyal analiz ekosistemi.',
    category: 'Yapay Zeka',
  },
  'chatter-stream': {
    display_name: 'Chatter-Stream — Gerçek Zamanlı Mesajlaşma',
    description: 'React, Tailwind CSS ve TypeScript ile geliştirilen modern WebSocket destekli anlık iletişim platformu.',
    category: 'Web / Bulut',
  },
  'skill-identity-engine': {
    display_name: 'Skill Identity Engine — Yetkinlik Radarı',
    description: 'AI Destekli Kariyer Radarı: CV & GitHub analizi, dinamik yetkinlik eşleştirme ve kariyer yol haritası motoru.',
    category: 'Yapay Zeka',
    is_featured: true,
  },
  'staj22001': {
    display_name: 'STAJ22001 — Staj Dosyası & Projeleri',
    description: 'Staj süreci boyunca geliştirilen alt projeleri ve teknik çalışmaları içeren ana staj deposu.',
    category: 'Yazılım',
  },
  'desk-ai': {
    display_name: 'Desk-AI — Masaüstü Yapay Zeka Asistanı',
    description: 'TypeScript, React ve Python ile geliştirilmiş akıllı masaüstü üretkenlik ve görev otomasyon aracı.',
    category: 'Yapay Zeka',
    is_featured: true,
  },
  'ai-medium-design': {
    display_name: 'AI Medium — Akıllı İçerik & Blog Platformu',
    description: 'React, Tailwind CSS ve TypeScript ile geliştirilmiş modern, editoryal içerik ve AI destekli yayıncılık platformu.',
    category: 'Web / Bulut',
    is_featured: true,
  },
  'new_quiz_app': {
    display_name: 'Quiz App — İnteraktif Mobil Sınav Uygulaması',
    description: 'Flutter ve Dart ile geliştirilmiş, kullanıcı dostu modern mobil bilgi yarışması ve sınav uygulaması.',
    category: 'Mobil',
  },
  'sms-bombardiman': {
    display_name: 'SMS Test & Güvenlik Aracı',
    description: 'Hizmet ve API yük/stres testleri için geliştirilmiş Python tabanlı otomasyon aracı.',
    category: 'Yazılım',
  },
};

/**
 * Eğer GitHub'da Private olan veya API'ye yansımamış 60. bir projen varsa buraya doğrudan ekleyebilirsin.
 */
export const MANUAL_ADDITIONAL_REPOS: Project[] = [];
