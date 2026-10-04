import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGemoji from 'remark-gemoji';
import { remarkAlert } from 'remark-github-blockquote-alert';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import 'remark-github-blockquote-alert/alert.css';
import { Check, Copy, ImageOff } from 'lucide-react';
import { resolveUrl, getImageFallbackUrls } from '../../lib/urlResolver';

export interface ReadmeViewProps {
  repo: string;
  md: string;
  owner?: string;
  className?: string;
}

// 5.2 Sanitize şeması:
// İzin ver: p, div, span, center, br, hr, img, a, picture, source, details, summary, table/thead/tbody/tr/th/td, kbd, sub, sup, h1-h6, ul/ol/li, input[type=checkbox][disabled]
// Engelle: script, iframe, object, embed, style, form, on* handlers
const customSanitizeSchema: any = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'details',
    'summary',
    'picture',
    'source',
    'center',
    'div',
    'span',
    'kbd',
    'sub',
    'sup',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'p',
    'br',
    'hr',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'input',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...(defaultSchema.attributes?.['*'] || []),
      'align',
      'className',
      'id',
      'title',
      'ariaHidden',
    ],
    img: [
      'src',
      'alt',
      'title',
      'width',
      'height',
      'align',
      'loading',
      'decoding',
      'dataFallback',
    ],
    source: ['srcSet', 'media', 'type'],
    a: ['href', 'title', 'target', 'rel'],
    details: ['open'],
    input: [
      ['type', 'checkbox'],
      ['disabled', true],
      'checked',
    ],
    code: ['className'],
  },
  // Protokol kısıtlaması (javascript:, data: svg engelle)
  protocols: {
    ...defaultSchema.protocols,
    href: ['http', 'https', 'mailto'],
    src: ['http', 'https', 'data'],
  },
};

/**
 * Göreli URL'leri rehype AST ağacında dönüştüren plugin
 */
const rehypeResolveUrlsPlugin = (ctx: { owner: string; repo: string }) => () => (tree: any) => {
  const walk = (node: any) => {
    if (node.type === 'element') {
      const props = node.properties || (node.properties = {});

      // <img> ve <source> etiketleri
      if (node.tagName === 'img' && typeof props.src === 'string') {
        const originalSrc = props.src;
        props.src = resolveUrl(originalSrc, 'image', ctx);

        // Fallback zinciri için ikincil URL'i sakla
        const fallbacks = getImageFallbackUrls(originalSrc, ctx);
        if (fallbacks) {
          props['data-fallback'] = fallbacks.fallback;
        }
      }

      if (node.tagName === 'source' && typeof props.srcSet === 'string') {
        // srcset birden fazla virgülle ayrılmış URL içerebilir
        const parts = props.srcSet.split(',').map((p: string) => {
          const trimmed = p.trim();
          const [url, ...rest] = trimmed.split(/\s+/);
          const resolved = resolveUrl(url, 'image', ctx);
          return [resolved, ...rest].join(' ');
        });
        props.srcSet = parts.join(', ');
      }

      // <a> link etiketleri
      if (node.tagName === 'a' && typeof props.href === 'string') {
        const href = props.href;
        props.href = resolveUrl(href, 'link', ctx);

        // Mutlak linkler yeni sekmede açılsın, #anchor hariç
        if (!props.href.startsWith('#')) {
          props.target = '_blank';
          props.rel = 'noopener noreferrer';
        }
      }
    }
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(walk);
    }
  };
  walk(tree);
};

/**
 * Resim bileşeni: jsDelivr -> raw.githubusercontent -> Hata Kutusu fallback zinciri
 */
function MarkdownImage({ src, alt, 'data-fallback': dataFallback, ...rest }: any) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasFailed, setHasFailed] = useState(false);
  const triedFallback = useRef(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasFailed(false);
    triedFallback.current = false;
  }, [src]);

  const handleError = () => {
    if (!triedFallback.current && dataFallback && currentSrc !== dataFallback) {
      triedFallback.current = true;
      setCurrentSrc(dataFallback);
    } else {
      setHasFailed(true);
    }
  };

  if (hasFailed) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-rule bg-paper text-ink-3 text-xs my-1 select-none">
        <ImageOff className="w-3.5 h-3.5 text-ink-3 shrink-0" />
        <span>Görsel yüklenemedi {alt ? `(${alt})` : ''}</span>
      </span>
    );
  }

  // Rozetler (shields.io vb.) inline ve düzgün boşluklu olmalı
  const isBadge = typeof currentSrc === 'string' && (currentSrc.includes('shields.io') || currentSrc.includes('badge'));

  return (
    <img
      src={currentSrc}
      alt={alt || ''}
      onError={handleError}
      loading="lazy"
      decoding="async"
      className={isBadge ? 'inline-block my-1 mr-1.5 align-middle max-h-6' : 'max-w-full h-auto rounded-lg my-2 inline-block'}
      {...rest}
    />
  );
}

/**
 * Mermaid diyagram renderer.
 * Parse hatasında mermaid'in "bomb" UI'sını bastırıp ham kodu gösterir.
 */
function MermaidBlock({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setError(false);

    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        const isDark = document.documentElement.classList.contains('dark');
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: isDark ? 'dark' : 'default',
          // v10+: hata SVG/bomb ekranını DOM'a basmayı engeller
          suppressErrorRendering: true,
        } as any);

        // Önce parse — geçersiz diyagramda render'a girme
        await mermaid.parse(code);

        const id = 'mermaid-' + Math.random().toString(36).slice(2, 9);
        const { svg } = await mermaid.render(id, code);

        if (!active) return;
        if (!svg || /syntax error/i.test(svg)) {
          setError(true);
          return;
        }
        if (ref.current) {
          ref.current.innerHTML = svg;
          setError(false);
        }
      } catch (err) {
        console.warn('[Mermaid] render error:', err);
        // Mermaid bazen body'ye hata düğümü bırakır; temizle
        document
          .querySelectorAll('[id^="dmermaid-"], .error-icon, svg[aria-roledescription="error"]')
          .forEach((el) => {
            if (el.textContent?.includes('Syntax error') || el.id.startsWith('dmermaid-')) {
              el.remove();
            }
          });
        if (active) {
          if (ref.current) ref.current.innerHTML = '';
          setError(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [code]);

  if (error) {
    return (
      <div className="my-4 overflow-hidden rounded-xl border border-amber-500/30 bg-[#0d1117]">
        <div className="border-b border-white/10 px-4 py-1.5 font-mono text-[11px] text-amber-200/90">
          mermaid — diyagram çizilemedi, ham kaynak
        </div>
        <pre className="m-0 overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#e6edf3]">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="my-4 flex justify-center overflow-x-auto rounded-xl border border-rule bg-paper/50 p-4"
    />
  );
}

/**
 * Kod bloğu ve Kopyala butonu
 */
function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const textContent = String(children || '').replace(/\n$/, '');
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';

  if (lang === 'mermaid') {
    return <MermaidBlock code={textContent} />;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="readme-code-block group relative my-4 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] text-[#e6edf3] shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#161b22] px-4 py-1.5 font-mono text-xs text-[#8b949e]">
        <span>{lang || 'text'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 text-xs text-[#8b949e] transition-colors hover:bg-white/5 hover:text-[#e6edf3]"
          title="Kodu kopyala"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="font-sans text-emerald-400">Kopyalandı!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="font-sans">Kopyala</span>
            </>
          )}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto bg-[#0d1117] p-4 font-mono text-xs leading-relaxed sm:text-sm">
        <code className={`hljs ${className || ''}`} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export const ReadmeView: React.FC<ReadmeViewProps> = ({
  repo,
  md,
  owner = 'omerabali',
  className = '',
}) => {
  const context = useMemo(() => ({ owner, repo }), [owner, repo]);

  const rehypePlugins = useMemo(() => {
    return [
      rehypeRaw,
      [rehypeSanitize, customSanitizeSchema],
      rehypeResolveUrlsPlugin(context),
      rehypeSlug,
      [rehypeHighlight, { plainText: ['mermaid'] }],
    ] as any;
  }, [context]);

  const remarkPlugins = useMemo(() => {
    return [remarkGfm, remarkGemoji, remarkAlert] as any;
  }, []);

  return (
    <article
      className={`readme-view prose max-w-none text-ink leading-relaxed break-words text-sm sm:text-base prose-headings:text-ink prose-p:text-ink prose-li:text-ink prose-strong:text-ink prose-a:text-accent ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          img: MarkdownImage,
          pre: ({ children }: any) => {
            // Kod blokları CodeBlock tarafından ele alınır
            return <>{children}</>;
          },
          code: ({ className: codeClassName, children, ...props }: any) => {
            // react-markdown v10+: `inline` prop yok.
            // Blok: language-* class veya çok satırlı içerik; aksi halde inline (tablodaki `code` dahil).
            const text = String(children ?? '');
            const hasLanguage = /language-[\w-]+/.test(codeClassName || '');
            const isBlock = hasLanguage || text.includes('\n');

            if (!isBlock) {
              return (
                <code
                  className="readme-inline-code rounded-md border border-rule bg-paper-sunk px-1.5 py-0.5 font-mono text-[0.85em] text-accent"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock className={codeClassName} {...props}>
                {children}
              </CodeBlock>
            );
          },
          table: ({ children, ...props }: any) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-rule">
              <table className="!my-0 w-full" {...props}>
                {children}
              </table>
            </div>
          ),
          center: ({ children, ...props }: any) => (
            <div className="text-center my-3" {...props}>
              {children}
            </div>
          ),
          a: ({ href, children, ...props }: any) => {
            const resolved = href ? resolveUrl(href, 'link', context) : '#';
            const isAnchor = resolved.startsWith('#');
            return (
              <a
                href={resolved}
                {...(!isAnchor && resolved !== '#'
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {md}
      </ReactMarkdown>
    </article>
  );
};

export default ReadmeView;
