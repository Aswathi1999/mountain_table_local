import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const width of [390, 820, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto('http://localhost:3000', { waitUntil: 'load' });
    const section = page.locator('#our-rooms');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await section.locator('img').evaluateAll(async images => Promise.all(images.map(image => image.decode())));
    await page.screenshot({ path: `archive/screens/rooms-concepts-${width}.png` });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (width < 768) {
      await section.getByRole('combobox').selectOption('1');
      await section.locator('summary').click();
      assert.equal(await section.locator('details').getAttribute('open'), '');
    } else {
      await section.getByRole('tab', { name: 'Room 1', exact: true }).focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await section.getByRole('tab', { name: 'Room 2', exact: true }).getAttribute('aria-selected'), 'true');
      assert.equal(await section.getByRole('tab', { name: 'Room 2', exact: true }).evaluate(el => el === document.activeElement), true);
    }
    await page.waitForTimeout(100);
    assert.equal(await section.locator('h3').innerText(), 'Room 2');
    await section.getByRole('button', { name: 'Next room', exact: true }).filter({ visible: true }).click();
    assert.equal(await section.locator('h3').innerText(), 'Room 3');
    await section.getByRole('button', { name: 'Next room', exact: true }).filter({ visible: true }).click();
    assert.equal(await section.locator('h3').innerText(), 'Room 1');
    assert.equal(await section.getByRole('link', { name: 'View Rooms' }).getAttribute('href'), '/rooms-booking');
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ width, overflow: false, errors, controls: 'passed' }));
    await page.close();
  }
  const nojs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await nojs.goto('http://localhost:3000', { waitUntil: 'load' });
  await nojs.locator('#our-rooms').scrollIntoViewIfNeeded();
  assert.equal(await nojs.locator('#our-rooms h2').isVisible(), true);
  assert.equal(await nojs.locator('#our-rooms h3').evaluate(el => getComputedStyle(el).opacity), '1');
  console.log('No-JS content and booking link available');
  await nojs.close();
  const animated = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await animated.goto('http://localhost:3000', { waitUntil: 'load' });
  await animated.locator('#our-rooms').scrollIntoViewIfNeeded();
  await animated.waitForTimeout(1800);
  await animated.locator('#our-rooms').getByRole('button', { name: 'Next room', exact: true }).filter({ visible: true }).click();
  await animated.waitForTimeout(450);
  await animated.screenshot({ path: 'archive/screens/rooms-concepts-transition.png' });
  await animated.waitForTimeout(6200);
  await animated.screenshot({ path: 'archive/screens/rooms-concepts-settled.png' });
  console.log('Normal-motion transition captured');
  await animated.close();
} finally {
  await browser.close();
}
