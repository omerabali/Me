import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Check, Copy, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface MarkdownViewerProps {
  content: string;
}

const MarkdownImage: React.FC<{ src?: string; alt?: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    return (
      <div className="my-3 flex items-center gap-2 rounded-xl border border-rule bg-paper p-3 text-xs text-ink-3">
        <ImageIcon className="h-4 w-4 text-ink-3" />
        <span>Görsel yüklenemedi: {alt || src}</span>
      </div>
    );
  }
  return (
    <figure className="my-4 overflow-hidden rounded-2xl border border-rule bg-paper shadow-md">
      <img
        src={src}
        alt={alt || 'Proje Görseli'}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full max-h-96 object-contain rounded-xl bg-surface/50"
      />
      {alt && (
        <figcaption className="p-2 text-center text-[11px] font-mono text-ink-3 border-t border-rule/40">
          {alt}
        </figcaption>
      )}
    </figure>
  );
};

const MarkdownCode: React.FC<any> = ({ className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const isInline = !match && !String(children).includes('\n');
  const codeString = String(children).replace(/\n$/, '');
  const [copied, setCopied] = useState(false);

  if (isInline) {
    return (
      <code
        className="rounded-md border border-rule bg-paper-sunk px-1.5 py-0.5 font-mono text-[11px] text-accent font-medium"
        {...props}
      >
        {children}
      </code>
    );
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-rule bg-paper shadow-sm">
      <div className="flex items-center justify-between border-b border-rule/60 bg-paper-sunk/60 px-4 py-1.5 text-[11px] font-mono text-ink-3">
        <span>{match ? match[1].toUpperCase() : 'KOD'}</span>
        <button
          type="button"
          onClick={copyCode}
          aria-label="Kodu Kopyala"
          className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-ink-2 hover:bg-surface hover:text-ink transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-positive" />
              <span className="text-positive text-[10px]">Kopyalandı</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="text-[10px]">Kopyala</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs text-ink leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
};

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  // Normalize newline characters if backend or JSON sent literal '\\n' sequences
  const normalizedContent = useMemo(() => {
    if (!content) return '';
    let text = content;
    if (text.includes('\\n')) {
      text = text.replace(/\\n/g, '\n');
    }
    if (text.includes('\\r')) {
      text = text.replace(/\\r/g, '');
    }
    return text.trim();
  }, [content]);

  return (
    <div className="markdown-prose text-xs md:text-sm text-ink leading-relaxed space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Başlıklar
          h1: ({ children }) => (
            <h1 className="font-display text-xl md:text-2xl font-extrabold text-ink pb-2 mb-3 border-b border-rule mt-6 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display text-lg md:text-xl font-bold text-ink pb-1.5 mb-2.5 border-b border-rule/60 mt-5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display text-base font-bold text-ink mb-2 mt-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-display text-sm font-bold text-ink mb-1.5 mt-3">
              {children}
            </h4>
          ),

          // Paragraflar
          p: ({ children }) => (
            <p className="text-ink-2 leading-relaxed mb-3">{children}</p>
          ),

          // Bağlantılar
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-accent hover:text-accent-deep underline underline-offset-2 transition-colors"
            >
              <span>{children}</span>
              <ExternalLink className="h-3 w-3 inline" />
            </a>
          ),

          // Görseller & Kod
          img: MarkdownImage,
          code: MarkdownCode,

          // Listeler
          ul: ({ children }) => (
            <ul className="my-3 space-y-1.5 pl-5 list-disc text-ink-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 space-y-1.5 pl-5 list-decimal text-ink-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),

          // Alıntılar (Blockquote)
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-3 border-accent bg-accent/5 px-4 py-2 text-xs md:text-sm text-ink-2 italic rounded-r-xl">
              {children}
            </blockquote>
          ),

          // Tablolar (GitHub Flavored Tables)
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-rule shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-paper-sunk text-ink font-mono font-semibold border-b border-rule">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 font-bold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 border-b border-rule/50 text-ink-2">
              {children}
            </td>
          ),

          // Ayraç Çizgisi
          hr: () => <hr className="my-6 border-rule/70" />,
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
};
