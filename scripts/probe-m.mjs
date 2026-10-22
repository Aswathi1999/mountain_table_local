// node scripts/probe-m.mjs <url> "<js expression>" [width=320] [height=693]
import { chromium } from "playwright-core";
const [url, expr, w = "320", h = "693"] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({
  viewport: { width: +w, height: +h },
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const p = await ctx.newPage();
p.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await p.goto(url, { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(expr), null, 1));
await b.close();
