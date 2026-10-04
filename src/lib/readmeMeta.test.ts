import { describe, it, expect } from 'vitest';
import {
  extractMetaFromReadme,
  extractTitle,
  extractDescription,
  extractTags,
  guessCategory,
} from './readmeMeta';

const QUIZ_README = `# Quiz Uygulaması (Flutter)

Bu proje, öğrencilerin temel programlama dilleri ve teknolojileri üzerindeki bilgilerini test etmelerini sağlayan modern ve interaktif bir mobil quiz uygulamasıdır. Material 3 tasarım prensipleriyle geliştirilmiş, kullanıcı dostu ve akıcı bir deneyim sunar.

## 🚀 Özellikler

- **Dört Farklı Kategori:** Java, Flutter, Python ve React konularında uzmanlık testleri.
- **Dinamik Soru Havuzu:** Her kategori için yerel JSON dosyalarından yüklenen sorular.

## 🛠️ Kullanılan Teknolojiler

- **Flutter & Dart:** Uygulama geliştirme framework'ü.
- **Material 3:** Modern kullanıcı arayüzü bileşenleri.
- **Google Fonts:** Profesyonel tipografi.

## 📦 Kurulum

1. Flutter SDK kurulu olsun.
`;

describe('extractTitle', () => {
  it('reads first H1 and strips emoji', () => {
    expect(extractTitle('# 🚀 My App\n\nHello')).toBe('My App');
    expect(extractTitle(QUIZ_README)).toBe('Quiz Uygulaması (Flutter)');
  });

  it('returns null when no H1', () => {
    expect(extractTitle('## Only H2\n\ntext')).toBeNull();
  });
});

describe('extractDescription', () => {
  it('takes first paragraph after H1', () => {
    const desc = extractDescription(QUIZ_README);
    expect(desc).toContain('mobil quiz uygulamasıdır');
    expect(desc!.length).toBeLessThanOrEqual(220);
  });

  it('skips lists and code blocks', () => {
    const md = `# Title\n\n- list item\n\nReal paragraph about the product here.\n`;
    expect(extractDescription(md)).toContain('Real paragraph');
  });
});

describe('extractTags', () => {
  it('pulls tags from tech section and known dictionary', () => {
    const tags = extractTags(QUIZ_README);
    expect(tags.some((t) => /flutter/i.test(t))).toBe(true);
    expect(tags.some((t) => /dart/i.test(t))).toBe(true);
    expect(tags.some((t) => /material/i.test(t))).toBe(true);
  });

  it('reads shields.io badge labels', () => {
    const md = `# X\n\n![React](https://img.shields.io/badge/React-19-blue)\n![TS](https://img.shields.io/badge/TypeScript-5-blue)\n`;
    const tags = extractTags(md);
    expect(tags.map((t) => t.toLowerCase())).toEqual(
      expect.arrayContaining(['react', 'typescript'])
    );
  });
});

describe('guessCategory', () => {
  it('detects mobile from Flutter README', () => {
    expect(guessCategory(QUIZ_README)).toBe('mobile');
  });

  it('detects ai-ml from YOLO content', () => {
    expect(guessCategory('# Vision\n\nYOLOv8 object detection with PyTorch.')).toBe('ai-ml');
  });

  it('detects web-cloud from React/Vite', () => {
    expect(guessCategory('# Site\n\nReact + Vite + Tailwind portfolio.')).toBe('web-cloud');
  });
});

describe('extractMetaFromReadme', () => {
  it('returns combined meta for quiz README', () => {
    const meta = extractMetaFromReadme(QUIZ_README);
    expect(meta.title).toBe('Quiz Uygulaması (Flutter)');
    expect(meta.description).toBeTruthy();
    expect(meta.tags.length).toBeGreaterThan(0);
    expect(meta.categoryHint).toBe('mobile');
  });

  it('handles empty input', () => {
    const meta = extractMetaFromReadme('');
    expect(meta.title).toBeNull();
    expect(meta.description).toBeNull();
    expect(meta.tags).toEqual([]);
    expect(meta.categoryHint).toBe('software-algo');
  });
});
