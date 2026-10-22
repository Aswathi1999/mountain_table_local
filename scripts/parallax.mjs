import { chromium } from "playwright-core";
const width = +(process.argv[2] ?? 1280);
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({
  viewport: { width, height: width < 600 ? 812 : 900 },
  ...(+width < 600
    ? {
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        deviceScaleFactor: 2,
      }
    : {}),
  isMobile: width < 600,
  hasTouch: width < 600,
});
const p = await ctx.newPage();
await p.goto("https://www.themountaintable.in/", { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(4000);
const rows = [];
for (const y of width < 600
  ? [0, 150, 300, 450, 600, 800, 1000, 1200, 1500, 1800, 2200, 2800, 3400, 3700]
  : [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 3000, 3600, 4200, 4800]) {
  await p.evaluate((y) => scrollTo(0, y), y);
  await p.waitForTimeout(350);
  rows.push(
    await p.evaluate((y) => {
      const q = (id) => {
        const s = document.getElementById(id);
        if (!s) return null;
        const img = s.querySelector("img");
        const sr = s.getBoundingClientRect();
        const ir = img.getBoundingClientRect();
        const cs = getComputedStyle(s);
        return {
          secTop: Math.round(sr.top),
          secH: Math.round(sr.height),
          imgOff: Math.round(ir.top - sr.top),
          imgH: Math.round(ir.height),
          pos: getComputedStyle(img.parentElement).position,
          ov: cs.overflow + "/" + cs.clipPath,
        };
      };
      const hero = document.getElementById("comp-lvtlam8d");
      const hi = hero.querySelector("img");
      const hr = hero.getBoundingClientRect();
      const ir = hi.getBoundingClientRect();
      const hd = document.getElementById("SITE_HEADER");
      const hdc = getComputedStyle(hd);
      return {
        y,
        hero: [Math.round(hr.top), Math.round(hr.height), Math.round(ir.top - hr.top), Math.round(ir.height)],
        s1: q("comp-ipy07tiu"),
        s2: q("comp-ipy0aqro"),
        s3: q("comp-ipy0furf"),
        header: [
          Math.round(hd.getBoundingClientRect().top),
          hdc.position,
          hdc.backgroundColor,
          Math.round(hd.getBoundingClientRect().height),
        ],
      };
    }, y),
  );
}
for (const r of rows) console.log(JSON.stringify(r));
await b.close();
