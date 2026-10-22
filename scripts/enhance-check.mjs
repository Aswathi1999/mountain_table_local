// Checks for the premium-UI pass: overflow at 5 widths, header scroll, hero video, reduced motion, lazy map, form, mobile menu.
// Usage: node scripts/enhance-check.mjs [origin=http://localhost:3100]
import { chromium } from "playwright-core";

const origin = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
let problems = 0;
const ok = (cond, msg) => {
  console.log(cond ? "  ✓" : "  ✗", msg);
  if (!cond) problems++;
};
const mobileOpts = (w, h = 844) => ({
  viewport: { width: w, height: h },
  userAgent: UA,
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});

async function open(opts, route = "/") {
  const b = await chromium.launch({ channel: "chrome" });
  const ctx = await b.newContext(opts);
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on(
    "console",
    (m) =>
      m.type() === "error" && !/Failed to load resource|favicon/.test(m.text()) && errors.push(m.text().slice(0, 140)),
  );
  await p.goto(origin + route, { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(1800);
  return { b, p, errors };
}

console.log("Overflow + page errors at 360 / 390 / 768 / 1024 / 1440");
for (const w of [360, 390, 768, 1024, 1440]) {
  const { b, p, errors } = await open(w < 750 ? mobileOpts(w, 800) : { viewport: { width: w, height: 800 } });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 500) {
    await p.evaluate((y) => scrollTo(0, y), y);
    await p.waitForTimeout(60);
  }
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  // 750-979px keeps the original's 980px minimum page width (same as the live site), so only flag overflow beyond that.
  const limit = w >= 750 && w < 980 ? 980 : w;
  ok(
    sw <= limit + 1 && errors.length === 0,
    `${w}px: scrollWidth ${sw} (limit ${limit}), page errors: ${errors.length} ${errors[0] ?? ""}`,
  );
  await b.close();
}

console.log("Header scroll behaviour (desktop, home)");
{
  const { b, p } = await open({ viewport: { width: 1440, height: 900 } });
  const bg = () => p.$eval("#SITE_HEADER", (e) => getComputedStyle(e).backgroundColor);
  const topBg = await bg();
  await p.evaluate(() => scrollTo(0, 400));
  await p.waitForTimeout(900);
  const scrolled = await bg();
  ok(
    topBg === "rgba(0, 0, 0, 0)" && scrolled !== "rgba(0, 0, 0, 0)",
    `header background at top "${topBg.slice(0, 28)}" -> scrolled "${scrolled}"`,
  );
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(600);
  const link = 'header a[href="/see-do"]';
  const t0 = await p.$eval(link, (e) => getComputedStyle(e, "::after").transform);
  await p.hover(link);
  await p.waitForTimeout(700);
  const t1 = await p.$eval(link, (e) => getComputedStyle(e, "::after").transform);
  ok(t0 !== t1, `nav underline animates on hover (${t0} -> ${t1})`);
  await b.close();
}

console.log("Other routes keep the solid header and unshifted content");
{
  const { b, p } = await open({ viewport: { width: 1440, height: 900 } }, "/about");
  const m = await p.evaluate(() => ({
    bg: getComputedStyle(document.getElementById("SITE_HEADER")).backgroundColor,
    firstTop: Math.round(document.getElementById("story").getBoundingClientRect().top),
  }));
  ok(
    m.bg !== "rgba(0, 0, 0, 0)" && m.firstTop === 80,
    `/about header ${m.bg}, first section top ${m.firstTop}px (original 80)`,
  );
  await b.close();
}

console.log("Hero video");
{
  const { b, p } = await open({ viewport: { width: 1440, height: 900 } });
  await p.waitForTimeout(3500);
  const v = await p.$eval("#hero video", (e) => ({
    src: e.currentSrc.slice(-40),
    playing: !e.paused && e.readyState >= 2,
    opacity: getComputedStyle(e).opacity,
  }));
  ok(v.playing && v.opacity === "1", `video playing over poster (${v.src}, opacity ${v.opacity})`);
  await b.close();
  const r = await open({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await r.p.waitForTimeout(3500);
  const rv = await r.p.$eval("#hero video", (e) => ({ src: e.getAttribute("src"), op: getComputedStyle(e).opacity }));
  ok(!rv.src && rv.op === "0", "reduced motion: video not loaded, poster stays");
  const rises = await r.p.$$eval(".hero-rise", (els) => els.map((e) => getComputedStyle(e).opacity));
  ok(
    rises.every((o) => o === "1"),
    "reduced motion: hero text visible immediately",
  );
  const reveal = await r.p.$$eval("[data-reveal]", (els) => els.every((e) => getComputedStyle(e).opacity === "1"));
  ok(reveal, "reduced motion: scroll-reveal elements visible");
  await r.b.close();
}

console.log("Map loads on demand");
{
  const { b, p } = await open({ viewport: { width: 1440, height: 900 } });
  const before = await p.$$eval("#location iframe", (f) => f.length);
  await p.evaluate(() => document.getElementById("location").scrollIntoView());
  await p.waitForTimeout(1500);
  const after = await p.$$eval("#location iframe", (f) => f.length);
  ok(before === 0 && after === 1, `iframe count before scrolling: ${before}, near the section: ${after}`);
  const src = await p.$eval("#location iframe", (f) => f.src);
  ok(src.includes("9.742779,76.900931"), "map points at the verified coordinates");
  const hrefs = await p.$$eval("#location a", (as) => as.map((a) => a.href));
  ok(
    hrefs.some((h) => h.includes("destination=9.742779,76.900931")),
    "directions link uses the verified coordinates",
  );
  await b.close();
}

console.log("Enquiry form");
{
  const { b, p } = await open(mobileOpts(390));
  await p.evaluate(() => document.getElementById("contact").scrollIntoView());
  await p.waitForTimeout(800);
  await p.click('form button[type="submit"]');
  await p.waitForTimeout(300);
  const errs = await p.$$eval('form [id$="-error"]', (e) => e.map((x) => x.textContent));
  ok(errs.length === 3, `empty submit shows ${errs.length} field errors (name, email, message)`);
  const focused = await p.evaluate(() => document.activeElement?.getAttribute("name"));
  ok(focused === "name", `focus moves to first invalid field (${focused})`);
  await p.fill('input[name="name"]', "Asha Nair");
  await p.fill('input[name="email"]', "not-an-email");
  await p.fill('textarea[name="message"]', "Two rooms for 12-14 Nov please.");
  await p.click('form button[type="submit"]');
  await p.waitForTimeout(200);
  ok((await p.$$eval('form [id$="-email-error"]', (e) => e.length)) === 1, "invalid email is rejected");
  await p.fill('input[name="email"]', "asha@example.com");
  await p.fill('input[name="phone"]', "+91 98765 43210");
  await p.click('form button[type="submit"]');
  await p.waitForTimeout(150);
  const sending = await p.$eval('form button[type="submit"]', (btn) => ({
    disabled: btn.disabled,
    text: btn.textContent.trim(),
  }));
  ok(sending.disabled && /Preparing/.test(sending.text), `loading state: "${sending.text}", disabled`);
  await p.waitForTimeout(1200);
  const success = await p.$eval("#contact [role=status]", (e) => e.textContent).catch(() => null);
  ok(!!success && /Thank you, Asha/.test(success), "success state shown");
  const openHref = await p
    .$eval('#contact [role=status] a[href^="mailto:"]', (a) => decodeURIComponent(a.getAttribute("href")))
    .catch(() => "");
  ok(
    openHref.startsWith("mailto:themountaintable500@gmail.com") &&
      openHref.includes("Asha Nair") &&
      openHref.includes("12-14 Nov") &&
      openHref.includes("+91 98765 43210"),
    "mailto link goes to the property email with the entered details",
  );
  const links = await p.$$eval("#contact dl a", (as) => as.map((a) => a.getAttribute("href")));
  ok(
    links.includes("tel:+919447009954") && links.includes("mailto:themountaintable500@gmail.com"),
    "tap-to-call and tap-to-email links present",
  );
  await b.close();
}

console.log("Mobile menu");
{
  const { b, p } = await open(mobileOpts(390));
  await p.tap('button[aria-label="Open menu"]');
  await p.waitForTimeout(700);
  const m = await p.$eval("#mobile-menu", (e) => ({ op: getComputedStyle(e).opacity, inert: e.inert }));
  ok(m.op === "1" && !m.inert, "menu opens");
  await p.keyboard.press("Escape");
  await p.waitForTimeout(500);
  ok(await p.$eval("#mobile-menu", (e) => e.inert), "Escape closes the menu");
  await p.tap('button[aria-label="Open menu"]');
  await p.waitForTimeout(500);
  await p.tap('#mobile-menu a[href="/see-do"]');
  await p.waitForURL("**/see-do");
  await p.waitForTimeout(600);
  ok(await p.$eval("#mobile-menu", (e) => e.inert), "menu closes after navigating");
  await b.close();
}

console.log(problems === 0 ? "\nALL CHECKS PASSED" : `\n${problems} CHECK(S) FAILED`);
