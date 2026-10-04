/**
 * Portfolyo Projeleri Yönetim ve Yapılandırma Dosyası
 * 
 * 1. Portfolyoda görünmesini istemediğin bir repo olursa EXCLUDED_REPOS dizisine adını ekleyebilirsin.
 * 2. Özel başlık, açıklama ve kategori vermek istediğin projeleri PROJECT_OVERRIDES ile düzenleyebilirsin.
 * 3. GitHub'da henüz Private olan projelerini MANUAL_ADDITIONAL_REPOS ile ekleyebilirsin.
 */

import type { Project } from '../types/project';

/**
 * Portfolyoda gösterilmeyecek / gizlenecek repolar listesi.
 * (Şu an tüm GitHub repolarının eksiksiz görünmesi için boş bırakıldı; gizlemek istediğin olursa buraya ekleyebilirsin.)
 */
export const EXCLUDED_REPOS: string[] = [];

/**
 * Başlığı veya açıklaması temizlenmek istenen projeler için editoryal ayarlar
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
  'me': {
    display_name: 'Me — Kişisel Portfolyo & Mühendislik Vitrini',
    description: 'React 19, Vite, TypeScript, Tailwind CSS v4 ve i18n çok dilli mimariyle geliştirilen editoryal mühendislik portfolyosu.',
    category: 'Web / Bulut',
    is_featured: true,
  },
  'omerabali': {
    display_name: 'omerabali — GitHub Geliştirici Profili & Ekosistem',
    description: 'Yazılım mühendisliği yetkinlikleri, açık kaynak çalışmaları ve kişisel GitHub geliştirici profili dokümantasyonu.',
    category: 'Yazılım',
  },
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
    is_featured: true,
  },
  'desk-ai': {
    display_name: 'Desk-AI — Masaüstü Yapay Zeka Asistanı',
    description: 'TypeScript, React ve Python ile geliştirilmiş akıllı masaüstü üretkenlik ve görev otomasyon aracı.',
    category: 'Yapay Zeka',
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
 * Varsa manuel eklenecek ek projeler
 */
export const MANUAL_ADDITIONAL_REPOS: Project[] = [];
