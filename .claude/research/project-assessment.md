# Project assessment

Date: 2026-11-02. Basis: local files only (README, package.json, AGENTS.md, docs/SKILL-SETUP.md, skills, git status). Not a source-line audit.

- **Type:** active implementation of a rework/clone of themountaintable.in (README: "faithful clone"; git shows large uncommitted changes plus two merged feature PRs). Not a greenfield build, not a stable production site.
- **Stack:** Next 16.4.0, React 19.3.0, strict TS 5.9, Tailwind 4.3.3, Motion 14.6, Lenis, Embla 8.6, playwright-core 1.64 (dev). npm. Node 22 per README. Deployment target: unknown.
- **Business:** boutique stay in Vagamon; goals are room discovery and enquiries. Forms use mailto (no backend).
- **Routes:** `/`, about, see-do, rooms-booking, gallery, blog/article, contact, sitemap, robots, llms.txt.
- **Design:** preserve. Locally hosted Cormorant Garamond, Manrope, Caveat accents; homepage rooms section is an explicit three-card design. Tokens live in `globals.css`; DESIGN-SYSTEM.md is partly stale.

## Strengths
Typed content in `src/data`, token-based CSS, reusable motion primitives, reduced-motion handling, security headers/CSP, existing screenshot tooling.

## Risks and gaps (unfixed, recorded only)
1. **Asset/copy licensing:** README says original text and photos should be replaced or licensed before public launch. Largest launch risk.
2. mailto success wording may imply a message was sent.
3. Sitemap omits blog articles.
4. Full `eslint .` is noisy because of `harness/` and `scripts/` files (many ad-hoc `_*.mjs`).
5. README/STACK-NOTES carry historical Wix coordinates.
6. Stray file `nul` in repo root (Windows artifact); not deleted.
7. Uncommitted work is substantial; `.claude/` and `.agents/skills/mountain-*` are untracked.

## Unknowns
Hosting/deployment, analytics, domain/canonical in production, asset licences, audience data, conversion metrics.
