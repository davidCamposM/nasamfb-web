import { getEntry } from 'astro:content';

/** Datos de la empresa desde src/content/site.json */
export async function getSite() {
  const entry = await getEntry('site', 'empresa');
  if (!entry) throw new Error('Falta la entrada "empresa" en src/content/site.json');
  return entry.data;
}

/** "+56 9 8718 5572" → "56987185572" */
export const soloDigitos = (telefono: string): string => telefono.replace(/\D/g, '');

/** Enlace de WhatsApp para un teléfono chileno con prefijo +56, con mensaje inicial opcional */
export const whatsapp = (telefono: string, mensaje?: string): string =>
  `https://wa.me/${soloDigitos(telefono)}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`;

/** Enlace para llamar: "+56 9 8718 5572" → "tel:+56987185572" */
export const telefonoHref = (telefono: string): string => `tel:+${soloDigitos(telefono)}`;
