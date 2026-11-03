import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://jannataresort.com/');
await page.waitForTimeout(4000);
console.log(await page.locator('h1').filter({hasText:'THE RESORT'}).evaluate(e=>e.closest('section')?.outerHTML || e.parentElement.parentElement.parentElement.outerHTML));
console.log(await page.locator('body').evaluate(e=>Array.from(e.querySelectorAll('*')).filter(x=>x.scrollHeight>x.clientHeight+900).map(x=>({tag:x.tagName,cls:x.className,h:x.clientHeight,scroll:x.scrollHeight,overflow:getComputedStyle(x).overflow,transform:getComputedStyle(x).transform})).slice(0,20)));
await page.mouse.move(900,600);
await page.locator('.block-card-section').first().evaluate(section => {
  console.log('section');
  let el=section;
  while(el){el.style.setProperty('visibility','visible','important');el.style.setProperty('display','block','important');el.style.setProperty('overflow','visible','important');el.style.setProperty('height','auto','important');el.style.setProperty('transform','none','important');el=el.parentElement;}
  section.querySelectorAll('.rev_item').forEach(el=>el.style.opacity='1');
  section.scrollIntoView();
});
await page.waitForTimeout(2000);
await page.screenshot({path:'archive/screens/jannata-section.png'});
console.log(await page.locator('.block-card-section').first().evaluate(e=>[e,...e.querySelectorAll('.block-entry,.inner,.picture,.box,.rev_clip,.block-card-shadow')].map(x=>({cls:x.className,css:getComputedStyle(x).cssText,rect:x.getBoundingClientRect().toJSON(),bg:getComputedStyle(x).background,padding:getComputedStyle(x).padding,clip:getComputedStyle(x).clipPath}))));
for (let i = 0; i < 4; i++) {
  await page.mouse.wheel(0, 750);
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `archive/screens/jannata-wheel-${i}.png` });
}
await browser.close();


