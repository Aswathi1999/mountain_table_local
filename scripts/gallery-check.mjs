// node scripts/gallery-check.mjs -> exercises the /gallery lightbox (open, arrows, Escape, focus return, close button, touch)
import { chromium } from "playwright-core";
const b = await chromium.launch({ channel: "chrome" });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errs = [];
p.on("pageerror", (e) => errs.push(e.message));
p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await p.goto("http://localhost:3001/gallery", { waitUntil: "load" });
await p.waitForTimeout(1500);
const count = await p.locator("ul button[aria-haspopup=dialog]").count();
const third = p.locator("ul button[aria-haspopup=dialog]").nth(2);
await third.scrollIntoViewIfNeeded();
await p.waitForTimeout(1500);
await third.focus();
await p.keyboard.press("Enter");
await p.waitForTimeout(700);
const caption = () => p.locator("dialog p[aria-live]").textContent();
console.log(
  "photos:",
  count,
  "| open:",
  await p.locator("dialog").evaluate((d) => d.open),
  "|",
  (await caption()).slice(0, 60),
);
await p.keyboard.press("ArrowRight");
await p.waitForTimeout(400);
console.log("→", (await caption()).slice(0, 40));
await p.keyboard.press("ArrowLeft");
await p.keyboard.press("ArrowLeft");
await p.waitForTimeout(400);
console.log("←←", (await caption()).slice(0, 40));
await p.screenshot({ path: "archive/screens/gallery-lightbox.png" });
await p.keyboard.press("Escape");
await p.waitForTimeout(400);
console.log(
  "Escape closed:",
  !(await p.locator("dialog").evaluate((d) => d.open)),
  "| focus returned to trigger:",
  await p.evaluate(() => document.activeElement?.getAttribute("aria-label")?.slice(0, 22)),
);
await third.click();
await p.waitForTimeout(500);
await p.click("button[aria-label='Next photo']");
await p.waitForTimeout(300);
console.log("next button:", (await caption()).slice(0, 30));
await p.click("button[aria-label='Close photo viewer']");
await p.waitForTimeout(300);
console.log(
  "close button closed:",
  !(await p.locator("dialog").evaluate((d) => d.open)),
  "| body scroll restored:",
  await p.evaluate(() => document.body.style.overflow === ""),
);
// wrap-around
await p.locator("ul button[aria-haspopup=dialog]").first().click();
await p.waitForTimeout(400);
await p.keyboard.press("ArrowLeft");
await p.waitForTimeout(300);
console.log("wrap from first:", (await caption()).slice(0, 8));
await p.keyboard.press("Escape");
// touch
const m = await (
  await b.newContext({ viewport: { width: 390, height: 800 }, isMobile: true, hasTouch: true })
).newPage();
await m.goto("http://localhost:3001/gallery", { waitUntil: "load" });
await m.waitForTimeout(1500);
const t = m.locator("ul button[aria-haspopup=dialog]").nth(1);
await t.scrollIntoViewIfNeeded();
await m.waitForTimeout(1500);
await t.tap();
await m.waitForTimeout(600);
console.log("mobile tap open:", await m.locator("dialog").evaluate((d) => d.open));
await m.screenshot({ path: "archive/screens/gallery-lightbox-m.png" });
await m.tap("button[aria-label='Next photo']");
await m.waitForTimeout(300);
console.log("mobile next:", (await m.locator("dialog p[aria-live]").textContent()).slice(0, 12));
await m.tap("button[aria-label='Close photo viewer']");
await m.waitForTimeout(300);
console.log("mobile closed:", !(await m.locator("dialog").evaluate((d) => d.open)));
console.log("errors:", errs);
await b.close();
