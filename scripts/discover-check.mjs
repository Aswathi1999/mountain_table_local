// node scripts/discover-check.mjs <out.json> [width] [origin] -> Discover behaviour: slide count/size, arrows, scroll distances per click, heading reveal
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
const [out, w = "1440", origin = "http://localhost:3100"] = process.argv.slice(2);
const mobile = +w < 600;
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const b = await chromium.launch({ channel: "chrome" });
const p = await (
  await b.newContext({
    viewport: { width: +w, height: 900 },
    ...(mobile ? { userAgent: UA, isMobile: true, hasTouch: true } : {}),
  })
).newPage();
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
await p.goto(origin + "/", { waitUntil: "load" });
await p.waitForTimeout(1500);
const res = { w: +w };
res.reveals = await p.evaluate(() =>
  [...document.querySelectorAll("#discover [data-reveal]")].map((e) => [
    e.dataset.reveal,
    e.dataset.revealM ?? null,
    getComputedStyle(e).transitionDuration,
  ]),
);
await p.evaluate(() => document.querySelector("#discover").scrollIntoView({ block: "center" }));
await p.waitForTimeout(2000);
const tx = () =>
  p.evaluate(() => {
    const t = document.querySelector("#discover [aria-roledescription=carousel] > div > div");
    return Math.round(-new DOMMatrixReadOnly(getComputedStyle(t).transform).m41);
  });
res.heading = await p.evaluate(() => {
  const h = document.querySelector("#discover h2");
  return { text: h.textContent, opacity: getComputedStyle(h).opacity };
});
res.slides = await p.evaluate(() => {
  const s = [...document.querySelectorAll("#discover [aria-roledescription=slide]")];
  return {
    n: s.length,
    w: Math.round(s[0].getBoundingClientRect().width),
    alts: s.slice(0, 5).map((x) => x.querySelector("img").alt),
  };
});
res.arrowsBefore = await p.evaluate(() =>
  [...document.querySelectorAll("#discover button")].map((b) => b.getAttribute("aria-label")),
);
const moves = [];
for (let i = 0; i < 4; i++) {
  await p.click("#discover button[aria-label=Next]");
  await p.waitForTimeout(900);
  moves.push(await tx());
}
res.scrollAfterClicks = moves;
res.arrowsAfter = await p.evaluate(() =>
  [...document.querySelectorAll("#discover button")].map((b) => b.getAttribute("aria-label")),
);
await p.click("#discover button[aria-label=Previous]");
await p.waitForTimeout(900);
res.afterPrev = await tx();
// drag
const box = await p.locator("#discover [aria-roledescription=carousel]").boundingBox();
await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await p.mouse.down();
await p.mouse.move(box.x + box.width / 2 - 300, box.y + box.height / 2, { steps: 8 });
await p.mouse.up();
await p.waitForTimeout(1200);
res.afterDrag = await tx();
res.overflowX = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
res.errs = errs;
writeFileSync(out, JSON.stringify(res, null, 1));
console.log(
  JSON.stringify({
    w: res.w,
    slides: res.slides.n,
    slideW: res.slides.w,
    reveals: res.reveals,
    clicks: res.scrollAfterClicks,
    afterPrev: res.afterPrev,
    afterDrag: res.afterDrag,
    arrows: [res.arrowsBefore, res.arrowsAfter],
    errs,
  }),
);
await b.close();
