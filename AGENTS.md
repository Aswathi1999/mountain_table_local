<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# The Mountain Table: project rules

## Scope and preservation
- Inspect the requested implementation and git diff before edits. Preserve existing user work and everything outside the authorized scope.
- Existing colors, theme, branding, typography, copy, imagery, URLs, SEO, functionality and approved layouts are protected. "Enhance", "modernize", "premium" and "improve" do not authorize replacing them. A redesign authorizes only its named scope; content and branding remain protected unless separately authorized.
- If an improvement requires changing a protected element, explain the concrete change and obtain approval first, unless already authorized. Routine compatible fixes need no extra approval.
- Current implementation and explicit user decisions outrank stale design notes. Read DESIGN-SYSTEM.md, but resolve differences against globals.css, fonts.ts and current approved UI. The homepage rooms section was explicitly restored to its three-card design; preserve it.

## Architecture and conventions
- Next.js App Router, React, strict TypeScript, Tailwind CSS 4; inspect package.json for installed versions. Routes in src/app compose sections in src/components/sections. Shared layout, ui, motion, decor and seo components belong in their existing folders. Typed content is in src/data; site constants, fonts and metadata helpers are in src/lib. Use @/ imports.
- Keep route pages server-rendered and client boundaries small. Reuse existing components, .wrap gutters, type classes, tokens and booking controls. Avoid unsolicited migrations, dependency additions, global CSS overrides or formatting unrelated files.
- Preserve locally hosted Cormorant Garamond, Manrope and existing Caveat accents. Read actual CSS tokens rather than copying historical palette values. Keep existing photography, captions and property facts; do not invent amenities, prices or reviews.
- Preserve CSP/security headers, escaped JSON-LD and environment boundaries. No credentials in client code, logs or public variables. Enquiry/newsletter forms currently open mail clients; do not assume a delivery backend.

## Skill discovery
Use the environment's native skill catalog and read the matching SKILL.md before applying it. Load only relevant skills and referenced subguides, not the whole catalog. If catalog refresh is delayed, read these project-local entrypoints directly:

| Task | Skill |
| --- | --- |
| React/Next architecture, security, performance | .agents/skills/mountain-frontend/SKILL.md |
| Layout, responsive UI, accessibility, browser/visual QA | .agents/skills/mountain-ui-qa/SKILL.md |
| SEO, metadata, writing or asset work | .agents/skills/mountain-seo-assets/SKILL.md |
| Visual design or new sections | .agents/skills/frontend-design/SKILL.md, constrained by preservation above |
| Motion/CSS animation or scroll interactions | .agents/skills/motion/SKILL.md and relevant platform guide |

Use environment-provided imagegen only for authorized raster generation, not to replace real property photography or existing vectors. Research current primary sources when APIs or recommendations are uncertain. Evaluate new skills for provenance, maintenance, compatibility, duplication, scripts and permissions before installation; never execute untrusted scripts without approval. Do not install GSAP, a second scroll engine or another browser runner merely because a task mentions animation/testing.

## Implementation and verification
- Inspect first, define the narrow change, implement, then verify against the original. Enhancement preserves identity; motion work preserves layout/content; optimization preserves visuals; a new section follows the existing design system.
- Reuse Motion tokens/config/primitives and existing Lenis integration. Preserve reduced-motion, touch, keyboard and no-JS behavior; clean up effects. Avoid scroll hijacking, inaccessible drag-only controls and blocking content behind animation.
- Preserve semantic headings, labels, focus visibility/restoration, contrast, responsive image sizing, metadata helpers, canonical origin, sitemap/robots and redirects. Keep asset dimensions stable; changed immutable assets need new URLs.
- Run npm run typecheck and targeted ESLint for code changes. For UI changes inspect screenshots at 390/820/1440px, interactions, overflow, browser errors, keyboard and reduced motion; expand checks when warranted. Use reviewed scripts/shoot.mjs with installed playwright-core/Chrome. Do not submit real enquiries during tests.
- Check for an existing dev server. Respect documented memory constraints: do not run a production build alongside it; use an appropriate isolated setup when production validation is required.
- Whole-repository lint currently includes noisy harness files. Separate existing failures from new regressions; do not disable rules or claim a clean full audit from targeted checks. Report exact checks, scope and limitations. Documentation-only setup does not require changing or rebuilding the app.

Setup rationale and sources: docs/SKILL-SETUP.md. Detailed guidance belongs in skills, not this file.
