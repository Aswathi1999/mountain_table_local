# Engineering standards (summary; AGENTS.md and skills are authoritative)

- **Architecture:** routes in `src/app` compose `src/components/sections`; content in `src/data`; constants/fonts/metadata in `src/lib`; `@/` imports; pages server-rendered, small client islands.
- **Next 16:** read `node_modules/next/dist/docs/` before relying on memory of older APIs.
- **Security:** keep CSP/headers and escaped JSON-LD; no secrets in client code or `NEXT_PUBLIC_*`; mailto forms only, no assumed backend; run `npm run audit` before dependency changes; no new dependencies without a reason.
- **Performance:** measure before optimizing (Lighthouse/DevTools, `scripts/_jank.mjs`, `_cls.mjs` exist); stable asset dimensions; responsive `sizes`; transform/opacity animation; clean up effects. Targets: Core Web Vitals (LCP, INP, CLS). No scores are claimed here.
- **Accessibility:** WCAG 2.2 AA target; semantic headings, labels, focus visibility/restoration, keyboard and reduced-motion paths, contrast, touch targets.
- **SEO:** metadata helpers, canonical via `NEXT_PUBLIC_SITE_URL`, sitemap/robots/llms.txt, JSON-LD. Known gap: blog articles missing from sitemap.
- **Verification (definition of done):** `npm run typecheck`; ESLint on changed files; screenshots at 390/820/1440 via `scripts/shoot.mjs`; check overflow, console errors, keyboard, reduced motion. Separate pre-existing lint noise from regressions. Never submit real enquiries.
- **Not present:** unit/e2e test suite, CI config, visual-regression baseline. Ad-hoc scripts in `scripts/` fill this role.
