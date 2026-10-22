// Geometry diff: original vs clone at one viewport. Matches text runs and images and reports differences > 3px.
// Usage: node scripts/geodiff.mjs <route> <width> [cloneOrigin=http://localhost:3100]
import { chromium } from "playwright-core";

const [route = "/", width = "1280", clone = "http://localhost:3100", expectH] = process.argv.slice(2);
const W = +width;
const mobile = W < 600;
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const browser = await chromium.launch({ channel: "chrome" });

// The original lays out at its 320px design width and scales to the device; measure the clone at 320 so numbers compare 1:1.
async function measure(origin, vw = W, vh = mobile ? 812 : 900) {
  const ctx = await browser.newContext({
    viewport: { width: vw, height: vh },
    ...(mobile ? { userAgent: UA, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : {}),
  });
  const page = await ctx.newPage();
  await page.goto(origin + route, { waitUntil: "load", timeout: 90000 });
  await page.waitForTimeout(4000);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 300) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(7000); // let lazy iframes (gallery, feed) and entrance animations settle
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(600);
  const data = await page.evaluate(() => {
    const out = {
      texts: [],
      imgs: [],
      H: document.documentElement.scrollHeight,
      W: document.documentElement.scrollWidth,
    };
    const norm = (s) => s.replace(/\s+/g, " ").trim();
    const seen = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode;
      const t = norm(n.textContent);
      if (t.length < 2) continue;
      const el = n.parentElement;
      if (!el || /SCRIPT|STYLE|NOSCRIPT/.test(el.tagName)) continue;
      if (el.closest("iframe, [aria-hidden=true], wix-iframe")) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      const b = r.getBoundingClientRect();
      if (b.width === 0) continue;
      const key = t.slice(0, 40);
      if (seen.has(key + Math.round(b.top))) continue;
      seen.add(key + Math.round(b.top));
      out.texts.push({
        key,
        x: Math.round(b.left),
        y: Math.round(b.top + scrollY),
        w: Math.round(b.width),
        h: Math.round(b.height),
        fs: cs.fontSize,
        color: cs.color,
        weight: cs.fontWeight,
      });
    }
    for (const img of document.images) {
      let src = img.currentSrc || img.src;
      try {
        const u = new URL(src);
        if (u.searchParams.get("url")) src = decodeURIComponent(u.searchParams.get("url"));
      } catch {}
      const m =
        src.match(/([0-9a-z]+_)?[0-9a-f]{20,}[^/?.]*?(?=(~mv2)?\.(jpg|png|webp|jpeg))/i) || src.match(/instagram-\d+/);
      if (!m) continue;
      const b = img.getBoundingClientRect();
      if (b.width < 2) continue;
      out.imgs.push({
        key: m[0].replace(/~mv2/, ""),
        x: Math.round(b.left),
        y: Math.round(b.top + scrollY),
        w: Math.round(b.width),
        h: Math.round(b.height),
      });
    }
    return out;
  });
  await ctx.close();
  return data;
}

// The original's Honeycomb gallery sometimes falls back to a plain image list in headless runs (taller page); retry until it matches expectH.
let o = await measure("https://www.themountaintable.in");
for (let i = 0; expectH && Math.abs(o.H - +expectH) > 8 && i < 5; i++)
  o = await measure("https://www.themountaintable.in");
const c = await measure(clone, mobile ? 320 : W, mobile ? 693 : 900);
await browser.close();

const pad = (v, n) => String(v).padStart(n);
console.log(`page height: original ${o.H} vs clone ${c.H}; scrollWidth ${o.W} vs ${c.W}`);
const report = (label, A, B, withFont) => {
  const used = new Set();
  let bad = 0,
    matched = 0;
  const lines = [];
  for (const a of A) {
    let best = -1,
      bd = 1e9;
    B.forEach((b, i) => {
      if (used.has(i) || b.key !== a.key) return;
      const d = Math.abs(b.y - a.y);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    if (best < 0) {
      lines.push(`  MISSING in clone: ${a.key} @${a.x},${a.y} ${a.w}x${a.h}`);
      bad++;
      continue;
    }
    used.add(best);
    matched++;
    const b = B[best];
    const dx = b.x - a.x,
      dy = b.y - a.y,
      dw = b.w - a.w,
      dh = b.h - a.h;
    const fontDiff =
      withFont && (a.fs !== b.fs || a.color !== b.color) ? ` font ${a.fs}/${a.color} -> ${b.fs}/${b.color}` : "";
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3 || Math.abs(dw) > 3 || Math.abs(dh) > 3 || fontDiff) {
      bad++;
      lines.push(
        `  ${a.key.padEnd(40).slice(0, 40)} orig ${pad(a.x, 4)},${pad(a.y, 5)} ${pad(a.w, 4)}x${pad(a.h, 4)}  d(${pad(dx, 4)},${pad(dy, 5)},${pad(dw, 4)},${pad(dh, 4)})${fontDiff}`,
      );
    }
  }
  B.forEach((b, i) => {
    if (!used.has(i)) lines.push(`  EXTRA in clone:   ${b.key} @${b.x},${b.y} ${b.w}x${b.h}`);
  });
  console.log(`${label}: ${matched} matched, ${bad} differ/missing of ${A.length}`);
  console.log(lines.slice(0, 60).join("\n"));
};
report("TEXT", o.texts, c.texts, true);
report("IMAGES", o.imgs, c.imgs, false);
