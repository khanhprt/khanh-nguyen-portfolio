import { test, expect } from '@playwright/test';

async function settleScene(page) {
  // Wait for the scrubbed world, rather than assuming a fixed animation duration.
  await expect.poll(async () => {
    const first = await page.locator('#track').boundingBox();
    await page.waitForTimeout(160);
    const second = await page.locator('#track').boundingBox();
    return Math.abs(first.x - second.x);
  }).toBeLessThan(0.5);
}

test('home renders locally with no runtime errors or external assets', async ({ page }) => {
  const errors = [];
  const externalRequests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:5173') && !request.url().startsWith('data:')) externalRequests.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Khanh Nguyen');
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
  await expect(page.locator('.pixel-scene-hero')).toBeVisible();
  await expect(page.locator('.station')).toHaveCount(9);
  await expect(page.locator('.frame')).toHaveCount(5);
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test('language selection persists after reload and supports Escape', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('.lang-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('#language-options button[lang="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.lead')).toContainText('websites');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(toggle).toContainText('EN');
});

test('project detail opens, remains inside the viewport and restores focus', async ({ page }, testInfo) => {
  await page.goto('/?lang=en');
  if (testInfo.project.name === 'mobile') {
    await page.locator('.dock-tabs button').nth(2).click();
    await page.locator('.dock-next').click();
  } else {
    await page.locator('.nav-links a[href="#projects"]').click();
  }
  const frame = page.locator('.frame').first();
  await expect(frame).toBeInViewport();
  await settleScene(page);
  await frame.click();
  const dialog = page.locator('dialog[open]');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h3')).toHaveText('POD Fulfillment');
  await expect(dialog.locator('.case dd')).toHaveCount(3);
  const overflow = await dialog.evaluate((element) => element.scrollWidth - element.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(frame).toBeFocused();
});

test('contact validates fields and opens email without claiming server delivery', async ({ page }, testInfo) => {
  await page.goto('/?lang=en');
  if (testInfo.project.name === 'mobile') {
    await page.locator('.dock-tabs button').last().click();
    await page.locator('.dock-next').click();
  } else {
    await page.locator('.nav-links a[href="#contact"]').click();
  }
  const form = page.locator('.contact-form:visible');
  await expect(form).toBeInViewport();
  await settleScene(page);
  await form.getByRole('button', { name: 'Send message' }).click();
  expect(await form.locator('input[name="name"]').evaluate((element) => element.validity.valueMissing)).toBe(true);
  await form.locator('input[name="name"]').fill('Test Visitor');
  await form.locator('input[name="email"]').fill('visitor@example.com');
  await form.locator('textarea').fill('A frontend portfolio project.');
  await form.getByRole('button', { name: 'Send message' }).click();
  await expect(form.getByRole('status')).toContainText('email');
  if (testInfo.project.name === 'mobile') {
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(page.locator('.dock-next')).toBeFocused();
  }
});

test('reduced motion falls back to fully readable vertical content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lang=en');
  await expect(page.locator('html')).not.toHaveClass(/h-mode/);
  await expect(page.locator('.stage-dock')).toHaveCount(0);
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect(page.locator('#proj-title')).toBeInViewport();
  await page.locator('.frame').first().click();
  await expect(page.locator('dialog[open] h3')).toHaveText('POD Fulfillment');
});

test('resize keeps content and navigation usable without duplicate docks', async ({ page }) => {
  const errors=[];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.setViewportSize({width:390,height:844});
  await expect(page.locator('.stage-dock')).toHaveCount(1);
  await page.locator('.dock-next').click();
  await expect(page.locator('.dock-tabs .is-active')).toContainText('H');
  await page.setViewportSize({width:1440,height:900});
  await expect(page.locator('.stage-dock')).toHaveCount(0);
  await expect(page.locator('html')).toHaveClass(/h-mode/);
  expect(errors).toEqual([]);
});
