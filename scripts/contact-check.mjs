// node scripts/contact-check.mjs -> #contact height/overflow per width on About, plus screenshots and a form run
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
mkdirSync("archive/screens/contact", { recursive: true });
const b = await chromium.launch({ channel: "chrome" });
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
for (const w of [360, 390, 768, 1024, 1440]) {
  const mobile = w < 600;
  const p = await (
    await b.newContext({
      viewport: { width: w, height: 900 },
      ...(mobile ? { userAgent: UA, isMobile: true, hasTouch: true } : {}),
    })
  ).newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:3100/about", { waitUntil: "load" });
  await p.waitForTimeout(800);
  await p.evaluate(() => document.querySelector("#contact").scrollIntoView({ block: "start" }));
  await p.waitForTimeout(2000);
  const i = await p.evaluate(() => ({
    h: Math.round(document.querySelector("#contact").getBoundingClientRect().height),
    bg: getComputedStyle(document.querySelector("#contact")).backgroundColor,
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  console.log(w, i.h + "px tall", i.bg, i.sw > i.cw ? "OVERFLOW " + i.sw : "no overflow", errs.length ? errs : "");
  await p.screenshot({ path: `archive/screens/contact/${w}.png` });
}
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto("http://localhost:3100/rooms-booking", { waitUntil: "load" });
await p.evaluate(() => document.querySelector("#contact").scrollIntoView());
await p.waitForTimeout(1800);
await p.click("button[type=submit]");
console.log(
  "empty submit errors:",
  (await p.locator('[id$="-error"]').allTextContents()).length,
  "| alert:",
  await p.locator("form p[role=alert]").textContent(),
);
await p.fill("input[name=name]", "Asha Nair");
await p.fill("input[name=email]", "asha@example.com");
await p.fill("input[name=phone]", "+91 98470 12345");
await p.fill("textarea[name=message]", "Two rooms for 12-14 Nov please.");
await p.click("button[type=submit]");
await p.waitForTimeout(150);
console.log("sending:", await p.locator("button[type=submit]").textContent());
await p.waitForTimeout(1200);
console.log("success:", (await p.locator("[role=status]").textContent()).slice(0, 30));
await p.screenshot({ path: "archive/screens/contact/success.png" });
await b.close();
