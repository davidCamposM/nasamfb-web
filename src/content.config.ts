import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const site = defineCollection({
  loader: file('src/content/site.json'),
  schema: z.object({
    nombre: z.string(),
    eslogan: z.string(),
    descripcion: z.string(),
    nosotros: z.object({ titulo: z.string(), texto: z.string() }),
    servicios: z.array(z.object({ titulo: z.string(), descripcion: z.string() })),
    cifras: z.array(z.object({ valor: z.string(), etiqueta: z.string() })),
    contacto: z.object({
      email: z.email(),
      telefono: z.string().optional(),
      direccion: z.string().optional(),
      redes: z.array(z.object({ nombre: z.string(), url: z.url() })).default([]),
    }),
  }),
});

export const collections = { site };
