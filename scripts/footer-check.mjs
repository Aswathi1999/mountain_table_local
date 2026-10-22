// node scripts/footer-check.mjs -> footer band colours per page/width, overflow, and a viewport screenshot of the footer
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
mkdirSync("archive/screens/footer", { recursive: true });
const b = await chromium.launch({ channel: "chrome" });
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const sigs = new Map();
for (const w of [360, 390, 768, 1024, 1440]) {
  const mobile = w < 600;
  const p = await (
    await b.newContext({
      viewport: { width: w, height: 900 },
      ...(mobile ? { userAgent: UA, isMobile: true, hasTouch: true } : {}),
    })
  ).newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  for (const r of ["", "about", "see-do", "rooms-booking"]) {
    await p.goto("http://localhost:3100/" + r, { waitUntil: "load" });
    await p.waitForTimeout(800);
    await p.evaluate(() => document.querySelector("#SITE_FOOTER").scrollIntoView());
    await p.waitForTimeout(1800);
    const i = await p.evaluate(() => {
      const g = (s, prop = "backgroundColor") => {
        const e = document.querySelector(s);
        return e ? getComputedStyle(e)[prop] : null;
      };
      return {
        loc: g("#location"),
        contact: g("#contact"),
        bar: g("#SITE_FOOTER > div:last-child"),
        submit: g("#contact button[type=submit]"),
        dir: g("#location a.inline-flex"),
        line: g("#contact h2 + span"),
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
      };
    });
    const key = JSON.stringify({ ...i, sw: undefined, cw: undefined });
    sigs.set(key, (sigs.get(key) ?? 0) + 1);
    if (i.sw > i.cw) console.log("OVERFLOW", w, r, i.sw);
    if (w === 1440 || w === 390) await p.screenshot({ path: `archive/screens/footer/${w}-${r || "home"}.png` });
  }
  if (errs.length) console.log("errors", w, errs);
}
console.log([...sigs.entries()]);
await b.close();
