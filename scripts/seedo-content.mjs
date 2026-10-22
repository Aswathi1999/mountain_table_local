// node scripts/seedo-content.mjs <out.json> [width] -> main text/links/images of /see-do, for before/after comparison
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
const [out, w = "1440", route = "see-do"] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome" });
const p = await (await b.newContext({ viewport: { width: +w, height: 900 } })).newPage();
const errors = [];
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
p.on("pageerror", (e) => errors.push(e.message));
await p.goto(`http://localhost:3001/${route}`, { waitUntil: "load" });
await p.waitForTimeout(2000);
const data = await p.evaluate(() => {
  const main = document.querySelector("main");
  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const textNodes = [];
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const t = norm(walker.currentNode.textContent);
    if (t) textNodes.push(t);
  }
  return {
    // textContent includes visually hidden text and ignores CSS text-transform, so it is the source-text comparison
    text: textNodes.join(" | "),
    flat: norm(main.textContent).replace(/\s/g, ""),
    headings: [...main.querySelectorAll("h1,h2,h3")].map((h) => norm(h.textContent)),
    links: [...main.querySelectorAll("a")].map((a) => a.getAttribute("href")),
    imgs: [...main.querySelectorAll("img")].map((i) => `${i.getAttribute("alt")}`),
  };
});
writeFileSync(out, JSON.stringify({ ...data, errors }, null, 1));
console.log(data.headings.length, "headings", data.imgs.length, "imgs", errors.length, "errors");
await b.close();
