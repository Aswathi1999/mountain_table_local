import { readFileSync } from "node:fs";
const d = JSON.parse(readFileSync(process.argv[2], "utf8"));
const skip = /SITE_HEADER|SITE_FOOTER|comp-ijeflm1h/;
for (const s of d) {
  if (skip.test(s.id)) continue;
  console.log(`## ${s.id.slice(-8)} y=${s.box[1]} h=${s.box[3]} bgImg=${s.bgImg ? "tile" : "-"}`);
  for (const i of s.items) {
    if (i.t === "div" && !i.src && !i.text && !i.bgi && !i.bd) continue;
    if (i.t === "wix-bg-image") continue;
    const f = i.font
      ?.replace(/brandon-grot-w01-light, (brandon-grot-w05-light, )?sans-serif/, "BG")
      .replace(/normal 400 /, "")
      .replace(/ ls:normal tt:none/, "");
    console.log(
      ` ${i.t}${i.id ? "#" + i.id.slice(-6) : ""} [${i.box.join(",")}] ${i.text ? JSON.stringify(i.text.slice(0, 50)) : ""} ${i.src ? "IMG:" + i.src.split("/media/")[1]?.split("/")[0]?.slice(0, 26) : ""} ${f ?? ""} ${i.color ?? ""} ${i.bd ? "bd:" + i.bd : ""} ${i.tf && i.tf !== "matrix(1, 0, 0, 1, 0, 0)" ? "tf:" + i.tf : ""}`.replace(
        / +/g,
        " ",
      ),
    );
  }
}
