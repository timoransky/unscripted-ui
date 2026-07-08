import type { CollectionEntry } from 'astro:content';

// Raw component source and demo fragments, resolved the same way
// ComponentPreview.astro resolves them — one source of truth, no drift.
const rawMdx = import.meta.glob<string>('../content/components/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const demos = import.meta.glob<string>('../demos/**/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const cssFiles = import.meta.glob<string>('../demos/**/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function stripFrontmatter(raw: string): string {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  return match ? raw.slice(match[0].length) : raw;
}

function attr(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

// Flatten a <ComponentPreview demo="x/y" css="a/b" /> into the actual
// HTML (and any required CSS) as fenced code blocks — the payload an LLM
// or a human actually wants when they "copy the page".
function inlinePreview(tag: string): string {
  const demo = attr(tag, 'demo');
  if (!demo) return '';
  const html = demos[`../demos/${demo}.html`];
  if (html === undefined) return '';

  const blocks = ['```html\n' + html.trim() + '\n```'];

  const css = attr(tag, 'css');
  if (css) {
    const required = cssFiles[`../demos/${css}.css`];
    if (required !== undefined) {
      blocks.push('```css\n' + required.trim() + '\n```');
    }
  }
  return blocks.join('\n\n');
}

/**
 * Render a component doc page as standalone Markdown: frontmatter title +
 * description, prose, and every demo inlined as real code. This is what the
 * `.md` endpoints, `llms.txt`, and the "Copy Page" button all serve.
 */
export function componentToMarkdown(entry: CollectionEntry<'components'>): string {
  const raw = rawMdx[`../content/components/${entry.id}.mdx`];
  let body = raw !== undefined ? stripFrontmatter(raw) : (entry.body ?? '');

  body = body
    // Drop MDX-only ESM imports.
    .replace(/^import\s.*$/gm, '')
    // Inline component previews as fenced code.
    .replace(/<ComponentPreview\b[^>]*\/>/g, (tag) => inlinePreview(tag))
    // Collapse the blank runs left behind by removed imports.
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const { title, description } = entry.data;
  return `# ${title}\n\n> ${description}\n\n${body}\n`;
}
