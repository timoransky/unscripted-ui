import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { FEATURE_KEYS } from './data/features';

const components = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/components' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    features: z.array(z.enum(FEATURE_KEYS)).default([]),
    plainCss: z.boolean().default(false),
  }),
});

export const collections = { components };
