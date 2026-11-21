# R3 QA, VISUAL EVIDENCE & RELEASE-GATE CONTRACT

This specification makes an authored animation system **demonstrably better**, not just more animated.

## What is evidence vs expectation

Historical R2 evidence: prior R2 browser runs reported 79/79 immersive checks and 61/61 production checks at a tested candidate. These do NOT qualify new R3 changes. Every R3 candidate must rerun the suites and capture fresh screenshots.

The ten user screenshots were supplied in ChatGPT and are not accessible as binary images through the Codex GitHub clone; \`SHOT_MAP.md\` is the exact transcription. Recreate baseline at the frozen R2 SHA, with a real browser, before redesign. Do not claim source screenshots are present or uploaded.

A build test proves dependency resolution, not appearance. Axe catches certain a11y defects, not all visual contrast/interaction bugs. Software SwiftShader rendering is not comparable to a device GPU. Never invent a pass, metrics, image or video.

## Required evidence structure

\`\`\`
docs/codex-r3/
  START_HERE.md
  SHOT_MAP.md
  MOTION_ARCHITECTURE.md
  QA_EVIDENCE.md
  EXECUTION_LOG.md           # agent creates + maintains
  CORRECTIONS.md             # agent creates + maintains
  EVIDENCE_INDEX.md          # links/paths and exact screenshot states
  ASSET_LICENSES.csv         # every new used external asset/library
  REPRO_RECIPES.md           # per shot route + state + viewport
dist/codex-r3-evidence/       # generated screenshots/videos; do not commit huge raw footage to Git
  baseline/
  candidate/
  perf/
  accessibility/
\`\`\`

Record the SHA against every evidence item; if using private CI artifacts, provide durable GitHub run URLs and note retention. Small before/after contact sheets can be committed into docs if licensing/source provenance is clear.

## Mandatory test grid

| Dimension | Required conditions | Failure examples |
|---|---|---|
| Pages | Home, Salryn, Services, Projects, Process, About, Contact | 404, missing H1, broken native nav, wrong paths |
| Desktop | 1440×900, 1920×1080 | excessive blank white, text under 3D, cut-off orbits |
| Tablet | 768×1024, 1024×768 landscape | pin collisions, split-layout squeeze |
| Mobile | 320×700, 390×844 | horizontal overflow, tiny buttons, unreadable text |
| Input | keyboard only, pointer, touch | selection stolen by scroll, focus trap, tap misses |
| Motion | regular, OS reduced, forced reduced, JS disabled | blank essential content, unsafe scroll-jacking |
| Interruption | fast forward/reverse scroll, tab hide, route switch, BFCache | duplicated trigger, wrong state restoration |
| Rendering | GPU capable if available, software fallback, context-loss | blank panel, unhandled promise, GPU runaway |
| Accessibility | WCAG 2.2 AA, axe, manual contrast/focus, live regions | black on black, unwanted animation, noisy aria-live |
| Assets | all image decode + script success | hidden lazy art in full-page capture |
| Reliability | build, lint, tests, dependency lock, local HTTP | can only run through a remote CDN |
| Provenance | upstream URL, exact version, license and use | unknown CGI/stock/copyright, unpinned libraries |

## Ten shot gate matrix

| Shot | Initial state | Specific state tests | Pass condition |
|---|---|---|---|
| 01 | Home disorder scene | 0 / 25 / 50% scroll, backwards | shards convey structured convergence |
| 02 | Home resolved core | final scene, reverse then settle | visually continuous transformation and readable text |
| 03 | Home engineering modes | 4 selection buttons + scrub + pause | 4 visually distinctive legible states, no blank expanse |
| 04 | Process Home + dedicated page | 5 stage buttons/anchors, Back, manual selection | linked topology/fields, accurate five-stage hierarchy |
| 05 | Salryn initial core | initial hero + transition | signature material, controlled framing and scale |
| 06 | Salryn workspaces | middle chapter, text and object | sphere/streams visibly separated, shared-record concept |
| 07 | Salryn specialization | far chapter, targeted engine | hierarchy evident, differentiated capabilities |
| 08 | Salryn industry | choose 3 industries, 5 steps, replay | changes workflow, not just label; inquiry retains selection |
| 09 | Salryn engines | 6 toggles, 2 mandatory, 8 inspectable nodes | synchronized count, role, visual scene, usable fallback |
| 10 | Salryn offline states | normal/outage/recovery, keyboard/replay | local continues, external queued, recovery settles |

**Every P0 shot (03/04/08/09/10) needs proof of substantive new implementation**, not merely revised CSS colors or wrapping an existing SVG in a moving card.

## Performance measurement protocol

Collect **matched** R2 and R3 runs on the same test host, browser revision and viewport, with:
- startup transferred / decoded JS and resource bytes;
- LCP, CLS and user-input latency when instrumentable; field INP requires real users and must not be fabricated from local test;
- synthetic wheel/scroll p50/p95/p99 frame intervals for selected chapters;
- long tasks count and worst duration;
- JS used heap after route entry, after 5 full chapter transitions and after disposal;
- WebGL contexts as actually queried/captured via instrumentation, not inferred from canvas count;
- GPU vendor/renderer if permitted and accurate; acknowledge disabled query/SwiftShader;
- battery/performance mobile profile if capable device available.

Use 3 warm-up traversals and >=3 scored traversals at consistent scene phases; report medians and spread. A 10 ms synthetic delta without identical scene and warmed assets does not prove improvement. Dramatic visual improvement may justify measured extra cost, but any regression must be explicitly recorded and authorized before release.

**Qualification guide (targets, not fabricated measurements):** no new persistent offscreen 3D RAF loops, no extra competing scroll controllers, no catastrophic >25% median p95 frame-time regression on matched target hardware without an explicit creative tradeoff decision, no worsening of baseline route functionality, no unhandled exceptions, no large layout jumps or truncated essential content. Noncompliance = PERFORMANCE_HOLD or FUNCTION_HOLD rather than hidden.

## Playwright/R3 tests to implement

Create \`scripts/qa_codex_r3.mjs\`, using the existing Playwright dependency and the built noindex server. It should:
1. Loop canonical route table and assert responses, static H1, main, logo link, native navigation.
2. At 320 and 390 check \`document.documentElement.scrollWidth <= window.innerWidth + 1\`, plus actual full screenshot PNG width, as previous projects have had false positives.
3. Test \`#capabilities-exhibition\` mode state, semantic title, actual art stage, keyboard choice and scroll/manual priority.
4. Test Home Process five tabs, Process anchors and reverse scroll.
5. Select Food & Beverage, Retail and third industry; observe stage progression and \`#cfg-industry\` preserved.
6. For activation, verify all 8 engines + exact mandatory node control behavior; camera/scene state must be inspectable by diagnostic hooks or visible DOM state without assuming Canvas == render success.
7. Simulate offline states including denied external action during outage and recovered state sequencing.
8. Enable reduced motion before navigation; verify no hidden essential text, accessible controls, no pinned scroll trap.
9. Verify offscreen pause and \`pagehide\` cleanup: GSAP trigger count, R3F mounts/contexts, event listener cleanup as practical.
10. Capture named viewport/scene images with assets eagerly decoded and animations explicitly settled; do not screenshot midway through a text reveal and falsely call it invisible.
11. Run axe for important composite states, not only page initial viewport.
12. Compare synthesized metrics to frozen R2 on same host and log limitations.

Synthetic WebGL tests run in software mode and must not claim a physical GPU rendered. A deliberate optical fallback on headless is acceptable, provided real GPU testing is separately pending.

## Quality/art direction scoring

Score each of ten shots against **five** criteria (0–5 per criterion; maximum 25):
- hierarchy and readability;
- scene identity and material quality;
- semantic motion/story progression;
- input clarity and accessibility;
- mobile composition and responsive fidelity.

A P0 shot must not be marked creatively accepted merely for scoring 15/25. Target >=20/25 with no dimension <3, reviewed against actual captures. These scores are **rubric targets**, not evidence or current achieved scores. Include critique commentary about weak art—even when code passes.

## Source registry requirements

Each newly integrated asset must include:
\`asset_id,asset_path_or_package,source_url,upstream_version_sha,creator,license,commercial_use_verified,attribution_requirement,where_used,file_size_bytes,disposal_or_fallback,review_status\`.

- Source from the user's own CGI/asset library only if it is **actually** in Codex's connected workspace; do not invent access to the Windows creative-lab.
- Never download random CGI art and assert redistribution permission.
- Pin npm dependencies, preserve license notices and verify Commons Clause / PolyForm terms with exact upstream copies if relevant.
- Use actual imports and runtime checks to substantiate library claims.

## Corrections and independent review

\`CORRECTIONS.md\` columns:
\`ID | Shot/Area | Observation | Root cause | Repair | Commit SHA | Evidence | Test | Disposition\`.

Dispositions: \`OPEN\`, \`FIX_REQUIRED\`, \`QA_BLOCKED\`, \`PASS\`, \`PERFORMANCE_HOLD\`, \`LICENSE_HOLD\`, \`REVIEW_BLOCKED\`.

Only a different reviewer with real source access can issue **independent** approval. Separate threads within the same agent are *self-review*, not independent audit. A request for independent review can be posted to the Draft PR; do not claim it has happened until an authenticated review appears.

## No-go conditions

- P0 shot still uses the old image as the primary scene while claiming full replacement.
- Interactive text/CTA unreadable in real browser capture.
- All five stages look like the same animation with a different label.
- Default phone view has horizontal overflow or essential controls require hover.
- Default site shows blank sections when JS/GPU disabled.
- Existing Salryn configuration attributes or mandatory engines become inaccurate.
- Conflated simulation with a real business system or unsupported offline guarantee.
- Third-party material license is unresolved.
- Nox or another reviewer has not actually reviewed, while report says "approved".
- User/owner did not approve deploy but a branch or action deploys anyway.

**Result format:** per-shot PASS/FIX_REQUIRED/BLOCKED + current SHA + review PR + physical-vs-software render + evidence link(s) + no-release declaration.
