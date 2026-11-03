import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    problem: z.string(),
    tried: z.string(),
    worked: z.string(),
    result: z.string(),
    metrics: z.array(z.string()).min(1),
    stack: z.array(z.string()).min(1),
    order: z.number().int(),
  }),
});

const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['stub', 'draft', 'published']),
    order: z.number().int(),
  }),
});

export const collections = { caseStudies, essays };
