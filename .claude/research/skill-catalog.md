# Skill catalog and decisions

Weights used: relevance 30, instruction quality 25, trust/security 20, maintenance 15, context efficiency 10. Judgment applied; no numeric scores were computed.

| Skill | Source | Status | Decision |
|---|---|---|---|
| frontend-design | anthropics/skills (skills-lock.json hash) | installed, unmodified | Keep; AGENTS.md preservation rules override its "bold new aesthetic" tendency. |
| motion | motiondivision/ai-kit (lock) | installed, unmodified | Keep; matches Motion 14. Bundled scripts/editor not executed. |
| mountain-frontend | locally authored | installed | Keep; mirrored to `.claude/skills` today. |
| mountain-ui-qa | locally authored | installed | Keep; mirrored today. |
| mountain-seo-assets | locally authored | installed | Keep; mirrored today. |
| vercel-labs/agent-skills (react-best-practices) | github.com/vercel-labs/agent-skills | evaluated earlier, not installed | Broad rules risk conflicting with Next 16 specifics; local docs in node_modules take priority. Revisit if a perf task needs it. |
| openai/skills playwright | github.com/openai/skills | evaluated earlier, not installed | Duplicates existing playwright-core workflow; bash wrapper is poor fit on Windows. |
| GSAP skills | n/a | rejected | No need; Motion + CSS suffice, and AGENTS.md forbids a second engine without cause. |

Provenance caveat: these URLs were evaluated in the earlier setup (docs/SKILL-SETUP.md). This session did not re-fetch them or re-verify upstream maintenance. No third-party script was executed.

Gap deliberately not filled: no dedicated skill for UX writing or visual-direction research; frontend-design plus mountain-seo-assets cover the need at this maturity.
