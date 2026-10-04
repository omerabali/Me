import { describe, it, expect } from 'vitest';
import { resolveUrl, normalizeRepoPath, getImageFallbackUrls } from './urlResolver';

describe('normalizeRepoPath', () => {
  it('normalizes basic relative paths and slashes', () => {
    expect(normalizeRepoPath('docs/a.png')).toBe('docs/a.png');
    expect(normalizeRepoPath('./docs/a.png')).toBe('docs/a.png');
    expect(normalizeRepoPath('/docs/a.png')).toBe('docs/a.png');
    expect(normalizeRepoPath('///docs/sub/b.png')).toBe('docs/sub/b.png');
  });

  it('prevents directory traversal outside root', () => {
    expect(normalizeRepoPath('../a.png')).toBe('a.png');
    expect(normalizeRepoPath('../../docs/../a.png')).toBe('a.png');
    expect(normalizeRepoPath('docs/../../a.png')).toBe('a.png');
  });

  it('handles spaces and Turkish characters properly without double encoding', () => {
    expect(normalizeRepoPath('docs/türkçe başlık.png')).toBe('docs/t%C3%BCrk%C3%A7e%20ba%C5%9Fl%C4%B1k.png');
    // Zaten encode edilmişse çift encode yapmamalı
    expect(normalizeRepoPath('docs/t%C3%BCrk%C3%A7e%20ba%C5%9Fl%C4%B1k.png')).toBe('docs/t%C3%BCrk%C3%A7e%20ba%C5%9Fl%C4%B1k.png');
  });
});

describe('resolveUrl', () => {
  const ctx = { owner: 'omerabali', repo: 'Me' };

  describe('image URLs', () => {
    it('leaves absolute https and shields.io intact', () => {
      const shield = 'https://img.shields.io/badge/react-19-blue';
      expect(resolveUrl(shield, 'image', ctx)).toBe(shield);

      const userAttachment = 'https://github.com/user-attachments/assets/123-abc';
      expect(resolveUrl(userAttachment, 'image', ctx)).toBe(userAttachment);

      const ghContent = 'https://raw.githubusercontent.com/omerabali/Me/main/logo.png';
      expect(resolveUrl(ghContent, 'image', ctx)).toBe(ghContent);
    });

    it('handles protocol-relative //host URLs', () => {
      expect(resolveUrl('//cdn.example.com/pic.png', 'image', ctx)).toBe('https://cdn.example.com/pic.png');
    });

    it('resolves relative paths to jsDelivr CDN', () => {
      expect(resolveUrl('docs/a.png', 'image', ctx)).toBe('https://cdn.jsdelivr.net/gh/omerabali/Me/docs/a.png');
      expect(resolveUrl('./docs/a.png', 'image', ctx)).toBe('https://cdn.jsdelivr.net/gh/omerabali/Me/docs/a.png');
      expect(resolveUrl('/docs/a.png', 'image', ctx)).toBe('https://cdn.jsdelivr.net/gh/omerabali/Me/docs/a.png');
      expect(resolveUrl('../a.png', 'image', ctx)).toBe('https://cdn.jsdelivr.net/gh/omerabali/Me/a.png');
    });

    it('converts github.com blob URLs with or without ?raw=true to raw.githubusercontent.com', () => {
      const blobWithRaw = 'https://github.com/omerabali/Me/blob/main/screenshot.png?raw=true';
      expect(resolveUrl(blobWithRaw, 'image', ctx)).toBe('https://raw.githubusercontent.com/omerabali/Me/main/screenshot.png');

      const blobWithoutRaw = 'https://github.com/omerabali/Me/blob/v1.0.0/assets/img.png';
      expect(resolveUrl(blobWithoutRaw, 'image', ctx)).toBe('https://raw.githubusercontent.com/omerabali/Me/v1.0.0/assets/img.png');
    });

    it('allows safe data:image URIs and blocks svg+xml', () => {
      const pngData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
      expect(resolveUrl(pngData, 'image', ctx)).toBe(pngData);

      const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
      expect(resolveUrl(webpData, 'image', ctx)).toBe(webpData);

      const svgData = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxzY3JpcHQ+YWxlcnQoMSk8L3NjcmlwdD48L3N2Zz4=';
      expect(resolveUrl(svgData, 'image', ctx)).toBe('');
    });

    it('blocks dangerous protocols like javascript: and vbscript:', () => {
      expect(resolveUrl('javascript:alert(1)', 'image', ctx)).toBe('#');
      expect(resolveUrl('vbscript:msgbox', 'image', ctx)).toBe('#');
    });

    it('correctly provides fallback URLs for relative images', () => {
      const fallbacks = getImageFallbackUrls('docs/hero.png', ctx);
      expect(fallbacks).toEqual({
        primary: 'https://cdn.jsdelivr.net/gh/omerabali/Me/docs/hero.png',
        fallback: 'https://raw.githubusercontent.com/omerabali/Me/HEAD/docs/hero.png',
      });

      // Mutlak URL için fallback gerekmez (null döner)
      expect(getImageFallbackUrls('https://example.com/hero.png', ctx)).toBeNull();
    });
  });

  describe('link URLs', () => {
    it('leaves absolute links, mailto and anchors intact', () => {
      expect(resolveUrl('https://google.com', 'link', ctx)).toBe('https://google.com');
      expect(resolveUrl('mailto:omer@example.com', 'link', ctx)).toBe('mailto:omer@example.com');
      expect(resolveUrl('#kurulum', 'link', ctx)).toBe('#kurulum');
    });

    it('converts relative file links to GitHub blob URL', () => {
      expect(resolveUrl('docs/KURULUM.md', 'link', ctx)).toBe('https://github.com/omerabali/Me/blob/HEAD/docs/KURULUM.md');
      expect(resolveUrl('./LICENSE', 'link', ctx)).toBe('https://github.com/omerabali/Me/blob/HEAD/LICENSE');
    });

    it('blocks dangerous protocols in links', () => {
      expect(resolveUrl('javascript:alert(document.cookie)', 'link', ctx)).toBe('#');
    });
  });
});
