# QWEN CODER — ENVIRONMENT AND FIRST MESSAGE

**GitHub organization:** Kirch-Nairu
**Repository:** kirjane-site
**Environment name:** Kirjane Creative Forge R3
**Environment variable fields:** leave empty; no API keys required.
**Expected code:** Node.js 22+, Python 3.12+, npm and Chromium/Playwright support.
**Working branch:** experiment/qwen-cinematic-overhaul-r3

Paste in the environment's **Setup script** box (does not modify any production branch):

\`\`\`bash
set -eu
git fetch origin experiment/qwen-cinematic-overhaul-r3
git switch experiment/qwen-cinematic-overhaul-r3 || git switch -c experiment/qwen-cinematic-overhaul-r3 --track origin/experiment/qwen-cinematic-overhaul-r3
node -e 'if (+process.versions.node.split(".")[0] < 22) process.exit(1)'
npm ci --ignore-scripts --no-audit --no-fund
(cd creative && npm ci --ignore-scripts --no-audit --no-fund)
\`\`\`

If the environment has Node <22, change to a Node 22+ image rather than bypassing the check. If repository setup cannot check out the branch due to platform restrictions, create the environment without the branch-switch commands and make the first agent action inspect/switch branch safely. Never force-reset a dirty worktree.

**First message to Qwen (no files need to be attached):**

> KIRION CREATIVE FORGE — EXECUTE QWEN R3. In \`Kirch-Nairu/kirjane-site\` work only on \`experiment/qwen-cinematic-overhaul-r3\`. Start by reading root \`AGENTS.md\`, \`docs/qwen-r3/START_HERE.md\`, \`docs/qwen-r3/SHOT_MAP.md\`, \`docs/qwen-r3/MOTION_ARCHITECTURE.md\`, \`docs/qwen-r3/QA_EVIDENCE.md\`, and \`docs/QWEN_CINEMATIC_R3_BRIEF.md\`. The ten original screenshots are not attachments here: use the committed owner-shot map and BASELINE_VISUAL_AUDIT.md. Retrieve the **already completed** baseline screenshots from GitHub Actions run 44894320712 (artifact qwen-r3-baseline-captures), then reproduce or regenerate with \`scripts/qwen_r3_capture.mjs\`. No screenshot file uploads are required. Then implement all milestones M00–M09. Prioritize the five P0 rebuilds before polishing the five P1 cinematic sequences. After each bounded commit run real browser QA, inspect the actual visual output, correct defects, and update \`EXECUTION_LOG.md\`, \`CORRECTIONS.md\`, \`ASSET_LICENSES.csv\` and evidence index. Deliver a separate Draft PR against \`experiment/creative-forge-immersive-r2\`, matched desktop/mobile screenshots, motion footage, honest performance and licensing report, and exact SHA. Do not ask broad design questions: owner has authorized aggressive experimentation. No merge, no deployment, no changes to PR #11. Begin by verifying branch and reading sources; then execute—not just plan.

## Important architecture guidance

The website consists of **seven static HTML routes**, with Vite-bundled React islands. Avoid a full SPA rewrite. Existing GSAP/ScrollTrigger, Lenis, React Bits and R3F components are real; improve and reuse them where effective. Preserve actual company names, logo geometry, functional inquiry path, accessibility, accurate Salryn terminology, offline limits and source rights.

The agent can build and locally render from the repository; it should not ask for drag/drop uploads. Original attached screenshots from ChatGPT are not automatically accessible to Qwen, and it must be honest about this. If the browser cannot render, deliver verified source and an explicit visual-QA blocker rather than inventing proof.

The owner expects an implemented flagship cinematic site, not an animation-library demonstration. Achieve a coherent visual story.
