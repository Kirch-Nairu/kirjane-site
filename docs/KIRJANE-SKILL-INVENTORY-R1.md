# Kirjane Antigravity skill inventory — execution requirements

## Bundled and sourced
- **frontend-design**: `.agents/skills/frontend-design/SKILL.md`. Exact skill and Apache 2.0 license copied from [Valencia R2](https://github.com/Kirch-Nairu/ValWebsite/tree/d5e121522c557f63ec683cf9aee79309795005b8/.agents/skills/frontend-design), the user's known successful Antigravity project.
- **kirjane-visual-acceptance**: original repository-local skill at `.agents/skills/kirjane-visual-acceptance/SKILL.md`. Applies visual and motion acceptance gates.

## External skills to install/read **on the workstation**
- [Official GSAP skills](https://github.com/greensock/gsap-skills): verify `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance`; read current skill documentation and install only what the app needs.
- [Vercel agent skills](https://github.com/vercel-labs/agent-skills): `web-design-guidelines`, `react-best-practices`.
- [Anthropic frontend-design source](https://github.com/anthropics/skills/tree/main/skills/frontend-design) if updating the bundled Valencia reference, subject to preserving license and local quality intent.

**Important:** Merely listing a skill here **does not mean installed**. Antigravity must show which skill folders it read and which current versions it used. Run `Get-ChildItem .agents/skills -Directory` and inspect skill contents. Third-party setup should be done by the workstation executor according to the installed tooling; do not guess paths or assert success.

Reference Valencia's process, not its designs, CSS, municipal content or technology stack.
