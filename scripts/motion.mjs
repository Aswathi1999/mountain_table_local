// Record per-element motion on the original while scrolling slowly: when each element starts changing,
// how far into the viewport it was, how long it takes, and start/end values. -> archive/motion/<slug>-<width>.json
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
await page.waitForTimeout(500);
const res = await page.evaluate(async () => {
  const sel =
    '[id^="comp-"], [id^="comp-"] img, [id^="comp-"] svg, [id^="bgImg_"], [id^="bgMedia_"], #SITE_HEADER, #SITE_FOOTER, header, wix-bg-image';
  const els = [...new Set(document.querySelectorAll(sel))];
  const name = (e) =>
    (e.id || e.tagName.toLowerCase()) + (e.id ? "" : "@" + Math.round(e.getBoundingClientRect().top + scrollY));
  const snap = (e) => {
    const c = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    return {
      o: +(+c.opacity).toFixed(3),
      tf: c.transform === "none" ? "" : c.transform,
      cp: c.clipPath === "none" ? "" : c.clipPath,
      f: c.filter === "none" ? "" : c.filter,
      top: Math.round(r.top),
      pos: c.position,
    };
  };
  const state = new Map(els.map((e) => [e, { n: name(e), first: snap(e), ev: [], changed: false }]));
  const t0 = performance.now();
  const H = document.documentElement.scrollHeight;
  let y = 0;
  await new Promise((done) => {
    const tick = () => {
      const t = Math.round(performance.now() - t0);
      for (const [e, s] of state) {
        const c = snap(e);
        const last = s.ev.at(-1)?.v ?? s.first;
        if (c.o !== last.o || c.tf !== last.tf || c.cp !== last.cp || c.f !== last.f || c.pos !== last.pos)
          s.ev.push({ t, sy: Math.round(scrollY), v: c });
      }
      if (y > H) return done();
      y += 6;
      scrollTo(0, y);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const out = [];
  for (const s of state.values()) {
    if (!s.ev.length) continue;
    const ev = s.ev;
    // scroll-linked if changes keep tracking scrollY for long; entrance if it settles
    const span = ev.at(-1).t - ev[0].t;
    out.push({
      n: s.n,
      first: s.first,
      nEv: ev.length,
      startT: ev[0].t,
      startSY: ev[0].sy,
      startTopInVp: ev[0].v.top,
      spanMs: span,
      last: ev.at(-1).v,
      samples: ev
        .filter((_, i) => i % Math.max(1, Math.floor(ev.length / 8)) === 0)
        .map((x) => ({ t: x.t - ev[0].t, o: x.v.o, tf: x.v.tf.replace("matrix", "m"), cp: x.v.cp, top: x.v.top })),
    });
  }
  return { vh: innerHeight, H, out };
});
await mkdir("archive/motion", { recursive: true });
await writeFile(
  `archive/motion/${route === "/" ? "home" : route.slice(1)}-${width}.json`,
  JSON.stringify(res, null, 1),
);
console.log(route, width, res.out.length, "animated");
await browser.close();
