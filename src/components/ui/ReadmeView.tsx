import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { USER } from '../../lib/github';

interface ReadmeViewProps {
  repo: string;
  md: string;
}

export const ReadmeView: React.FC<ReadmeViewProps> = ({ repo, md }) => {
  const base = `https://raw.githubusercontent.com/${USER}/${repo}/HEAD/`;

  return (
    <div className="prose dark:prose-invert max-w-none text-ink leading-relaxed break-words text-sm sm:text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        urlTransform={(url) =>
          /^(https?:|#|mailto:)/.test(url) ? url : base + url.replace(/^\.?\//, '')
        }
      >
        {md}
      </ReactMarkdown>
    </div>
  );
};
