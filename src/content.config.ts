import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const site = defineCollection({
  loader: file('src/content/site.json'),
  schema: z.object({
    nombre: z.string(),
    titulo: z.string(),
    descripcion: z.string(),
    hero: z.object({
      titulo: z.string(),
      bajada: z.string(),
      ctaPrincipal: z.string(),
      ctaSecundario: z.string(),
      respaldo: z.string(),
    }),
    nosotros: z.object({
      manifiesto: z.string(),
      parrafos: z.array(z.string()),
      pilares: z.array(
        z.object({ titulo: z.string(), texto: z.string(), icono: z.enum(['compas', 'llave', 'camion']) }),
      ),
      respaldo: z.string(),
      foto: z.object({ alt: z.string(), pie: z.string() }),
      clientes: z.array(z.string()),
      presencia: z.array(z.object({ ciudad: z.string(), detalle: z.string() })),
      altFoto: z.string(),
    }),
    servicios: z.object({
      titulo: z.string(),
      bajada: z.string(),
      columnas: z.tuple([z.string(), z.string(), z.string()]),
      items: z.array(z.object({ sistema: z.string(), asegura: z.string(), como: z.string() })),
    }),
    marcas: z.object({
      titulo: z.string(),
      items: z.array(z.string()),
    }),
    contacto: z.object({
      titulo: z.string(),
      personas: z.array(z.object({ nombre: z.string(), ciudad: z.string(), telefono: z.string() })),
      email: z.email().optional(),
    }),
  }),
});

export const collections = { site };
