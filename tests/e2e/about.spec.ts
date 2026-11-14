import { expect, test } from '@playwright/test';

test('Nosotros permite explorar productos con botones y teclado', async ({ page }) => {
  await page.goto('/');
  const gallery = page.locator('[data-product-gallery]');
  await expect(gallery).toHaveAttribute('data-enhanced', 'true');
  await expect(gallery.locator('[data-gallery-panel]:visible')).toHaveCount(1);
  const total = await gallery.locator('[data-gallery-panel]').count();
  await expect(gallery.locator('[data-gallery-status]')).toContainText(`1 / ${total}`);

  const selected = gallery.getByRole('button', { name: 'Elementos filtrantes', exact: true });
  await selected.click();
  await expect(selected).toHaveAttribute('aria-pressed', 'true');
  await expect(gallery.locator('[data-gallery-status]')).toContainText(`2 / ${total}`);
  await expect(gallery.locator('#producto-1')).toBeVisible();
  await expect
    .poll(() =>
      gallery
        .locator('#producto-1 img.product-gallery__image')
        .evaluate((img) => (img as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);

  await selected.press('ArrowRight');
  await expect(gallery.locator('#producto-2')).toBeVisible();
  await expect(selected).toBeFocused();
  await gallery.getByRole('button', { name: 'Ver imagen siguiente' }).click();
  await expect(gallery.locator('#producto-3')).toBeVisible();
  await gallery.getByRole('button', { name: 'Ver imagen anterior' }).click();
  await expect(gallery.locator('#producto-2')).toBeVisible();
  await expect(gallery.locator('[aria-pressed="true"]')).toHaveCount(1);

  // Desde la primera foto, "anterior" da la vuelta hasta la última.
  await gallery.getByRole('button', { name: 'Cartuchos plisados', exact: true }).click();
  await expect(gallery.locator('#producto-0')).toBeVisible();
  await gallery.getByRole('button', { name: 'Ver imagen anterior' }).click();
  await expect(gallery.locator(`#producto-${total - 1}`)).toBeVisible();
});

test('Nosotros respeta movimiento reducido y muestra el respaldo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const gallery = page.locator('[data-product-gallery]');
  await gallery.getByRole('button', { name: 'Elementos filtrantes', exact: true }).click();
  await expect(gallery.locator('#producto-1')).toBeVisible();
  expect(await gallery.locator('#producto-1').evaluate((panel) => panel.getAnimations().length)).toBe(0);
  // Clientes de referencia solo como texto (sin logos, decisión del cliente).
  await expect(page.locator('.about-facts')).toContainText('Armada de Chile');
  await expect(page.locator('.about-facts')).toContainText('Asmar Talcahuano');
});

test.describe('Nosotros sin JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('todas las imágenes permanecen disponibles', async ({ page }) => {
    await page.goto('/');
    const gallery = page.locator('[data-product-gallery]');
    const total = await gallery.locator('[data-gallery-panel]').count();
    expect(total).toBeGreaterThan(1);
    await expect(gallery.locator('[data-gallery-panel]:visible')).toHaveCount(total);
    await expect(gallery.locator('[data-gallery-controls]')).toBeHidden();
  });
});

test('la galería conserva la imagen anterior durante una carga lenta', async ({ page }) => {
  await page.route(/elementos-filtrantes.*\.avif/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    await route.fallback();
  });
  await page.goto('/');
  const gallery = page.locator('[data-product-gallery]');
  await gallery.getByRole('button', { name: 'Elementos filtrantes', exact: true }).click();
  await expect(gallery).toHaveAttribute('aria-busy', 'true');
  await expect(gallery.locator('#producto-0')).toBeVisible();
  await expect(gallery.locator('#producto-1')).toBeVisible();
  await expect(gallery).toHaveAttribute('aria-busy', 'false');
});

test('un error de imagen mantiene la galería utilizable', async ({ page }) => {
  await page.route(/filtros-aire.*\.avif/, (route) => route.fulfill({ status: 404, body: '' }));
  await page.goto('/');
  const gallery = page.locator('[data-product-gallery]');
  await gallery.getByRole('button', { name: 'Filtros de aire', exact: true }).click();
  await expect(gallery.locator('[data-gallery-status]')).toContainText('No se pudo cargar');
  await expect(gallery.locator('#producto-0')).toBeVisible();
  await gallery.getByRole('button', { name: 'Elementos filtrantes', exact: true }).click();
  await expect(gallery.locator('#producto-1')).toBeVisible();
});

test('la galería se activa tras volver desde la página 404', async ({ page }) => {
  await page.goto('/404.html');
  await page.getByRole('link', { name: 'Volver al inicio' }).click();
  const gallery = page.locator('[data-product-gallery]');
  await expect(gallery).toHaveAttribute('data-enhanced', 'true');
  await gallery.getByRole('button', { name: 'Ver imagen siguiente' }).click();
  await expect(gallery.locator('#producto-1')).toBeVisible();
});
