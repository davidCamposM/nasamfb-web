import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  // Se prueba el build de producción en un puerto propio: el servidor de desarrollo (4321) agrega su
  // barra de herramientas y genera las imágenes al vuelo, lo que altera las pruebas.
  use: { baseURL: 'http://localhost:4329' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4329',
    url: 'http://localhost:4329',
    reuseExistingServer: false,
    timeout: 240000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
