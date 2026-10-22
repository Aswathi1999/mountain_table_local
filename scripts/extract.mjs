// Dump a compact structural description (geometry, text, fonts, colours, images) of each page section.
// Usage: node scripts/extract.mjs <route> <width>  -> archive/extract/<slug>-<width>.json
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";

const [route = "/", width = "1280"] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({
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
const page = await ctx.newPage();
await page.goto("https://www.themountaintable.in" + route, { waitUntil: "load", timeout: 90000 });
await page.waitForTimeout(4000);
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 400) {
  await page.evaluate((y) => scrollTo(0, y), y);
  await page.waitForTimeout(200);
}
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(800);

const data = await page.evaluate(() => {
  const r = (e) => {
    const b = e.getBoundingClientRect();
    return [Math.round(b.left), Math.round(b.top + scrollY), Math.round(b.width), Math.round(b.height)];
  };
  const sections = [
    ...document.querySelectorAll("#SITE_HEADER, #SITE_FOOTER, section.wixui-section, .wixui-column-strip"),
  ].filter((s, _, a) => !a.some((o) => o !== s && o.contains(s) && o.matches("section.wixui-section")));
  return sections.map((s) => {
    const cs = getComputedStyle(s);
    const bgImg = s.querySelector('[id^="bgImg_"],wix-bg-image');
    const items = [];
    s.querySelectorAll("*").forEach((e) => {
      const c = getComputedStyle(e);
      const own = [...e.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .filter(Boolean)
        .join(" ");
      const isImg = e.tagName === "IMG" || e.tagName === "WIX-IMAGE" || e.tagName === "svg";
      const bgi = c.backgroundImage !== "none" ? c.backgroundImage.slice(0, 160) : "";
      if (!own && !isImg && !bgi && !(e.id && /^comp-/.test(e.id))) return;
      const b = r(e);
      if (b[2] === 0 || b[3] === 0) return;
      items.push({
        t: e.tagName.toLowerCase(),
        id: e.id || undefined,
        box: b,
        text: own.slice(0, 400) || undefined,
        src: e.tagName === "IMG" ? e.currentSrc || e.src : e.querySelector?.("img")?.currentSrc,
        alt: e.alt || undefined,
        bgi: bgi || undefined,
        bg: c.backgroundColor !== "rgba(0, 0, 0, 0)" ? c.backgroundColor : undefined,
        font: own
          ? `${c.fontStyle} ${c.fontWeight} ${c.fontSize}/${c.lineHeight} ${c.fontFamily.slice(0, 50)} ls:${c.letterSpacing} tt:${c.textTransform} ta:${c.textAlign}`
          : undefined,
        color: own ? c.color : undefined,
        op: c.opacity !== "1" ? c.opacity : undefined,
        tf: c.transform !== "none" ? c.transform : undefined,
        bd: c.borderTopWidth !== "0px" ? `${c.borderTopWidth} ${c.borderTopColor}` : undefined,
        href: e.closest("a")?.href,
      });
    });
    return {
      id: s.id || s.className.toString().slice(0, 40),
      box: r(s),
      bg: cs.backgroundColor,
      bgImg: bgImg ? getComputedStyle(bgImg).backgroundImage.slice(0, 200) : undefined,
      items,
    };
  });
});
await mkdir("archive/extract", { recursive: true });
const name = (route === "/" ? "home" : route.slice(1)) + "-" + width;
await writeFile(`archive/extract/${name}.json`, JSON.stringify(data, null, 1));
console.log(
  name,
  data.length,
  "sections,",
  data.reduce((n, s) => n + s.items.length, 0),
  "items",
);
await browser.close();
