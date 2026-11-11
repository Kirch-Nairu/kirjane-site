# Kirjane Antigravity skill inventory — execution & verification log

## 1. Bundled repository skills (read & active)
- **`frontend-design`**: [`.agents/skills/frontend-design/SKILL.md`](file:///C:/KirjaneSite/.agents/skills/frontend-design/SKILL.md) (with [`LICENSE.txt`](file:///C:/KirjaneSite/.agents/skills/frontend-design/LICENSE.txt) Apache 2.0, copied from [Valencia R2 `d5e121522c557f63ec683cf9aee79309795005b8`](https://github.com/Kirch-Nairu/ValWebsite/tree/d5e121522c557f63ec683cf9aee79309795005b8/.agents/skills/frontend-design)).
- **`kirjane-visual-acceptance`**: [`.agents/skills/kirjane-visual-acceptance/SKILL.md`](file:///C:/KirjaneSite/.agents/skills/kirjane-visual-acceptance/SKILL.md). Enforces real browser visual inspection at `1440×900`, `768×900`, `390×844`, and `360×800`, first-viewport Gate G3 verification, motion recordings, and truthful content checks.

## 2. External skills installed & verified on workstation (`.agents/skills/`)
Verified via `Get-ChildItem .agents/skills -Directory` and `skills-lock.json`:

| Skill ID | Local Path | Source Repository | Verified Commit / Hash | Applied Scope |
| :--- | :--- | :--- | :--- | :--- |
| **`gsap-react`** | `.agents/skills/gsap-react/SKILL.md` | `greensock/gsap-skills` | `8c4a01ae398b2db12de1a6bb784dbdc1c1343343a749edebfa8aa2136f5e5dd2` | `useGSAP()` hook, scope refs, `contextSafe()`, automatic ScrollTrigger & timeline cleanup on route unmount. |
| **`gsap-scrolltrigger`** | `.agents/skills/gsap-scrolltrigger/SKILL.md` | `greensock/gsap-skills` | `7bf764c7deaa1cf17d8a14aa3b4372aaad0db9cb47be00b731cf455267a9f23f` | Reversible scroll progress tracking and parallax brand layers in `Home`, `TeamScrollShowcase`, and `ProcessStoryScroll`. |
| **`gsap-timeline`** | `.agents/skills/gsap-timeline/SKILL.md` | `greensock/gsap-skills` | `07cb59337215d39360fa5da74f9db85399fd5445ba8c8e2ab27be30acdd9404b` | Sequenced entrance choreography (`M01`) and coordinated stage transitions (`M03`, `M04`). |
| **`gsap-performance`** | `.agents/skills/gsap-performance/SKILL.md` | `greensock/gsap-skills` | `e7a6d7b9995a93e69fa5107dece1c3a32968098aa5a1ebdfca11960d809b32df` | Transform/opacity-only animations (`x`, `y`, `scale`, `autoAlpha`), zero layout thrashing, `gsap.matchMedia()` for responsive & `prefers-reduced-motion`. |
| **`gsap-core`** | `.agents/skills/gsap-core/SKILL.md` | `greensock/gsap-skills` | `c5d87e22c2357b45107dc67fe12fa42fc40eb1c3e266d5e1faaeacbc9c4f1d29` | Core tweens, easing (`power3.out`, `expo.out`), and `gsap.matchMedia()`. |
| **`web-design-guidelines`** | `.agents/skills/web-design-guidelines/SKILL.md` | `vercel-labs/agent-skills` | `78eb2bcbe0be9ef0bc5fcf2bd4ab2fb6fc9e1dc5faee36fb0eef9fa1ff5cc137` | Semantic landmarks, keyboard focus visibility, accessible form labels, contrast, and responsive layout hygiene. |
| **`vercel-react-best-practices`** | `.agents/skills/vercel-react-best-practices/SKILL.md` | `vercel-labs/agent-skills` | `551d4fb6dbbe3fb80bd1caebbf4b8bc54d9cd4ef97cd7b71d4e3da4af3ca5f3a` | Clean React state transitions, zero hydration mismatches, passive event listeners, and lean bundle imports. |

## 3. Runtime Packages Installed & Verified (`package.json`)
- `gsap`: `^3.14.2`
- `@gsap/react`: `^2.1.2`
- `@playwright/test`: `^1.59.1` (devDependency for automated 24-capture visual QA and motion video capture)
