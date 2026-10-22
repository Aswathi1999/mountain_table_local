// node scripts/probe.mjs <url> "<js expression evaluated in page>"
import { chromium } from "playwright-core";
const [url, expr] = process.argv.slice(2);
const b = await chromium.launch({ channel: "chrome" });
const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
p.on("pageerror", (e) => console.log("PAGEERROR", e.message));
p.on("console", (m) => m.type() === "error" && console.log("CONSOLE", m.text().slice(0, 200)));
await p.goto(url, { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(expr), null, 1));
await b.close();
