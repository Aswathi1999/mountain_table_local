@AGENTS.md

# Claude Code notes (The Mountain Table)

`AGENTS.md` above is the authoritative rule set (scope/preservation, architecture, skill routing, verification). This file adds only Claude Code specifics; do not duplicate AGENTS.md here.

## Project identity
Marketing and enquiry site for The Mountain Table, a stay in Vagamon (Kerala). Goal: room discovery and guest enquiries (forms open mail clients; there is no delivery backend). Current state: active implementation on a clone/rework of themountaintable.in. Requirements come from current source, `src/data`, user decisions, `DESIGN-SYSTEM.md` (partly stale), `RESORT-DESIGN-BRIEF.md`. No standalone PRD exists; do not invent one.

## Stack and commands
Next 16.4 (App Router, Turbopack), React 19.3, strict TS, Tailwind 4, Motion 14, Lenis, Embla. Read `node_modules/next/dist/docs/` before Next-specific code.
`npm run dev` | `npm run typecheck` | `npx eslint <changed files>` | `npm run format:check` | `npm run audit`. `npm run build` must not run alongside a dev server (memory).

## Skills (project-local, in `.claude/skills/`)
- `mountain-frontend`: architecture, security, performance.
- `mountain-ui-qa`: responsive/a11y/visual QA, Playwright via `scripts/shoot.mjs`.
- `mountain-seo-assets`: metadata, content integrity, asset rights.
- `frontend-design`, `motion`: third-party (see `skills-lock.json`); always constrained by AGENTS.md preservation rules.
The same skills are mirrored in `.agents/skills/` for other agents. When editing one, update both copies.

## Workflows
- Enhancement: audit, list issues, preserve working behavior, targeted change, regression screenshots.
- New section/page: define purpose and content hierarchy first, reuse tokens and primitives, then responsive/a11y/performance review.
- Redesign: capture baseline, get an approval gate on direction, phased work, compare. Redesign never implicitly authorizes copy, branding or photography changes.
- Visual review: judge brand fit, type, colour, spacing, hierarchy, image quality against the actual `globals.css` tokens; give concrete fixes.

## Content and assets
No invented amenities, prices, reviews, awards or stats. README states the source text and photos belong to the original site and need replacing or licensing before public launch; treat asset provenance as unresolved.

## Supporting docs
`docs/SKILL-SETUP.md`, `.claude/research/` (assessment, skill catalog, design research, engineering standards, setup report), `DESIGN-SYSTEM.md`, `ANIMATIONS.md`, `SEO-REPORT.md`, `STACK-NOTES.md`.
