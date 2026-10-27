import Image from "next/image";

/** Runs before the page paints: a visitor who has already seen the splash this session skips it (and a script-less visitor sees it once per page, then it lifts away by itself). */
const SKIP_IF_SEEN = `try{var d=document.documentElement;if(sessionStorage.getItem("mt-splash"))d.classList.add("splash-seen");else sessionStorage.setItem("mt-splash","1")}catch(e){}`;

/**
 * The opening screen: the logo on deep green with a gold line that draws beneath it, then the whole screen lifts away like a
 * curtain. It is part of the server HTML (so it covers the page from the very first paint) and is driven entirely by CSS
 * animation, so it always leaves by itself, even if scripts fail. It shows once per browser session (`mt-splash`), lasts about
 * two seconds and, with reduced motion, simply fades. Styles: `.splash` in globals.css.
 */
export function Splash() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SKIP_IF_SEEN }} />
      <div id="splash" className="splash" aria-hidden="true">
        <div className="splash-inner">
          <div className="splash-logo">
            <Image
              src="/images/logo-wordmark-light.png"
              alt=""
              width={232}
              height={139}
              priority
              sizes="(min-width: 768px) 232px, 168px"
              className="h-auto w-[168px] md:w-[232px]"
            />
          </div>
          <span className="splash-line" />
        </div>
      </div>
    </>
  );
}
