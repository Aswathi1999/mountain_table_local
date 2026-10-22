// Build archive/content/<page>.json from the archived Wix page-data JSON + raw HTML head (copy, images, SEO).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const manifest = JSON.parse(readFileSync("archive/assets-manifest.json", "utf8"));
const pages = {
  home: "Escape to The Mountain",
  about: "Our Story",
  "see-do": "Adventure",
  "rooms-booking": "Luxurious Rooms",
};
mkdirSync("archive/content", { recursive: true });
const seen = new Set();
const jsons = [];
for (const [u, v] of Object.entries(manifest)) {
  if (!/thunderbolt\?/.test(u) || seen.has(v.sha256)) continue;
  seen.add(v.sha256);
  try {
    jsons.push(JSON.parse(readFileSync(v.local, "utf8")));
  } catch {}
}
const render = jsons.filter((j) => j.props?.render);
for (const [page, marker] of Object.entries(pages)) {
  const j = render.find((r) => JSON.stringify(r).includes(marker));
  const cp = j.props.render.compProps;
  const out = { texts: {}, images: {}, other: {} };
  for (const [id, p] of Object.entries(cp)) {
    if (p.html) out.texts[id] = p.html;
    else if (p.imageInfo || p.uri || p.link || p.src) out.other[id] = p;
  }
  // raw head
  const raw = readFileSync(`archive/html/${page}.raw.html`, "utf8");
  const head = raw.slice(0, raw.indexOf("</head>"));
  out.head = {
    title: head.match(/<title[^>]*>([^<]*)/)?.[1],
    metas: [...head.matchAll(/<meta\s+([^>]*?)\/?>/g)]
      .map((m) => m[1])
      .filter((s) =>
        /name="(description|keywords|robots|viewport|theme-color)"|property="(og|fb|article):|name="twitter:/.test(s),
      ),
    canonical: head.match(/<link[^>]*rel="canonical"[^>]*>/)?.[0],
    alternates: [
      ...head.matchAll(/<link[^>]*rel="(alternate|icon|shortcut icon|apple-touch-icon|manifest)"[^>]*>/g),
    ].map((m) => m[0]),
    jsonld: [...raw.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]),
  };
  writeFileSync(`archive/content/${page}.json`, JSON.stringify(out, null, 1));
  console.log(
    page,
    Object.keys(out.texts).length,
    "texts,",
    Object.keys(out.other).length,
    "other props; title:",
    out.head.title,
    "; ld+json:",
    out.head.jsonld.length,
  );
}
