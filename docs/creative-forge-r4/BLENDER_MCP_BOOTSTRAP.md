# CODEX → BLENDER 5.3 — LOCAL MCP ACCESS RUNBOOK

**MANDATORY GATE BEFORE M00, SOURCE EDITING, MODELING, RENDERING OR NEW ASSET WORK.**

This runbook is the missing operational link for `KIRJANE-R4-CONTINUITY-ASSET-REMASTER`.
Target: **Windows laptop, local Blender 5.3, installed open-source `mcp-for-blender` add-on**, with Codex CLI/desktop. This is NOT the commercial "Blender Bridge" ChatGPT integration. Those are separate connections and can use different ports.

## Verified prior setup on Kirch's laptop
PowerShell previously completed:
```powershell
uvx mcp-for-blender install-addon
# installed at:
# C:\Users\arane\AppData\Roaming\Blender Foundation\Blender\5.3\scripts\addons\blender_mcp.py

codex mcp add blender -- uvx mcp-for-blender
codex mcp list
# blender | uvx | mcp-for-blender | enabled | Auth Unsupported
```
`Auth Unsupported` on a local STDIO MCP entry does **not** indicate a missing OAuth login. "Enabled" proves registration only, NOT the presence of a live Blender socket or discovered tools.

## Owner-facing GUI startup (do once per disconnected/restarted Blender session)
1. Open **Blender 5.3** from Windows Start; leave it running.
2. Open **Edit → Preferences → Add-ons**. Search for and enable **Interface: MCP for Blender**. If installed but not visible/running, restart Blender or disable/re-enable the add-on.
3. In Blender's **3D Viewport**, press `N` to open the right sidebar.
4. Select the tab **MCP for Blender** and click **Start MCP Server** unless the socket is already running. Default socket host `localhost`, port **9876**. Confirm the panel reports running.
5. Keep Blender open. Fully quit Codex, **including its Windows system tray process**, then reopen it. Open a **new Codex conversation/session** in the actual repository.

Codex and Blender must run on the **same Windows host** for `localhost` to work. Do not assume a remote/cloud Codex worker sees the laptop's local socket.

## PowerShell transport diagnostics (safe, read-only)
```powershell
$addon = Join-Path $env:APPDATA 'Blender Foundation\Blender\5.3\scripts\addons\blender_mcp.py'
'Addon installed: ' + (Test-Path $addon)
Get-Command uvx, codex | Select-Object Name, Source
codex mcp list
Test-NetConnection -ComputerName 127.0.0.1 -Port 9876 |
  Select-Object ComputerName, RemotePort, TcpTestSucceeded
```
Expected: addon path exists; Codex and uvx commands resolve; `blender` is **enabled**; `TcpTestSucceeded=True`. This confirms local TCP reachability only; the next MCP tool call verifies actual protocol/tool behavior.

If port 9876 is not reachable: **do not start art production**. Fix Blender addon state/panel, verify its configured port, and retry. Do not connect to Blender Bridge's **9000/8765** ports; that is a different integration.
If port is reachable but tools do not appear in Codex:
- Fully restart Codex, not merely its browser/chat tab; verify **Settings → MCP servers** in Codex desktop includes enabled `blender` with STDIO command `uvx` and arguments `mcp-for-blender`.
- Run `codex mcp list` again in the same Windows account. If missing, register exactly `codex mcp add blender -- uvx mcp-for-blender` (do **not** duplicate an existing enabled entry).
- Confirm the process is launched by the MCP client. **Do not separately run plain `uvx mcp-for-blender` in a terminal as another server**.
- Check `Get-Command uvx` and PATH if Codex desktop cannot launch `uvx`. If the addon host/port differs from the default, use matching explicit configuration on *both* Blender and MCP client.
- Never expose the unauthenticated Blender socket to the public internet. Keep it local on 127.0.0.1.

## Mandatory Codex tool discovery and verification (READ ONLY)
**Do not invent tool results.** In the actual Codex conversation, enumerate the exposed `blender` MCP tools. The open-source server currently documents:
- `get_addon_status` (read add-on/runtime status)
- `get_scene_info` (read scene objects/metadata)
- `look` (read screenshot of viewport/camera/angles)
- `execute_blender_code` (runs Python in Blender; use only after read-only proof)

To confirm control, **call `get_addon_status` and `get_scene_info`**, return Blender version, scene name, active object count and some object names. Then call `look` for a viewport screenshot. This must inspect the ACTUAL open scene; do not return guesswork, mock objects or documentation-only assertions.

**Gate pass:** real Blender 5.3 instance identified; actual scene objects returned; actual screenshot attached; Codex's tool call confirms the same scene. Record `BLENDER_MCP_CONNECTED` with actual evidence. Note which host and MCP port were used. Tool names may differ across plugin versions; inspect actual discovered tool schemas instead of pretending they exist.

**Gate fail:** if Blender tools are absent, port fails, or protocol/auth/handshake fails, mark `BLENDER_MCP_BLOCKED` with exact diagnostic and stop all asset production. Do not substitute a different procedural engine, cloud asset generator, SVG or image generation without a new owner instruction.

## First permitted write — safe source-preserving smoke
After read-only verification, create a new separate Blender scene or saved copy in the R4 workspace (do NOT clear or overwrite the user's current open scene). Create one tiny test mesh in the isolated scene, save a `.blend` to the R4 workspace, inspect the viewport, then discard the test or archive it as a connectivity artifact. **This is connectivity qualification, NOT a production Kirjane asset.**

Workspace:
`C:\Users\arane\OneDrive\Documents\Kirjane\Creative-Forge-R4`

Then execute the existing-asset R4 M00/M01 assignment in `CONTINUITY_REMASTER_HANDOFF.md`; the current Services Automation green routed-lines/rings asset is the first real target. Preserve its existing visual subject, choreography and four modes.

## Checkpoint to publish to Issue #16
- Which Codex app/client was used (desktop or CLI), exact Windows user host, command registration, actual MCP tool names discovered.
- Addon status, verified local port, Blender scene identity and real `look` screenshot.
- Read-only gate: `BLENDER_MCP_CONNECTED` / `BLENDER_MCP_BLOCKED`.
- After separate-file smoke (if passed): source path, saved file and proof, with no modifications to official site/brand.
- Then START actual existing-art remaster. Never report a completed remaster before it exists.

Sources for runtime setup: https://github.com/ahujasid/mcp-for-blender and https://www.mcp-for-blender.com/docs/installation. Pin installed tool version when capturing evidence.
