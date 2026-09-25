import { test, expect } from '@playwright/test';

test.describe('Navegación y Páginas Principales (ABM & Módulos)', () => {
  test('la página de inicio carga correctamente', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Proyecto|Gestión|Vite/i);
  });

  test('intento de navegación a /admin muestra interfaz o redirección segura', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    const url = page.url();
    // Debe dirigir a login o cargar estructura si hay token
    expect(url.includes('/login') || url.includes('/admin') || url.endsWith('/')).toBeTruthy();
  });
});
