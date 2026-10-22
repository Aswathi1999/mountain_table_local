import { chromium } from "playwright-core";
const UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const b = await chromium.launch({ channel: "chrome" });
for (const mobile of [false, true]) {
  const ctx = await b.newContext(
    mobile
      ? { viewport: { width: 375, height: 812 }, userAgent: UA, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
      : { viewport: { width: 1280, height: 900 } },
  );
  const p = await ctx.newPage();
  await p.goto("https://www.themountaintable.in/about", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(3000);
  await p.evaluate((y) => scrollTo(0, y), mobile ? 2200 : 1500);
  await p.waitForTimeout(9000);
  const f = p.frames().find((f) => /instafeed/.test(f.url()));
  const fr = await p.evaluate(() => {
    const e = document.querySelector("iframe[src*=instafeed]");
    const b = e.getBoundingClientRect();
    return [Math.round(b.left), Math.round(b.top + scrollY), Math.round(b.width), Math.round(b.height)];
  });
  console.log(mobile ? "MOBILE" : "DESKTOP", "iframe", fr);
  const items = await f.evaluate(() =>
    [...document.querySelectorAll("[data-hook=item-container], .gallery-item-container")].map((e) => {
      const b = e.getBoundingClientRect();
      const c = getComputedStyle(e);
      return [
        Math.round(b.left),
        Math.round(b.top),
        Math.round(b.width),
        Math.round(b.height),
        c.borderRadius,
        e.querySelector("svg") ? "badge" : "",
      ].join(",");
    }),
  );
  console.log(items.join("\n"));
  const badge = await f.evaluate(() => {
    const s = document.querySelector(".gallery-item-container svg, [data-hook=item-container] svg");
    if (!s) return null;
    const b = s.getBoundingClientRect();
    const pb = s.parentElement.getBoundingClientRect();
    return {
      svg: [b.left, b.top, b.width, b.height].map(Math.round),
      parent: [pb.left, pb.top, pb.width, pb.height].map(Math.round),
      bg: getComputedStyle(s.parentElement).backgroundColor,
      html: s.outerHTML.slice(0, 700),
    };
  });
  console.log("badge", JSON.stringify(badge));
  // hover state
  const first = await f.$("[data-hook=item-container], .gallery-item-container");
  if (first) {
    await first.hover();
    await p.waitForTimeout(700);
    console.log(
      "hover overlay:",
      await f.evaluate(() =>
        [...document.querySelectorAll("[class*=overlay], [class*=hover]")]
          .slice(0, 3)
          .map(
            (e) =>
              e.className.toString().slice(0, 40) +
              ":" +
              getComputedStyle(e).opacity +
              ":" +
              getComputedStyle(e).backgroundColor,
          )
          .join(" | "),
      ),
    );
  }
  await ctx.close();
}
await b.close();
