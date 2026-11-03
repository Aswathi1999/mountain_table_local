import { chromium } from 'playwright-core';
const reference = process.argv.includes('--reference');
const browser = await chromium.launch({ channel: 'chrome' });
for (const width of [1440, 390, 820]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
  await page.goto(reference ? 'https://hotelaurelia.online/' : 'http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const section = page.locator(reference ? '#stay' : '#our-rooms');
  await section.waitFor({timeout:60000});
  const y = await section.evaluate(n => n.getBoundingClientRect().top + window.scrollY);
  for(let pos=0;pos<y;pos+=400) { await page.evaluate(v=>window.scrollTo(0,v),pos); await page.waitForTimeout(80); }
  await page.evaluate(v=>window.scrollTo(0,v),y);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `archive/screens/rooms-${reference ? 'reference' : 'after'}-${width}.png` });
  if (reference && width === 1440) console.log(await section.innerHTML());
  console.log(JSON.stringify({width, box: await section.boundingBox()}));
  await page.close();
}
await browser.close();
