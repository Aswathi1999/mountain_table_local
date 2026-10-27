// node scripts/shoot.mjs <route> <width> <height> <outPrefix> [ys=comma,separated|auto] [origin]
// Scrolls down in steps (so scroll-triggered animations fire), and saves a viewport screenshot at each requested scrollY
// (or every viewport height when ys is "auto"). Prints the page height and any console errors / horizontal overflow.
import { chromium } from "playwright-core";
const [route = "/", w = "1440", h = "900", out = "archive/screens/s", ys = "auto", origin = "http://localhost:3000"] =
  process.argv.slice(2);
const mobile = +w < 600;
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({
  viewport: { width: +w, height: +h },
  ...(mobile ? { userAgent: UA, deviceScaleFactor: 1, isMobile: true, hasTouch: true } : {}),
});
const p = await ctx.newPage();
const errors = [];
p.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
p.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 200)));
await p.goto(origin + route, { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(2600);
const total = await p.evaluate(() => document.documentElement.scrollHeight);
const list =
  ys === "auto" ? Array.from({ length: Math.ceil(total / +h) }, (_, i) => i * +h) : ys.split(",").map(Number);
let cur = 0;
for (const y of list) {
  while (cur < y) {
    cur = Math.min(y, cur + 300);
    await p.evaluate((v) => scrollTo(0, v), cur);
    await p.waitForTimeout(60);
  }
  cur = y;
  await p.evaluate((v) => scrollTo(0, v), y);
  await p.waitForTimeout(1900);
  await p.screenshot({ path: `${out}-${y}.png` });
}
const overflow = await p.evaluate(() => ({
  sw: document.documentElement.scrollWidth,
  cw: document.documentElement.clientWidth,
}));
console.log(JSON.stringify({ route, w, total, overflow, errors: errors.slice(0, 5), shots: list.length }));
await b.close();
