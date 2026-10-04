import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ReadmeView } from './ReadmeView';

const TEST_README = `
<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue" alt="react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue" alt="ts" />
</p>

## Tablo

| A | B |
|---|---|
| 1 | 2 |

Emoji 🚀 ve :rocket:

<details><summary>Detay</summary>İçerik</details>

- [x] Görev tamam
- [ ] Bekleyen

![Göreli](./docs/diagram.png)

\`\`\`mermaid
graph LR
  A --> B
\`\`\`

\`\`\`typescript
const x: number = 1;
\`\`\`

> [!NOTE]
> Not bloğu

[İç link](#tablo)

[evil](javascript:alert(1))

<script>alert('xss')</script>
<img src=x onerror="alert(1)">
<iframe src="https://evil.com"></iframe>
`;

describe('ReadmeView render', () => {
  it('renders GitHub-like markdown without executing XSS', () => {
    const html = renderToStaticMarkup(<ReadmeView repo="Me" md={TEST_README} owner="omerabali" />);

    expect(html).toContain('img.shields.io');
    expect(html).toContain('cdn.jsdelivr.net/gh/omerabali/Me/docs/diagram.png');
    expect(html).toContain('typescript');
    expect(html.toLowerCase()).not.toContain('<script');
    expect(html).not.toContain('onerror=');
    expect(html).not.toContain('<iframe');
    expect(html).not.toMatch(/href="javascript:/i);
  });

  it('renders fenced code inside a dark high-contrast shell', () => {
    const md = '```js\nconst a = 1;\n```';
    const html = renderToStaticMarkup(<ReadmeView repo="Me" md={md} owner="omerabali" />);
    expect(html).toContain('readme-code-block');
    expect(html).toContain('bg-[#0d1117]');
    expect(html).toContain('Kopyala');
  });

  it('keeps table backtick cells as inline code, not CodeBlock cards', () => {
    const md = `
## Schema

| Table Entity | Responsibility |
|---|---|
| \`public.email_threads\` | Aggregate node with \`hotel_id\` |
| \`public.emails\` | Messages |

\`\`\`typescript
const x = 1;
\`\`\`
`;
    const html = renderToStaticMarkup(<ReadmeView repo="HotelMailBot" md={md} owner="omerabali" />);

    expect(html).toContain('<table');
    expect(html).toContain('public.email_threads');
    expect(html).toContain('readme-inline-code');
    // Tablo hücrelerinde CodeBlock "Kopyala" kartı olmamalı
    const tableSection = html.slice(html.indexOf('<table'), html.indexOf('</table>') + 8);
    expect(tableSection).not.toContain('Kopyala');
    expect(tableSection).not.toContain('>text</span>');
    // Fenced block hâlâ CodeBlock
    expect(html).toContain('typescript');
    expect(html).toContain('Kopyala');
  });
});
