import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('https://hotelaurelia.online/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(5000);
console.log((await page.locator('body').innerText()).slice(0, 16000));
console.log(await page.locator('section').evaluateAll(nodes => nodes.map(n => ({id:n.id, cls:n.className, text:n.innerText.slice(0,180)}))));
await page.screenshot({ path: 'archive/aurelia-rooms-reference-full.png', fullPage: true });
await browser.close();
