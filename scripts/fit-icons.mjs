// Wix inlines its icon SVGs with the viewBox trimmed to the artwork (the file's own data-bbox attribute).
// The downloaded originals keep a padded 200x200 viewBox, so re-fit each root <svg> to data-bbox and drop its fixed size.
// Usage: node scripts/fit-icons.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = "public/icons";
for (const file of readdirSync(dir).filter((f) => f.endsWith(".svg"))) {
  const path = `${dir}/${file}`;
  const svg = readFileSync(path, "utf8");
  const root = svg.match(/<svg\b[^>]*>/)[0];
  const bbox = root.match(/data-bbox="([^"]+)"/)?.[1];
  if (!bbox) {
    console.log(file, "no data-bbox, left as is");
    continue;
  }
  const fitted = root.replace(/\s(width|height|viewBox)="[^"]*"/g, "").replace("<svg", `<svg viewBox="${bbox}"`);
  writeFileSync(path, svg.replace(root, fitted));
  console.log(file, "->", bbox);
}
