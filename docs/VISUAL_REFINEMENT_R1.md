# Visual Refinement R1 — Kurt-led editorial design pass

## Source and direction
Approved Kirjane Labs Website Blueprint V1.0: page 4 (bold editorial minimalism), page 7 (responsive homepage wireframe), pages 13–14 (Space Grotesk/Inter type scale and spacing).
Reference aesthetics are **inspiration only**, not copied assets or composition.

## Changed
- Tighter, more intentional homepage hero rhythm and shifted headline line.
- Clearer small-screen headline wraps and reduced excessive intro whitespace.
- Clean typographic header and mobile menu control with CSS icon; keyboard Escape support retained.
- Mobile nav remains present for accessibility references and is hidden when closed.
- Hero scroll action now links to the actual Services section.
- Homepage service entries are real links to the Services page, not decorative arrow controls.
- Improved hierarchy and spacing across Services, Projects, About, Process, Contact and footer.
- Replaced the internal development status footer line with ordinary corporate-site footer wording.
- New `app/styles/refinement.css` is a separately reviewable styling layer.

## Unchanged safety and publication boundaries
- Temporary text-based logo; do not imply it is the official vector logo.
- Green HEX palette remains working visual tokens, not approved brand specifications.
- No fabricated client names, photos, case-study results or company biographies.
- Contact form remains disabled until the official inbox, privacy notice and end-to-end handling are approved.
- Site is still a review candidate: no production release/merge.

## QA
Automated checks: TypeScript, ESLint, static build, six-route HTML output and disabled contact-form gate.
Visual checks still required: 320, 390, 768, 1024 and 1440 px; at least home and two long internal pages; keyboard and menu behavior, text overflow, focus-visible, CTA route links and reduced motion.
