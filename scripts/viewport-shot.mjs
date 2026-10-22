// node scripts/viewport-shot.mjs <route> <width> <height> <scrollY|#selector> <outfile> [origin]  -> viewport screenshot of the clone
import { chromium } from "playwright-core";
const [
  route = "/",
  w = "1440",
  h = "900",
  where = "0",
  out = "archive/screens/shot.png",
  origin = "http://localhost:3100",
] = process.argv.slice(2);
const mobile = +w < 600;
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({
  viewport: { width: +w, height: +h },
  ...(mobile ? { userAgent: UA, deviceScaleFactor: 1, isMobile: true, hasTouch: true } : {}),
});
const p = await ctx.newPage();
await p.goto(origin + route, { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(2500);
if (where.startsWith("#"))
  await p.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: "start" }), where);
else await p.evaluate((y) => scrollTo(0, y), +where);
await p.waitForTimeout(2800);
await p.screenshot({ path: out });
await b.close();
