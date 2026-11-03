---
name: mountain-ui-qa
description: Refine or verify The Mountain Table layouts, responsive behavior, accessibility, interactions, animation, and visual regressions using the existing design system and Playwright tooling.
---

# Mountain UI and QA

Before editing, capture or inspect the affected section and its mobile state. Identify what the user authorized. Enhancement permits refinement, not replacement of palette, fonts, copy, photography or approved composition. Use frontend-design only within those constraints. Reuse src/components/decor for SVG and decorative motifs; do not add a competing icon system or rasterize existing vectors.

## Design and motion

- Read globals.css, the affected components and DESIGN-SYSTEM.md. Where documentation conflicts with current approved UI, preserve the implementation and report the conflict. In particular, do not replace the restored homepage three-card rooms layout without explicit authorization.
- Keep .wrap gutters, fluid type classes, existing breakpoints and booking buttons. Check long labels, image crops and text wrapping rather than forcing fixed heights. Existing rounded corners and card grids are not permission to redesign unrelated sections.
- Load the installed motion skill for motion changes. Reuse tokens.ts, home-fx.config.ts and primitives.tsx; do not add GSAP or a second scroll controller by default. If specifically requested, research its official integration and clean up timelines/listeners on unmount.
- Prefer transform/opacity for motion; profile expensive clipping, filters or large layers. Avoid layout reads mixed with writes in frame loops. Clean up observers, timers and subscriptions. Preserve native scrolling, touch behavior and keyboard focus.
- Test reduced motion, no-JS visibility and navigation replay. Avoid hiding essential copy behind an intro. Provide pause controls for persistent autoplay and keyboard/button alternatives for drag-only interactions when implementing them.

## Browser verification

Use installed playwright-core with Chrome and inspect scripts/shoot.mjs before running. Do not install a second test runner or run an unreviewed helper. Reuse an existing dev server; verify its availability instead of assuming it is running.

Example from PowerShell: `node scripts/shoot.mjs / 390 844 archive/screens/task-mobile 0 http://localhost:3000`. Use a new output prefix; do not overwrite baselines. Capture affected scroll positions at 390, 820 and 1440px; add 320px and breakpoint boundaries when relevant. An iPhone user agent in Chrome is not Safari testing.

Inspect screenshots, console/page errors, failed requests and horizontal overflow. Compare the same viewport/state with motion settled or reduced. Exercise changed controls and route navigation; never merely infer success from a screenshot or typecheck.

For accessibility check semantic headings/landmarks, accessible names, visible unobscured focus, keyboard order, modal Escape/focus restoration, form error associations, meaningful alt text and 200% text zoom/reflow. Target WCAG 2.2 AA: normal text contrast 4.5:1, large text 3:1, meaningful UI contrast 3:1, and target sizing/spacing requirements. If a fix requires changing protected brand elements, present the concrete conflict for approval. Automated scans supplement manual keyboard checks, not replace them.

Use `npm run typecheck` and `npx eslint <changed-files>`; use `npx eslint src --quiet` for broader source errors. Full npm run lint currently includes harness scripts and can produce unrelated failures. Report existing failures separately; never disable rules to conceal them. Keep testing proportional to the change. Production build testing needs an isolated/resource-appropriate setup because project documentation records memory constraints.

Sources: [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/), [Playwright](https://playwright.dev/docs/library). Report which browsers and checks actually ran.
