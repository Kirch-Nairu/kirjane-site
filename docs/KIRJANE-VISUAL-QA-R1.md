# KIRJANE VISUAL QA R1 — ACCEPTANCE PLAN, NOT TEST RESULTS

## Required visual matrix
Routes: `/`, `/services`, `/projects`, `/about`, `/process`, `/contact`.
Viewports: 1440×900, 768×900, 390×844 and 360×800.
Evidence: at least one whole-page screenshot per route/viewport (24 captures), plus separate first-viewport hero, open nav, expanded/selected team and 5-stage process samples. Record actual browser/OS and commit SHA.
Motion: real short recordings of hero load, team selection forward/backward, process scroll forward/reverse and a reduced-motion run. Do not pass based on static captures alone.

## Functional matrix
- All route loads + local links + deliberate nav hierarchy
- Desktop and mobile nav; keyboard and Escape; focus visibility
- Interactive team selectors; coherent portrait/bio update
- Scroll process reversible and leaves screen naturally
- Real form submission behavior verified; no success toast without an actual delivery result
- Responsive no document horizontal overflow; no clipped text/actions
- Images load, alt text meaningful, true official logos used
- Reduced motion, focus handling, legible contrast
- Browser console/network errors; full `npm run check`
- Test data/content truth: no invented quotes, guarantees or unverified production claims

## Visual critique
At every viewport ask: Is the company offering evident in the first few seconds? Is a meaningful action visible? Does the design feel premium without decoration masquerading as capability? Is the text clear for a non-engineer? Is brand identity distinctive? Do key content and gestures work? Are adjacent sections deliberately different rather than repeated cards?

## Report table (fill with actual evidence)
| Gate | Candidate SHA | Route / viewport | Result | Screenshot/video URL | Notes / defect |
| --- | --- | --- | --- | --- | --- |
| Hero first viewport | PENDING | / @ 1440,768,390,360 | NOT RUN | — | — |
| All-route screenshot matrix | PENDING | six routes × 4 sizes | NOT RUN | — | — |
| Motion recording and reverse scroll | PENDING | home / process / about | NOT RUN | — | — |
| Keyboard/touch + reduced-motion | PENDING | key interactions | NOT RUN | — | — |
| Build + Playwright checks | PENDING | all routes | NOT RUN | — | — |
| Owner visual acceptance | PENDING | final candidate | PENDING | — | — |

Screenshot existence without visual inspection is not acceptance. If no browser is available, report blocker rather than making up PASS.
