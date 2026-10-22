// node scripts/crop.mjs <route> <width> <name> <pageY> <height> [x] [w]  -> archive/screens/crop-<name>.png (document coordinates)
import { chromium } from "playwright-core";
const [route, width, name, y, h, x = "0", w] = process.argv.slice(2);
const mobile = +width < 600;
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({
  viewport: { width: +width, height: mobile ? 812 : 900 },
  ...(mobile
    ? {
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      }
    : {}),
});
const p = await ctx.newPage();
await p.goto("https://www.themountaintable.in" + route, { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(3500);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let s = 0; s < H; s += 350) {
  await p.evaluate((s) => scrollTo(0, s), s);
  await p.waitForTimeout(150);
}
await p.evaluate((y) => scrollTo(0, y), Math.max(0, +y - 80));
await p.waitForTimeout(2500);
await p.screenshot({
  path: `archive/screens/crop-${name}.png`,
  fullPage: true,
  clip: { x: +x, y: +y, width: +(w ?? (await p.evaluate(() => innerWidth)) - +x), height: +h },
});
await b.close();
