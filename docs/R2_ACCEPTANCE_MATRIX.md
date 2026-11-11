# Kirjane Labs — R2 Visual & Engineering Acceptance Matrix

**This is a specification, not a PASS report. All gates OPEN until evidenced on a candidate SHA.**

| Gate | Required objective evidence | Automatic / human |
| --- | --- | --- |
| Identity | Authentic logo/green family; consistent typographic system; no generic templates | human visual sign-off |
| First viewport | Real screenshots 1440x900, 768x900, 390x844, 360x800, readable offer and working CTA | human + browser |
| IA | Six fixed routes all navigable, distinct page composition, comprehensible business copy | Playwright + human |
| Project truth | exact claim/status crosswalk with approved source references and permitted real media | owner content sign-off |
| Team | seven verified roles, no fake quotations/images, keyboard/phone support | source + Playwright + human |
| Process | five stages, reachable content, real forward/reverse behavior, stage stays visible, no scroll trap | browser behavior and recording |
| Contact | functioning mailto/social channels, honest transmission messaging, manual fallback | browser test + owner |
| A11y | keyboard nav, focus, skip link, contrast check, 44px targets, reduced motion, semantic controls | axe/Playwright + human |
| Technical | typecheck, lint, prerender all six, no browser errors, broken assets or x-scroll | GitHub Actions |
| Performance | LCP lab target 2.5s, CLS 0.1; record TBT and field-INP availability accurately; actual test profile | Lighthouse/trace |
| Responsive | 6 routes x 4 widths = 24 screenshots, inspected, issues triaged | visual review |
| Motion | short actual video of hero, projects, team forward/back, process forward/back, reduced motion | visual review |
| Governance | draft PR, changes/evidence linked, R1 and main unchanged, no deployment | GitHub |

## Failure conditions
Any P0/P1, false product status, missing contact route, scroll interaction that hides itself, fake customer proof, unapproved portraits, broken 360px layout or absent evidence blocks acceptance. Green typecheck is never a proxy for design approval.

## QA recording rules
For each result include candidate SHA, route/viewport, device/browser, command or interaction, direct screenshot/video location, actual observation and limits. Report *NOT RUN* when unavailable. Do not mark a static screenshot as motion-tested.
