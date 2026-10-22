// Smoke test of the running clone: console errors, failed/remote requests, broken images, overflow, key interactions.
// Usage: node scripts/smoke.mjs [origin=http://localhost:3200]
import { chromium } from "playwright-core";

const origin = (process.argv[2] ?? "http://localhost:3200").replace(/\/$/, "");
const routes = ["/", "/about", "/see-do", "/rooms-booking", "/does-not-exist"];
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
let browser = await chromium.launch({ channel: "chrome" });
let problems = 0;
const bad = (msg) => {
  problems++;
  console.log("  ✗", msg);
};

for (const mobile of [false, true]) {
  for (const route of routes) {
    await browser.close();
    browser = await chromium.launch({ channel: "chrome" }); // fresh browser per page keeps memory low
    const ctx = await browser.newContext(
      mobile
        ? { viewport: { width: 375, height: 812 }, userAgent: UA, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
        : { viewport: { width: 1280, height: 900 } },
    );
    const page = await ctx.newPage();
    const errors = [],
      remote = new Set(),
      failed = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 160)));
    page.on("requestfailed", (r) => r.resourceType() !== "media" && failed.push(r.url().slice(0, 100))); // aborted media range requests are normal
    page.on("request", (r) => {
      const u = new URL(r.url());
      if (!/^(localhost|127\.0\.0\.1)$/.test(u.hostname) && !r.url().startsWith("data:")) remote.add(u.hostname);
    });
    const res = await page.goto(origin + route, { waitUntil: "load" });
    await page.waitForTimeout(1500);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 400) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(1500);
    const info = await page.evaluate(() => ({
      broken: [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0 && i.currentSrc)
        .map((i) => i.currentSrc.slice(0, 90)),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      hidden: [...document.querySelectorAll("[data-reveal]:not(.is-in)")]
        .filter((e) => e.getClientRects().length > 0 && getComputedStyle(e).display !== "none")
        .map(
          (e) =>
            `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 30)} @${Math.round(e.getBoundingClientRect().top + scrollY)} ${e.dataset.reveal}`,
        ),
    }));
    const expected = route === "/does-not-exist" ? 404 : 200;
    console.log(`${mobile ? "mobile " : "desktop"} ${route.padEnd(16)} status ${res.status()}`);
    if (res.status() !== expected) bad(`status ${res.status()} (expected ${expected})`);
    errors.forEach((e) => bad("console: " + e));
    failed.forEach((f) => bad("request failed: " + f));
    info.broken.forEach((b) => bad("broken image: " + b));
    if (info.overflow) bad("horizontal overflow");
    const hosts = [...remote];
    if (hosts.length) console.log("  remote hosts:", hosts.join(", "));
    if (info.hidden.length) console.log("  note: never revealed:", info.hidden.join(" | "));
    await ctx.close();
  }
}

// Interactions (desktop)
{
  await browser.close();
  browser = await chromium.launch({ channel: "chrome" });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(origin + "/", { waitUntil: "load" });
  await page.waitForTimeout(1500);
  const colour = (sel) => page.$eval(sel, (e) => getComputedStyle(e).color);
  const link = 'header a[href="/about"]';
  const before = await colour(link);
  await page.hover(link);
  await page.waitForTimeout(600);
  const after = await colour(link);
  console.log("nav hover colour:", before, "->", after);
  if (before === after) bad("nav hover did not change colour");
  await page.$eval("#rooms", (e) => e.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(1500);
  const btn = "a.pill-btn";
  const bg0 = await page.$eval(btn, (e) => getComputedStyle(e).backgroundColor);
  await page.hover(btn);
  await page.waitForTimeout(500);
  const bg1 = await page.$eval(btn, (e) => getComputedStyle(e).backgroundColor);
  console.log("pill hover:", bg0, "->", bg1);
  if (bg0 === bg1) bad("pill hover did not change background");
  await page.$eval("#discover", (e) => e.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(1500);
  const first = () => page.$$eval("#discover img", (is) => Math.round(is[0].getBoundingClientRect().left));
  const x0 = await first();
  await page.click('button[aria-label="Next"]');
  await page.waitForTimeout(1200);
  const x1 = await first();
  console.log("discover first slide x:", x0, "->", x1, "(original: 150 -> -58)");
  if (x0 - x1 < 190 || x0 - x1 > 225) bad("discover first click should move ~208px");
  await page.click('button[aria-label="Next"]');
  await page.waitForTimeout(1200);
  console.log("discover second click moves:", x1 - (await first()), "(original 282)");
  await page.$eval("#reviews", (e) => e.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(500);
  const shown = () => page.$$eval("#reviews blockquote", (bs) => bs.findIndex((b) => b.style.opacity === "1"));
  const r0 = await shown();
  await page.waitForTimeout(3300);
  const r1 = await shown();
  console.log("review slide:", r0, "->", r1);
  if (r0 === r1) bad("review slideshow did not advance within 3.3s");
  await ctx.close();
}
// Mobile menu
{
  await browser.close();
  browser = await chromium.launch({ channel: "chrome" });
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: UA,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(origin + "/", { waitUntil: "load" });
  await page.waitForTimeout(1200);
  await page.tap('button[aria-label="Open menu"]');
  await page.waitForTimeout(300);
  const open = await page.$eval("#mobile-menu", (e) => !e.hidden);
  console.log("mobile menu opens:", open);
  if (!open) bad("mobile menu did not open");
  await page.tap('#mobile-menu a[href="/about"]');
  await page.waitForURL("**/about");
  await page.waitForTimeout(500);
  const closed = await page.$eval("#mobile-menu", (e) => e.hidden);
  console.log("menu closes after navigation:", closed);
  if (!closed) bad("mobile menu stayed open after navigation");
  await ctx.close();
}
await browser.close();
console.log(problems === 0 ? "\nSMOKE TEST: all checks passed" : `\nSMOKE TEST: ${problems} problem(s)`);
