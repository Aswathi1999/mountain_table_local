// node scripts/font-audit.mjs -> font families / weights / styles actually used by rendered text, per page and width
import { chromium } from "playwright-core";
const b = await chromium.launch({ channel: "chrome" });
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const requests = new Set();
for (const w of [390, 1440]) {
  const mobile = w < 600;
  const p = await (
    await b.newContext({
      viewport: { width: w, height: 900 },
      ...(mobile ? { userAgent: UA, isMobile: true, hasTouch: true } : {}),
    })
  ).newPage();
  p.on(
    "request",
    (r) => /\.(woff2?|ttf|otf)(\?|$)/.test(r.url()) && requests.add(r.url().split("/").pop().split("?")[0]),
  );
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  for (const r of ["", "about", "see-do", "rooms-booking", "does-not-exist"]) {
    await p.goto("http://localhost:3100/" + r, { waitUntil: "load" });
    await p.waitForTimeout(1000);
    const out = await p.evaluate(() => {
      const fam = new Map(),
        bad = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const n = walker.currentNode;
        if (!n.textContent.trim()) continue;
        const el = n.parentElement;
        if (!el || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName) || el.closest("iframe")) continue;
        const cs = getComputedStyle(el);
        const key = `${cs.fontFamily.split(",")[0]}|w${cs.fontWeight}|${cs.fontStyle}`;
        fam.set(key, (fam.get(key) ?? 0) + 1);
        if (!cs.fontFamily.toLowerCase().startsWith("brandon") || +cs.fontWeight > 400)
          bad.push(el.tagName + "." + String(el.className).slice(0, 40) + " => " + key);
      }
      return {
        fam: Object.fromEntries(fam),
        bad: bad.slice(0, 5),
        fontsLoaded: [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family),
      };
    });
    console.log(
      w,
      "/" + r,
      JSON.stringify(out.fam),
      out.bad.length ? "NON-STANDARD: " + JSON.stringify(out.bad) : "",
      "loaded:",
      [...new Set(out.fontsLoaded)].join(","),
    );
  }
  if (errs.length) console.log("errors", errs);
}
console.log("font files requested:", [...requests]);
await b.close();
