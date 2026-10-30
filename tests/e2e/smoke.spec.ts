import { expect, test } from '@playwright/test';

test('la home carga con título y secciones principales', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  for (const id of ['nosotros', 'servicios', 'contacto']) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
});

test('captura de página completa', async ({ page }, info) => {
  await page.goto('/');
  await page.screenshot({ path: `test-results/home-${info.project.name}.png`, fullPage: true });
});
