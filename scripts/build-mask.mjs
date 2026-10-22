// Build public/images/adventure-mask.svg: the "ADVENTURE AWAITS:" lettering (Anton, font embedded as base64) used as a
// CSS mask over the See & Do video. SVG-as-image cannot see page fonts, hence the embedded font.
import { readFileSync, writeFileSync } from "node:fs";

const font = readFileSync("public/fonts/anton-latin.woff2").toString("base64");
const W = 677,
  H = 414,
  SIZE = 164.479,
  BASE1 = Number(process.env.BASE1 ?? 193);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<style>@font-face{font-family:"AntonMask";src:url(data:font/woff2;base64,${font}) format("woff2")}
text{font-family:"AntonMask";font-size:${SIZE}px;fill:#000}</style>
<text x="0" y="${BASE1}">ADVENTURE</text>
<text x="0" y="${(BASE1 + SIZE).toFixed(3)}">AWAITS:</text>
</svg>
`;
writeFileSync("public/images/adventure-mask.svg", svg);
console.log("written", svg.length, "bytes");
