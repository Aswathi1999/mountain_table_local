// Snapshot the original site into /archive: rendered + raw HTML, screenshots, and every asset it loads.
// Usage: node scripts/archive.mjs   (needs Chrome installed; uses playwright-core)
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const ORIGIN = "https://www.themountaintable.in";
const ROUTES = ["/", "/about", "/see-do", "/rooms-booking"];
const WIDTHS = (process.env.WIDTHS ?? "375,768,1280,1920").split(",").map(Number);
const OUT = "archive";
const slug = (r) => (r === "/" ? "home" : r.slice(1));
import { readFileSync, existsSync } from "node:fs";
const manifest = existsSync(`${OUT}/assets-manifest.json`)
  ? JSON.parse(readFileSync(`${OUT}/assets-manifest.json`, "utf8"))
  : {};

await mkdir(`${OUT}/html`, { recursive: true });
await mkdir(`${OUT}/screens`, { recursive: true });
await mkdir(`${OUT}/assets`, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: width < 600 ? 812 : 900 },
      ...(+width < 600
        ? {
            userAgent:
              "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
            deviceScaleFactor: 2,
          }
        : {}),
      isMobile: width < 600,
      hasTouch: width < 600,
    });
    const page = await ctx.newPage();
    const pending = [];
    page.on("response", (res) => {
      const type = res.request().resourceType();
      if (!["image", "font", "media", "stylesheet", "script", "fetch", "xhr", "other"].includes(type)) return;
      pending.push(
        res
          .body()
          .then(async (buf) => {
            const url = res.url();
            if (!buf?.length || manifest[url] || url.startsWith("data:")) return;
            const hash = createHash("sha256").update(buf).digest("hex");
            const base =
              path
                .basename(new URL(url).pathname)
                .replace(/[^\w.~-]/g, "_")
                .slice(0, 80) || "index";
            const file = `${OUT}/assets/${type}/${hash.slice(0, 8)}-${base}`;
            await mkdir(path.dirname(file), { recursive: true });
            await writeFile(file, buf);
            manifest[url] = { local: file, type, size: buf.length, sha256: hash, usedOn: [route] };
          })
          .catch(() => {}),
      );
    });
    await page.goto(ORIGIN + route, { waitUntil: "load", timeout: 90000 });
    await page.waitForTimeout(4000);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 400) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(1500);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/screens/${slug(route)}-${width}.png`, fullPage: true });
    if (width === 1280) await writeFile(`${OUT}/html/${slug(route)}.rendered.html`, await page.content());
    await Promise.all(pending);
    await ctx.close();
    console.log("archived", route, width);
  }
  const raw = await (await fetch(ORIGIN + route)).text();
  await writeFile(`${OUT}/html/${slug(route)}.raw.html`, raw);
}
await browser.close();

for (const f of ["robots.txt", "sitemap.xml", "pages-sitemap.xml"]) {
  const r = await fetch(`${ORIGIN}/${f}`);
  if (r.ok) await writeFile(`${OUT}/${f}`, await r.text());
}
await writeFile(`${OUT}/assets-manifest.json`, JSON.stringify(manifest, null, 2));
console.log("assets:", Object.keys(manifest).length);
