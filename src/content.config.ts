import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { FEATURE_KEYS } from './data/features';

const components = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/components' }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      order: z.number(),
      features: z.array(z.enum(FEATURE_KEYS)).default([]),
      plainCss: z.boolean().default(false),
    })
    .refine((data) => !(data.plainCss && data.features.length > 0), {
      message:
        'plainCss means "uses no leading-edge feature at all" — a component cannot set it and list features. Drop one.',
    }),
});

export const collections = { components };
