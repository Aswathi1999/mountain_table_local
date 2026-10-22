// node scripts/about-shots.mjs <width> <height> <outDir> [origin]  -> scrolls /about step by step, saving viewport shots + overflow/console report
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
const [w = "1440", h = "900", out = "archive/screens/about", origin = "http://localhost:3100"] = process.argv.slice(2);
const mobile = +w < 600;
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({
  viewport: { width: +w, height: +h },
  ...(mobile ? { userAgent: UA, isMobile: true, hasTouch: true } : {}),
  reducedMotion: process.env.REDUCE ? "reduce" : "no-preference",
});
const p = await ctx.newPage();
const errors = [];
p.on("console", (m) => ["error", "warning"].includes(m.type()) && errors.push(`${m.type()}: ${m.text()}`));
p.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
p.on("requestfailed", (r) => errors.push(`requestfailed: ${r.url()}`));
await p.goto(`${origin}/${process.env.ROUTE ?? "about"}`, { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(3000);
const total = await p.evaluate(() => document.documentElement.scrollHeight);
let n = 0;
for (let y = 0; y < total; y += +h * 0.9) {
  await p.evaluate((yy) => scrollTo(0, yy), y);
  await p.waitForTimeout(1700);
  await p.screenshot({ path: `${out}/${String(n++).padStart(2, "0")}.png` });
}
const report = await p.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  clientW: document.documentElement.clientWidth,
  height: document.documentElement.scrollHeight,
  wide: [...document.querySelectorAll("main *")]
    .filter((e) => e.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
    .slice(0, 8)
    .map((e) => `${e.tagName}.${String(e.className).slice(0, 50)} r=${Math.round(e.getBoundingClientRect().right)}`),
  h1: document.querySelectorAll("h1").length,
}));
console.log(JSON.stringify({ shots: n, ...report, errors }, null, 1));
await b.close();
