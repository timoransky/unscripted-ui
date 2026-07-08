import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// https://llmstxt.org/ — a map of the site for language models.
export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? '';
  const entries = (await getCollection('components')).sort(
    (a, b) => a.data.order - b.data.order,
  );

  const body = [
    '# unscripted/ui',
    '',
    '> shadcn-style components rebuilt on raw HTML and CSS primitives. Copy, paste, ship zero JavaScript.',
    '',
    'Every component is plain HTML + Tailwind utilities with no runtime. Each page below',
    'is available as Markdown (with the full copy-paste code inlined) at the linked URL.',
    '',
    '## Components',
    '',
    ...entries.map(
      (entry) =>
        `- [${entry.data.title}](${base}/components/${entry.id}.md): ${entry.data.description}`,
    ),
    '',
    '## Optional',
    '',
    `- [Full text](${base}/llms-full.txt): every component page concatenated into one document`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
