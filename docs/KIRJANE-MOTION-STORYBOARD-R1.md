# KIRJANE MOTION STORYBOARD R1 — INTENT / REQUIRES BROWSER REVIEW

## Motion objective
Premium and deliberate. The interface should respond with confidence without making reading or navigation harder. Select animation types because they explain a transition, a progress state or a brand relationship, **not** because GSAP is available.

## M01 Hero reveal
- Enter: heading typography reveals in deliberate sequence; logo layer gains measured depth; supporting content and CTA appear promptly and remain accessible.
- Duration/easing: tune from recorded browser examples, not arbitrary motion copied from templates.
- Failure modes: excessive delay before content, unreadable letter masks, replay glitches, lost focus, layout shift, mobile overlap.
- Reduced-motion: full message visible immediately with no forced reveal.

## M02 Brand depth
- Official Kirjane chameleon asset may be masked/revealed or subtly parallaxed behind content in selected sections. Brand remains recognizable.
- Avoid constant drifting objects, continuous rotation, CPU-heavy filter effects and fake system telemetry.

## M03 Team showcase
- Desktop: portrait/placeholder stage occupies left section; right stage contains actual role/name/short verified profile. Next/previous or selected member changes both sides as one coordinated state.
- Touch: intentional mobile layout with controls visible and no horizontal document overflow.
- Keyboard: buttons operable by keyboard, focus retained, accessible names, member data updates announced appropriately.
- Reduced-motion: content swaps without transform choreography.

## M04 Five-stage process
- Use a timeline and progress concept that actually represents five steps. If using ScrollTrigger pin/scrub, make it short and reversible with clear exits.
- Verify slow scroll, fast scroll, reverse scroll, wheel/touch, resize and direct selection; never trap user in stacked sticky stages or hide subsequent content.
- Mobile: simpler vertical or directly selected stages if pinning would degrade usability.
- Reduce motion: static ordered process narrative.

## M05 Page/section polish
- Restrained hover, focus and meaningful state transitions only. No every-card fade-up or automatic scroll hijacking.
- All motion components must dispose React lifecycles and refresh triggers when layout changes. Document effects, durations and cleanup in finished storyboard.

## QA evidence
Record screenshots of initial/final frames plus browser videos showing real hero loading, team forward/back, process forward/reverse and reduced-motion. Record test viewport + candidate SHA. **No motion is implemented or verified by this document.**
