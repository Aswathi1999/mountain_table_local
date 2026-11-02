---
name: mountain-frontend
description: Implement or review React, Next.js, TypeScript, security, and performance changes in The Mountain Table project while preserving its working architecture and visual identity.
---

# Mountain frontend

Read root AGENTS.md, the affected route and its imports, then the relevant installed Next.js guide under node_modules/next/dist/docs. Package versions and current source outrank historical clone notes.

- Keep app pages as Server Components. Isolate state, effects and browser APIs in the smallest client component; pass serializable props across the boundary. Use the @/ alias and existing typed data modules.
- Reuse section, layout, ui and motion components before extracting new abstractions. Do not migrate working components, add a state library, or upgrade dependencies as incidental cleanup.
- Treat src/app/globals.css, src/lib/fonts.ts and current rendered components as the token and typography authority. Preserve the Cormorant/Manrope pairing and the limited Caveat accent. Do not introduce a new visual system for an optimization task.
- Inspect next.config.ts before changing loading, assets or integrations: media/fonts are self-hosted and CSP limits external resources. Do not weaken CSP to accommodate an unnecessary dependency. Keep secrets out of NEXT_PUBLIC variables and browser bundles.
- Enquiry and newsletter currently open mailto links; they do not send mail or persist subscriptions. Preserve this behavior unless backend integration is authorized. Validate untrusted input at a server boundary if one is added; encode URL values and escape JSON-LD safely. Never log guest data or submit real enquiries during tests.
- Measure the actual bottleneck before memoizing or splitting code. Keep critical images discoverable, reserve their dimensions, set responsive sizes, and lazy-load below-fold assets. Read this Next version's Image documentation before selecting preload/priority APIs.
- Preserve video posters, mobile/data-saver/reduced-motion fallbacks and visibility-based pause behavior. Immutable public asset URLs require a new filename when bytes change.
- Avoid fetch waterfalls when genuine independent work exists; do not add fetching/caching abstractions to this primarily local-content site. Do not enable cacheComponents or partialPrefetching without checking animation replay and route lifecycle behavior.
- Assess LCP, INP and CLS with an explicit environment and baseline. Good field targets at the 75th percentile are LCP <= 2.5s, INP <= 200ms, CLS <= 0.1; dev screenshots are not field measurements.
- Run npm run typecheck and targeted ESLint. Follow mountain-ui-qa for browser-facing changes. Explain remaining limitations without claiming measurements you did not make.

Sources: [Vercel skill evaluation](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices), [Web Vitals](https://web.dev/articles/vitals). These are references, not authority to override the installed framework or requested scope.
