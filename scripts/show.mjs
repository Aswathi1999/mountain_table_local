import { readFileSync } from "node:fs";
const d = JSON.parse(readFileSync(process.argv[2], "utf8"));
for (const s of d) {
  console.log(`\n## ${s.id} box=${s.box} bg=${s.bg} bgImg=${s.bgImg ?? ""}`);
  for (const i of s.items) {
    const parts = [
      i.t + (i.id ? "#" + i.id.slice(-8) : ""),
      i.box.join(","),
      i.text && `"${i.text.slice(0, 160)}"`,
      i.src && `src=${i.src.slice(0, 110)}`,
      i.bgi && `bgi=${i.bgi.slice(0, 90)}`,
      i.bg && `bg=${i.bg}`,
      i.font,
      i.color && `c=${i.color}`,
      i.op && `op=${i.op}`,
      i.tf && `tf=${i.tf}`,
      i.bd && `bd=${i.bd}`,
      i.href && `href=${i.href.slice(0, 60)}`,
    ].filter(Boolean);
    console.log(" -", parts.join(" | "));
  }
}
