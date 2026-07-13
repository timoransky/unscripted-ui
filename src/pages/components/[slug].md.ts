import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { componentToMarkdown } from '../../lib/componentMarkdown';

export async function getStaticPaths() {
  const entries = await getCollection('components');
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

export const GET: APIRoute = ({ props }) => {
  const markdown = componentToMarkdown(props.entry);
  return new Response(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
