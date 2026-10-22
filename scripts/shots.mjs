import { chromium } from "playwright-core";
const [route = "/", width = "1280", ...ys] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({
  viewport: { width: +width, height: +width < 600 ? 812 : 900 },
  ...(+width < 600
    ? {
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        deviceScaleFactor: 2,
      }
    : {}),
  isMobile: +width < 600,
  hasTouch: +width < 600,
});
const p = await ctx.newPage();
await p.goto((process.env.ORIGIN ?? "https://www.themountaintable.in") + route, { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(4000);
for (const y of ys) {
  await p.evaluate((y) => scrollTo(0, y), +y);
  await p.waitForTimeout(1800);
  await p.screenshot({
    path: `archive/screens/${process.env.TAG ?? "vp"}-${route === "/" ? "home" : route.slice(1)}-${width}-${y}.png`,
  });
}
await b.close();
