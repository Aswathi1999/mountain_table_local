// node scripts/book-now-check.mjs -> computed style of every "Book Now" link on every page/width, plus hover
import { chromium } from "playwright-core";
const b = await chromium.launch({ channel: "chrome" });
const props = [
  "backgroundColor",
  "color",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "letterSpacing",
  "textTransform",
  "height",
  "paddingLeft",
  "borderRadius",
  "transitionDuration",
  "textDecorationLine",
];
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const rows = [];
for (const w of [360, 390, 768, 1024, 1440]) {
  const mobile = w < 600;
  const ctx = await b.newContext({
    viewport: { width: w, height: 900 },
    ...(mobile ? { userAgent: UA, isMobile: true, hasTouch: true } : {}),
  });
  const p = await ctx.newPage();
  for (const route of ["", "about", "see-do", "rooms-booking"]) {
    await p.goto(`http://localhost:3100/${route}`, { waitUntil: "load" });
    await p.waitForTimeout(1200);
    if (mobile) await p.click('button[aria-label="Open menu"]').catch(() => {});
    await p.waitForTimeout(500);
    const els = await p.locator("a", { hasText: /^Book Now$/ }).elementHandles();
    for (const el of els) {
      if (!(await el.isVisible())) continue;
      const st = await el.evaluate(
        (e, ps) => ({
          ...Object.fromEntries(ps.map((k) => [k, getComputedStyle(e)[k]])),
          href: e.getAttribute("href"),
          w: Math.round(e.getBoundingClientRect().width),
          overflow: e.scrollWidth > e.clientWidth,
        }),
        props,
      );
      await el.hover({ force: true }).catch(() => {});
      await p.waitForTimeout(450);
      st.hoverBg = await el.evaluate((e) => getComputedStyle(e).backgroundColor);
      rows.push({ w, route: "/" + route, where: st.height === "48px" ? "body/menu" : "header", ...st });
      await p.mouse.move(0, 0);
    }
  }
  await ctx.close();
}
const sig = (r) =>
  JSON.stringify([
    r.backgroundColor,
    r.color,
    r.fontFamily,
    r.fontSize,
    r.fontWeight,
    r.letterSpacing,
    r.textTransform,
    r.borderRadius,
    r.transitionDuration,
    r.textDecorationLine,
    r.hoverBg,
  ]);
const groups = new Map();
for (const r of rows) {
  const k = sig(r) + "|h" + r.height + "|px" + r.paddingLeft;
  groups.set(k, (groups.get(k) ?? 0) + 1);
}
console.log(rows.length, "buttons;", groups.size, "distinct style signatures (incl. height/padding)");
for (const [k, n] of groups) console.log(n, k);
console.log(JSON.stringify(rows.filter((r) => r.height === "19.5px").map((r) => [r.w, r.route, r.width ?? r.w])));
console.log("overflowing text:", rows.filter((r) => r.overflow).length, "| hrefs:", [
  ...new Set(rows.map((r) => r.href)),
]);
await b.close();
