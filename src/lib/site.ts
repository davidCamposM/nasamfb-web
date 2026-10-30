import { getEntry } from 'astro:content';

/** Datos de la empresa desde src/content/site.json */
export async function getSite() {
  const entry = await getEntry('site', 'empresa');
  if (!entry) throw new Error('Falta la entrada "empresa" en src/content/site.json');
  return entry.data;
}
