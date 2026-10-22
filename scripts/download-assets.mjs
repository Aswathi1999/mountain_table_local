// Download every asset the original pages use, at original resolution, into /public. Writes public/assets-manifest.json.
// Usage: node scripts/download-assets.mjs   (reads archive/assets-manifest.json produced by scripts/archive.mjs)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const archive = JSON.parse(readFileSync("archive/assets-manifest.json", "utf8"));
const out = {};
const dirs = {
  images: "public/images",
  icons: "public/icons",
  fonts: "public/fonts",
  videos: "public/videos",
  favicon: "public/favicon",
};
for (const d of Object.values(dirs)) mkdirSync(d, { recursive: true });

// Only what the clone uses. Icons and fonts are saved under descriptive names.
const ICONS = {
  "11062b_6ae75f5973f14b8c85543a72a4f1f89b": "play",
  "11062b_bbbbe61e2f734ee38939deab5e6c34f1": "hills",
  "11062b_d62383881875450493afde52ffe02c6d": "book",
  "357ace99ce2b41c6a0cfaa07dd102299": "breakfast",
  "3a44cc98be924931ae72a47fa57c414e": "wifi",
  "7cd8fd287d534ee2881f3f9d3a7988c0": "house",
  "84770f_227925e4873b4c67bb0c7bc1a29fd473": "garden",
  ad5c44251cee47d2bbd9d6726bbb505c: "housekeeping",
  db4682d617bb43fabc720d6617470588: "bed",
  eeee7cbf768f46b392b957d721205ef2: "pool",
};
const FONTS = {
  "brandon-grot-w01-light.woff2": "brandon-grot-w01-light.woff2",
  "didot-w01-italic.woff2": "didot-w01-italic.woff2",
  "helvetica-w01-bold.woff2": "helvetica-w01-bold.woff2",
  "1Ptgg87LROyAm3Kz-C8CSKlv.woff2": "anton-latin.woff2",
};
const wanted = new Map(); // original url -> { dir, usedOn }
for (const [url, meta] of Object.entries(archive)) {
  const u = new URL(url);
  if (
    u.host === "static.wixstatic.com" &&
    u.pathname.startsWith("/media/") &&
    /\.(jpe?g|png|webp|gif)/i.test(u.pathname)
  ) {
    // strip the resize suffix: /media/<id>.<ext>/v1/fill/... -> /media/<id>.<ext>
    const base = u.pathname.split("/v1/")[0].replace(/(\.(?:jpe?g|png|webp|gif)).*$/i, "$1");
    wanted.set(`https://static.wixstatic.com${base}`, { dir: dirs.images, usedOn: meta.usedOn });
  } else if (u.host === "static.wixstatic.com" && u.pathname.startsWith("/shapes/")) {
    if (ICONS[path.basename(u.pathname, ".svg")]) wanted.set(url, { dir: dirs.icons, usedOn: meta.usedOn });
  } else if (meta.type === "font" && /woff2/.test(url)) {
    if (FONTS[path.basename(archive[url].local).replace(/^[0-9a-f]{8}-/, "")])
      wanted.set(url, { dir: dirs.fonts, usedOn: meta.usedOn });
  } else if (meta.type === "media" && /\.mp4/.test(url)) {
    wanted.set(url, { dir: dirs.videos, usedOn: meta.usedOn });
  }
}

const fileName = (url, dir) => {
  const u = new URL(url);
  let n = decodeURIComponent(path.basename(u.pathname))
    .replace(/~mv2/g, "")
    .replace(/[^\w.-]/g, "_");
  if (dir === dirs.videos)
    n = u.pathname.split("/").slice(-4, -3)[0] + "-" + u.pathname.split("/").slice(-3, -2)[0] + ".mp4"; // <id>-480p.mp4
  if (dir === dirs.icons) n = `${ICONS[path.basename(u.pathname, ".svg")]}.svg`;
  if (dir === dirs.fonts) n = FONTS[path.basename(archive[url].local).replace(/^[0-9a-f]{8}-/, "")];
  return n;
};

let ok = 0,
  failed = [];
for (const [url, { dir, usedOn }] of wanted) {
  const local = path.join(dir, fileName(url, dir));
  let buf;
  for (let attempt = 0; attempt < 2 && !buf; attempt++) {
    try {
      const r = await fetch(url);
      if (r.ok) buf = Buffer.from(await r.arrayBuffer());
    } catch {}
  }
  if (!buf && archive[url]) buf = readFileSync(archive[url].local); // fall back to what the archive captured
  if (!buf) {
    failed.push(url);
    continue;
  }
  writeFileSync(local, buf);
  out[url] = {
    local: local.replace(/^public/, ""),
    size: buf.length,
    sha256: createHash("sha256").update(buf).digest("hex"),
    usedOn,
  };
  ok++;
}
writeFileSync("public/assets-manifest.json", JSON.stringify(out, null, 2));
console.log(`downloaded ${ok}/${wanted.size}; failed:`, failed);
