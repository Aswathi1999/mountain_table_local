# Website agent setup

Completed 2026-11-02. Scope: agent instructions and project-local skills only. Hero work was paused; no application implementation was changed during setup.

## Repository findings

The site promotes The Mountain Table in Vagamon and supports room discovery and guest enquiries. Current source uses Next 16.4, React 19.3, strict TypeScript, Tailwind 4, Motion 14, Lenis and Embla. Local photos, videos and fonts support the identity. Routes include home, about, see-do, rooms-booking, gallery, blog/article and contact. No standalone PRD was found; current source, typed content, user decisions and design documentation supply the requirements.

Reviewed architecture, layout, fonts/tokens, hero/rooms components, motion instructions, metadata, forms, security configuration, assets structure, package scripts and browser tooling. A separate read-only agent reviewed architecture, security, SEO and QA. This was a setup review, not a full source-line, asset-license, accessibility or production-performance audit.

README and STACK-NOTES contain historical Wix/fixed-coordinate information. DESIGN-SYSTEM has some stale palette values and does not fully describe the Caveat accent/current component shapes. AGENTS directs future work to preserve actual implementation rather than normalize it to stale documentation. Existing concerns recorded for future authorized work: mailto success wording can imply sending; sitemap omits blog articles; full lint includes noisy harness files. None were fixed during setup.

## Configured skills

| Skill | Decision and provenance |
| --- | --- |
| frontend-design | Retained existing installation; skills-lock.json attributes it to anthropics/skills. Preservation rules constrain its broad design suggestions. |
| motion | Retained existing motiondivision/ai-kit installation and local platform guides. No Motion+ dependency or service was added. |
| mountain-frontend | New project-authored native skill for architecture, security and measured performance. |
| mountain-ui-qa | New project-authored native skill for compatible refinement, accessibility, motion integration and existing Playwright workflow. |
| mountain-seo-assets | New project-authored native skill for metadata, content integrity, asset rights and optimization. |

New skills live in `.agents/skills/<name>/SKILL.md`; AGENTS links each directly. They have precise frontmatter descriptions and retain default implicit selection. Native catalog availability is expected on the next turn; direct file loading provides a fallback. Discovery does not guarantee perfect future adherence. Existing `.claude/skills` copies were not modified or duplicated. The external skills lock was left intact because these additions are locally authored, not downloaded upstream packages.

## Research and selection

- [OpenAI skill documentation](https://developers.openai.com/codex/skills/) and the installed skill-creator informed packaging and selective loading.
- [Vercel's official skill collection](https://github.com/vercel-labs/agent-skills) and [React skill entrypoint](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) were evaluated. Its broad rule set was not installed wholesale; this project's exact Next version and local guidance should drive decisions.
- [OpenAI Playwright skill](https://github.com/openai/skills/tree/main/skills/.curated/playwright) was evaluated. Its Bash/CLI wrapper would duplicate the installed Windows-compatible playwright-core workflow, so the local QA skill uses that existing workflow.
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/), [Web Vitals](https://web.dev/articles/vitals), and [Google Search Central](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) supply primary accessibility, performance and SEO references.
- GSAP was not added: Motion/CSS already meet the project needs. The motion skill remains the specialist source; GSAP-specific research is deferred until a task actually needs it.
- Existing imagegen capability is routed only for authorized raster work. New photo generation, stock downloads, font replacement and external services are not setup requirements.

No downloaded third-party scripts were executed. New skills contain only original Markdown guidance, with source links rather than copied manuals. No npm dependencies or global skills were installed. Existing skill provenance was read from the lock; this setup did not independently certify every historical skill resource or upstream maintenance claim.

## Verification and limitations

- Preserved the complete original generated Next.js block in AGENTS.md.
- Verified all three installed files match the prepared versions, and checked frontmatter, matching names, descriptions, body and absence of scaffold placeholders with Node.
- The bundled Python skill validator could not run because Python is unavailable; no validator dependencies were installed.
- Compared hashes of HomeHero.tsx, globals.css, package.json and package-lock.json before/after setup: unchanged. No writes targeted application code or assets.
- No website build or browser regression run was needed for instruction-only changes. This setup does not claim production performance scores, accessibility compliance or cross-browser certification.

Examples for future routing: homepage enhancement loads UI QA plus frontend-design under preservation constraints; animation changes load motion plus UI QA; optimization loads frontend and any relevant SEO guidance; new sections follow existing tokens/content conventions. An explicitly scoped redesign does not implicitly authorize copy or branding replacement.
