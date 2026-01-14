import { z } from 'zod';
import { products, insertProductSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    verify: {
      method: 'POST' as const,
      path: '/api/verify',
      input: z.object({
        productId: z.number(),
        selectedContainer: z.enum(['glass', 'plastic']),
        selectedPictograms: z.array(z.string())
      }),
      responses: {
        200: z.object({
          correct: z.boolean(),
          scoreDelta: z.number(),
          message: z.string(),
          correctContainer: z.string(),
          correctPictograms: z.array(z.string())
        }),
        404: errorSchemas.notFound,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
