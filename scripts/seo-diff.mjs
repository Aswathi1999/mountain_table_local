// SEO parity: compare each page's <head> in the archived original (archive/content/<page>.json) with the running clone.
// Expected differences are limited to the domain (SITE_URL). Usage: node scripts/seo-diff.mjs [cloneOrigin] -> SEO-REPORT.md
import { readFileSync, writeFileSync } from "node:fs";

const clone = (process.argv[2] ?? "http://localhost:3200").replace(/\/$/, "");
const ORIGIN = "https://www.themountaintable.in";
const pages = { "/": "home", "/about": "about", "/see-do": "see-do", "/rooms-booking": "rooms-booking" };

const decode = (s = "") => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const attr = (tag, name) => decode(tag.match(new RegExp(`${name}="([\\s\\S]*?)"`))?.[1]);
const tags = (html, re) => [...html.matchAll(re)].map((m) => m[0]);

function extract(html) {
  const head = html.slice(0, html.indexOf("</head>"));
  const metas = tags(head, /<meta\s[^>]*>/g);
  const find = (key) => {
    const tag = metas.find((t) => new RegExp(`(name|property)="${key}"`).test(t));
    return tag ? attr(tag, "content") : undefined;
  };
  return {
    title: decode(head.match(/<title[^>]*>([^<]*)/)?.[1]),
    description: find("description"),
    canonical: attr(tags(head, /<link[^>]*rel="canonical"[^>]*>/g)[0] ?? "", "href") || undefined,
    robots: find("robots"),
    "og:title": find("og:title"),
    "og:description": find("og:description"),
    "og:url": find("og:url"),
    "og:site_name": find("og:site_name"),
    "og:type": find("og:type"),
    "og:image:width": find("og:image:width"),
    "og:image:height": find("og:image:height"),
    "twitter:card": find("twitter:card"),
    "twitter:title": find("twitter:title"),
    "twitter:description": find("twitter:description"),
    "fb:admins": find("fb:admins"),
    "format-detection": find("format-detection"),
    "google-site-verification": find("google-site-verification"),
    h1: decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, " ")),
    jsonld: [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.stringify(JSON.parse(m[1]))),
  };
}

const normalise = (v) => (typeof v === "string" ? v.replaceAll(clone, ORIGIN).replace(/(\/)$/, "") : v);
let report = `# SEO parity report\n\nOriginal (archived \`<head>\`) vs clone at \`${clone}\`. Domain differences are normalised away (the clone uses \`SITE_URL\`).\n\n`;
let failures = 0;

for (const [route, page] of Object.entries(pages)) {
  const archived = readFileSync(`archive/html/${page}.raw.html`, "utf8");
  const original = extract(archived);
  const mine = extract(await (await fetch(clone + route)).text());
  const rows = [];
  for (const key of Object.keys(original)) {
    if (key === "og:image:width" || key === "og:image:height") {
      // The clone serves the original image at its real size; compare against the original's declared values.
    }
    const a = key === "jsonld" ? original.jsonld.map(normalise) : normalise(original[key]);
    const b = key === "jsonld" ? mine.jsonld.map(normalise) : normalise(mine[key]);
    const same = JSON.stringify(a) === JSON.stringify(b);
    if (!same) failures++;
    rows.push(`| ${key} | ${same ? "✅" : "❌"} | ${same ? "" : `original: \`${JSON.stringify(a)?.slice(0, 140)}\`<br>clone: \`${JSON.stringify(b)?.slice(0, 140)}\``} |`);
  }
  report += `## ${route}\n\n| Field | Match | Detail |\n|---|---|---|\n${rows.join("\n")}\n\n`;
}
report += `**Result:** ${failures === 0 ? "no differences beyond the domain." : `${failures} field(s) differ.`}\n`;
writeFileSync("SEO-REPORT.md", report);
console.log(report.split("\n").filter((l) => l.includes("❌") || l.startsWith("##") || l.startsWith("**Result")).join("\n"));
