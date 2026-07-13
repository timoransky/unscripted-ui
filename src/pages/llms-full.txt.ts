import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { componentToMarkdown } from '../lib/componentMarkdown';

// Every component page, inlined code and all, in one document — for
// dropping the whole library into an LLM's context at once.
export const GET: APIRoute = async () => {
  const entries = (await getCollection('components')).sort(
    (a, b) => a.data.order - b.data.order,
  );

  const body = [
    '# unscripted/ui — full component reference',
    '',
    '> shadcn-style components rebuilt on raw HTML and CSS primitives. Copy, paste, ship zero JavaScript.',
    '',
    ...entries.map((entry) => componentToMarkdown(entry)),
  ].join('\n---\n\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
