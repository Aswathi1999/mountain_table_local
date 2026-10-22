// node scripts/box.mjs <extract.json> <idSubstring...>  -> prints boxes of items whose id contains any substring
import { readFileSync } from "node:fs";
const [f, ...ids] = process.argv.slice(2);
for (const s of JSON.parse(readFileSync(f, "utf8")))
  for (const i of s.items)
    if (i.id && ids.some((x) => i.id.includes(x)))
      console.log(i.t, i.id, "[" + i.box.join(",") + "]", i.bg ?? "", i.op ? "op=" + i.op : "");
