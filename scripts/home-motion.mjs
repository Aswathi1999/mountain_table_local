// node scripts/home-motion.mjs <out.json> [width] [height]
// Records the protected homepage behaviours so they can be diffed before/after a design change:
//  - entrance reveals in #intro / dining strip / house blurb / #reviews: effect, transition, and the viewport-relative top
//    (layout box) at which `.is-in` is first added while scrolling slowly
//  - parallax layers: effective k = -translateY / clamp(sectionTop, -sectionHeight, vh) at several scroll positions
//  - review slideshow: slide opacities every 500ms for 7s, then a dot click
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

const [out, w = "1440", h = "900", origin = "http://localhost:3100"] = process.argv.slice(2);
const mobile = +w < 600;
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({
  viewport: { width: +w, height: +h },
  ...(mobile ? { userAgent: UA, isMobile: true, hasTouch: true } : {}),
});
const p = await ctx.newPage();
await p.goto(origin + "/", { waitUntil: "load" });
await p.waitForTimeout(2500);

const STEP = +(process.env.STEP ?? 40);
const result = await p.evaluate(async (STEP) => {
  const vh = window.innerHeight;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const SECTIONS = ["#intro", 'section[aria-label="Dining area"]', 'section[aria-label="About the house"]', "#reviews"];
  const secEls = SECTIONS.map((s) => document.querySelector(s));
  const layoutTop = (el) => {
    const parent = el.offsetParent;
    if (!parent || getComputedStyle(el).position === "fixed") return el.getBoundingClientRect().top;
    return parent.getBoundingClientRect().top + parent.clientTop + el.offsetTop;
  };
  const reveals = [];
  secEls.forEach((sec, si) => {
    sec.querySelectorAll("[data-reveal]").forEach((el, i) => {
      const cs = getComputedStyle(el);
      reveals.push({
        key: `${SECTIONS[si]}#${i}`,
        el,
        effect: el.dataset.reveal,
        effectM: el.dataset.revealM ?? null,
        transition: `${cs.transitionProperty}|${cs.transitionDuration}|${cs.transitionTimingFunction}`,
        initialOpacity: cs.opacity,
        initialTransform: cs.transform,
        triggerTop: null,
        triggerFraction: null,
      });
    });
  });
  const layers = [...document.querySelectorAll("[data-parallax]")]
    .map((el) => ({ el, sec: el.parentElement }))
    .filter((l) => secEls.some((s) => s.contains(l.el)) || l.el.closest("#hero"));
  const parallax = layers.map(() => []);

  window.scrollTo(0, 0);
  await sleep(300);
  const total = document.documentElement.scrollHeight;
  for (let y = 0; y < total; y += 60) {
    window.scrollTo(0, y);
    await sleep(STEP);
    for (const r of reveals) {
      if (r.triggerTop === null && r.el.classList.contains("is-in")) {
        r.triggerTop = Math.round(layoutTop(r.el));
        r.triggerFraction = +(r.triggerTop / vh).toFixed(3);
      }
    }
    if (y % 240 === 0)
      layers.forEach((l, i) => {
        const rect = l.sec.getBoundingClientRect();
        const clamped = Math.min(Math.max(rect.top, -rect.height), vh);
        const m = new DOMMatrixReadOnly(getComputedStyle(l.el).transform);
        if (Math.abs(clamped) > 20 && rect.bottom > 0 && rect.top < vh)
          parallax[i].push(+(-m.m42 / clamped).toFixed(3));
      });
  }
  window.scrollTo(0, 0);

  // Review slideshow (fresh state is not guaranteed; record relative behaviour)
  const rev = document.querySelector("#reviews");
  rev.scrollIntoView({ block: "center" });
  await sleep(1500);
  const quotes = [...rev.querySelectorAll("blockquote")];
  const dots = [...rev.querySelectorAll("button[aria-label^='Show review']")];
  const samples = [];
  for (let t = 0; t < 7000; t += 500) {
    samples.push(quotes.map((q) => +getComputedStyle(q).opacity).map((o) => Math.round(o * 10) / 10));
    await sleep(500);
  }
  dots[2].click();
  await sleep(1300);
  const afterClick = quotes.map((q) => +getComputedStyle(q).opacity).map((o) => Math.round(o * 10) / 10);
  const quoteTransition = getComputedStyle(quotes[0]).transition;
  const texts = quotes.map((q) => q.textContent.trim());

  return {
    reveals: reveals.map((r) => ({ ...r, el: undefined })),
    parallax: parallax.map((arr, i) => ({
      parent:
        layers[i].sec.closest("section")?.getAttribute("aria-label") ?? layers[i].sec.closest("section")?.id ?? "?",
      k: arr.length ? [...new Set(arr.map((v) => Math.round(v * 10) / 10))] : [],
      attr: layers[i].el.dataset.parallax + "/" + layers[i].el.dataset.parallaxM,
    })),
    slideshow: { samples, afterClick, quoteTransition, texts, dotCount: dots.length },
  };
}, STEP);
writeFileSync(out, JSON.stringify(result, null, 1));
console.log(
  result.reveals.length,
  "reveals;",
  result.parallax.length,
  "parallax layers;",
  "unfired:",
  result.reveals.filter((r) => r.triggerTop === null).length,
);
await b.close();
