// Record the clone's entrance animations (every [data-reveal] element) during a slow scroll and summarise by effect.
// Usage: node scripts/motion-clone.mjs <route> <width> [origin]
import { chromium } from "playwright-core";
const [route = "/", width = "1280", origin = "http://localhost:3100"] = process.argv.slice(2);
const mobile = +width < 600;
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext(
  mobile
    ? { viewport: { width: 320, height: 693 }, userAgent: UA, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { viewport: { width: +width, height: 900 } },
);
const p = await ctx.newPage();
await p.goto(origin + route, { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(600);
const res = await p.evaluate(async () => {
  const els = [...document.querySelectorAll("[data-reveal]")];
  const effect = (e) => (innerWidth < 750 && e.dataset.revealM) || e.dataset.reveal;
  const snap = (e) => {
    const c = getComputedStyle(e);
    return {
      o: +(+c.opacity).toFixed(3),
      tf: c.transform === "none" ? "" : c.transform,
      top: Math.round(e.getBoundingClientRect().top),
    };
  };
  const st = new Map(els.map((e) => [e, { first: snap(e), ev: [] }]));
  const t0 = performance.now();
  let y = 0;
  const H = document.documentElement.scrollHeight;
  await new Promise((done) => {
    const tick = () => {
      const t = Math.round(performance.now() - t0);
      for (const [e, s] of st) {
        const c = snap(e);
        const last = s.ev.at(-1)?.v ?? s.first;
        if (c.o !== last.o || c.tf !== last.tf) s.ev.push({ t, v: c, vh: innerHeight });
      }
      if (y > H + 100) return done();
      y += 6;
      scrollTo(0, y);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const rows = [];
  for (const [e, s] of st) {
    if (!s.ev.length) {
      rows.push({ eff: effect(e), never: true, cls: e.className.toString().slice(0, 30) });
      continue;
    }
    const ev = s.ev;
    rows.push({
      eff: effect(e),
      span: ev.at(-1).t - ev[0].t,
      o0: s.first.o,
      o1: ev.at(-1).v.o,
      fromBottom: ev[0].vh - ev[0].v.top,
      tf0: s.first.tf.slice(0, 40),
    });
  }
  return rows;
});
const by = {};
for (const r of res) (by[r.eff] ??= []).push(r);
for (const [eff, rows] of Object.entries(by)) {
  const ok = rows.filter((r) => !r.never);
  const avg = (k) => Math.round(ok.reduce((a, r) => a + r[k], 0) / Math.max(1, ok.length));
  console.log(
    eff.padEnd(8),
    "n=" + String(rows.length).padStart(3),
    "never=" + rows.filter((r) => r.never).length,
    "span~" + avg("span") + "ms",
    "o:" + (ok[0]?.o0 ?? "-") + "->" + (ok[0]?.o1 ?? "-"),
    "enters at ~" + avg("fromBottom") + "px above viewport bottom",
    ok[0]?.tf0 ? "tf0=" + ok[0].tf0 : "",
  );
}
await b.close();
