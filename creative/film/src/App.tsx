import React, { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ACTS, FILM_SOURCE_SHA } from "./scenes/manifest.js";
import { clamp01, fictionalLedger } from "./director/math.mjs";
import { revealAt } from "./director/camera.mjs";
import { directorAt, normalizeDomTarget, pointOnScreen } from "./director/precision.mjs";
import { shouldSoundClick } from "./director/feedback.mjs";
import { playCinematicClick } from "./audio/click";

const money = (cents: number) => "₱" + (cents / 100).toLocaleString("en-PH", {minimumFractionDigits: 2, maximumFractionDigits: 2});
const caseData = fictionalLedger();
const receiptId = "NGM-FICTIONAL-0001";
const nav = [
  ["Cashier", "POS Checkout", "Sales & Receipts"],
  ["Manager", "Dashboard", "Reports", "Product Catalog", "Stock Movements"],
  ["Admin", "Users", "Audit", "Store Settings", "Backup & Restore"],
];

type ScreenProps = { screen: string; local?: number; actId?: string };
type FilmPointer = { x:number; y:number; pulse:number; visible:boolean; targetId:string|null; kind:string; press:number; ripple:number; ringOpacity:number; glint:number };
type WindowProps = ScreenProps;

function Pill({ children, kind = "normal" }: { children: string; kind?: "normal" | "good" | "warn" }) {
  return <span className={"ui-pill ui-pill-" + kind}>{children}</span>;
}

function Tile({ name, value, note, target }: { name: string; value: string; note: string; target?:string }) {
  return <div data-cinema-target={target} className="ui-tile"><span>{name}</span><strong>{value}</strong><small>{note}</small></div>;
}

function Tr({ cols, strong = false, target }: { cols: string[]; strong?: boolean; target?:string }) {
  return <div data-cinema-target={target} className={"ui-table-row" + (strong ? " ui-table-strong" : "")}>{cols.map((x, i) => <span key={i}>{x}</span>)}</div>;
}

function WorkspaceScreen({ screen, local = 1, actId = "" }: ScreenProps) {
  const beforeStoreDay = ["q-pos","q-stock","q-finance","q-audit","promise","overview"].includes(actId);
  if (screen === "dashboard") {
    return <><div className="ui-heading"><div><small>Manager / Store Overview</small><h2>Dashboard</h2></div><Pill kind="good">Ready · Local host</Pill></div>
      <div className="ui-tiles"><Tile name="Today's Sales" value={money(beforeStoreDay ? 0 : caseData.saleCents)} note={beforeStoreDay ? "Awaiting the first shift" : "1 completed sale"} target="dashboard-sales" /><Tile name="Transactions" value={beforeStoreDay ? "00" : "01"} note="Store day" /><Tile name="Active Products" value="128" note="Fictional catalog" /><Tile name="Low Stock" value="03" note="Attention required" /></div>
      <div className="ui-grid-two"><div className="ui-card"><h3>Store operations</h3><div className="ui-action">Open Sales & Receipts</div><div className="ui-action muted">Open Stock Movements</div><div className="ui-action muted">View Reports</div></div><div className="ui-card"><h3>Product activity</h3><div className="ui-fauxbar"><i style={{width:"76%"}} /></div><div className="ui-fauxbar"><i style={{width:"53%"}} /></div><div className="ui-fauxbar"><i style={{width:"89%"}} /></div><p>Stock movements and sales activity in one operator workspace.</p></div></div></>;
  }
  if (screen === "shift" || screen === "shift-open") {
    const open = screen === "shift-open";
    return <><div className="ui-heading"><div><small>Cashier / 01</small><h2>POS Checkout</h2></div><Pill kind={open ? "good" : "warn"}>{open ? "Shift open" : "Shift required"}</Pill></div>
      <div className={"ui-banner " + (open ? "ui-banner-green" : "ui-banner-amber")}><strong>{open ? "Cashier shift is open" : "Cashier workstation locked"}</strong><span>{open ? "Checkout is ready for sales." : "Open a shift before adding products."}</span></div>
      <div className="ui-card ui-shift-panel"><div><label>Opening Cash</label><div data-cinema-target="shift-cash" className="ui-input">{open ? money(caseData.openingCents) : revealAt("500.00", clamp01((local - 0.38) / 0.26)) || "0.00"}</div><small>Cashier: Alex Cruz · Fictional data</small></div><span data-cinema-target="shift-open" className="ui-action">{open ? "Shift Opened ✓" : "Open Shift"}</span></div>
      <div className="ui-card ui-empty">Product scan and cart become available after opening a shift.</div></>;
  }
  if (screen.startsWith("checkout-")) {
    const searched = screen !== "checkout-search";
    const enteringBarcode = screen === "checkout-search" && actId === "scan";
    const barcodeText = enteringBarcode ? revealAt("NGM-1024", clamp01((local - 0.48) / 0.30)) : "";
    const tenderText = screen === "checkout-tender"
      ? revealAt("200.00", clamp01((local - 0.48) / 0.30))
      : money(caseData.tenderCents);
    const tender = ["checkout-tender", "checkout-review", "checkout-done"].includes(screen);
    const reviewing = screen === "checkout-review";
    const done = screen === "checkout-done";
    return <><div className="ui-heading"><div><small>Cashier / Point of Sale</small><h2>POS Checkout</h2></div><Pill kind={beforeStoreDay ? "warn" : "good"}>{beforeStoreDay ? "Shift required" : "Shift open"}</Pill></div>
      <div className="ui-pos-grid"><div className="ui-card"><h3>Scan / search</h3><div data-cinema-target="checkout-barcode" className={"ui-input " + (searched ? "ui-input-active" : "")}>{searched ? "NGM-1024  ·  Notebook A5" : barcodeText || "Scan barcode or search product name..."}</div>
        <div className="ui-subtitle">Available product</div><div className="ui-product"><span className="ui-product-art">A5</span><div><strong>Notebook A5</strong><small>NGM-1024 · Stationery · 30 in stock</small></div><span>{money(8500)}</span></div>
        <div className="ui-subtitle">Cart</div>{searched ? <Tr cols={["Notebook A5", "2 × ₱85.00", "₱170.00"]} target="checkout-cart" strong /> : <div className="ui-empty">Scan or search to begin a sale</div>}
        <div className="ui-quiet">Keyboard-wedge scanner supported in real Salryn.</div></div>
      <div className="ui-card"><h3>Sale summary</h3><div className="ui-summary-row"><span>Items</span><strong>{searched ? "2" : "0"}</strong></div><div className="ui-summary-row"><span>Subtotal</span><strong>{money(searched ? caseData.saleCents : 0)}</strong></div>
      <div className="ui-total"><span>Amount due</span><strong>{money(searched ? caseData.saleCents : 0)}</strong></div>
      <label className="ui-subtitle">Cash received</label><div data-cinema-target="checkout-cash" className={"ui-input " + (tender ? "ui-input-active" : "")}>{tender ? tenderText || "0.00" : "0.00"}</div>
      <div className="ui-summary-row"><span>Change</span><strong>{money(tender && (screen !== "checkout-tender" || local >= 0.86) ? caseData.changeCents : 0)}</strong></div>
      <span data-cinema-target="checkout-confirm" className={"ui-action " + (done ? "ui-action-good" : "")}>{done ? "Sale Completed ✓" : reviewing ? "Confirm Checkout" : "Review Checkout"}</span>
      {done ? <div className="ui-receipt-note">Receipt saved · {receiptId}</div> : null}</div></div></>;
  }
  if (screen === "receipt") {
    return <><div className="ui-heading"><div><small>Cashier / Sales & Receipts</small><h2>Receipt Preview</h2></div><Pill kind="good">Saved snapshot</Pill></div>
      <div className="ui-receipt-paper"><h3>NORTHLINE GENERAL MERCHANDISE</h3><small>Demonstration records — NOT an official tax document</small><div className="ui-dashline" />
        <p>Receipt: {receiptId}</p><p>Cashier: Alex Cruz</p><p>Notebook A5 · 2 × ₱85.00</p><div className="ui-dashline" />
        <strong data-cinema-target="receipt-total">SALE TOTAL {money(caseData.saleCents)}</strong><p>Cash {money(caseData.tenderCents)}</p><p>Change {money(caseData.changeCents)}</p><div className="ui-dashline" /><p>Thank you for your purchase</p></div></>;
  }
  if (screen === "history") {
    return <><div className="ui-heading"><div><small>Cashier / Search</small><h2>Sales & Receipts</h2></div><Pill>Read-only history</Pill></div>
      <div className="ui-card"><h3>Sales search</h3><div className="ui-input">{receiptId}</div><div className="ui-table"><Tr cols={["Receipt", "Cashier", "Amount", "Status"]} strong /><Tr cols={[receiptId, "Alex Cruz", money(caseData.saleCents), "Completed"]} target="history-row" /></div><div className="ui-action muted">Sale & Receipt Details</div></div></>;
  }
  if (["inventory", "stockin", "adjust"].includes(screen)) {
    const received = screen === "stockin", adjusted = screen === "adjust";
    const qty = beforeStoreDay ? caseData.stockBefore : adjusted ? caseData.stockFinal : received ? caseData.stockAfterReceive : caseData.stockAfterSale;
    const label = beforeStoreDay ? "Before the first sale" : adjusted ? "Adjustment (-1)" : received ? "Stock In (+5)" : "Sale (-2)";
    return <><div className="ui-heading"><div><small>Manager / Inventory</small><h2>Stock Movements</h2></div><Pill kind={adjusted ? "warn" : "good"}>{String(qty) + " on hand"}</Pill></div>
      <div className="ui-grid-two"><div className="ui-card"><h3>Stock attention</h3><div className="ui-product"><span className="ui-product-art">A5</span><div><strong>Notebook A5</strong><small>NGM-1024 · Stock tracked</small></div><strong>{qty}</strong></div><div className="ui-summary-row"><span>Original stock</span><b>30</b></div><div className="ui-summary-row"><span>Sale reduction</span><b>{beforeStoreDay ? "—" : "−2"}</b></div><div className="ui-summary-row"><span>Replenishment</span><b>{received || adjusted ? "+5" : "—"}</b></div><div className="ui-summary-row"><span>Damaged unit</span><b>{adjusted ? "−1" : "—"}</b></div></div>
      <div className="ui-card"><h3>Movement ledger</h3><div className="ui-table"><Tr cols={["Product", "Movement", "Qty"]} strong />{beforeStoreDay ? <Tr cols={["Notebook A5", "Opening balance", "30"]} target="inventory-movement" /> : <Tr cols={["Notebook A5", "Sale · " + receiptId, "−2"]} target="inventory-movement" />}{received || adjusted ? <Tr cols={["Notebook A5", "Stock In", "+5"]} /> : null}{adjusted ? <Tr cols={["Notebook A5", "Adjustment", "−1"]} /> : null}</div><div className="ui-banner ui-banner-blue"><strong>{label}</strong><span>{adjusted ? "Reason: Damaged stock" : "Inventory changes remain traceable."}</span></div></div></div></>;
  }
  if (screen === "reports") {
    return <><div className="ui-heading"><div><small>Manager / Store performance</small><h2>Reports</h2></div><Pill>Internal sales overview</Pill></div>
      <div className="ui-tiles"><Tile name="Cash Sales" value={money(beforeStoreDay ? 0 : caseData.saleCents)} note={beforeStoreDay ? "Not started" : "1 completed transaction"} /><Tile name="Opening Cash" value={money(beforeStoreDay ? 0 : caseData.openingCents)} note="Shift opening" /><Tile name="Expected Cash" value={money(beforeStoreDay ? 0 : caseData.expectedCashCents)} note="Opening + cash sales" target="reports-expected" /><Tile name="Variance" value={money(caseData.varianceCents)} note="Counted equals expected" /></div>
      <div className="ui-grid-two"><div className="ui-card"><h3>Top products</h3>{beforeStoreDay ? <div className="ui-empty">Sales will appear after the first completed checkout.</div> : <Tr cols={["Notebook A5", "2 sold", "₱170.00"]} />}<p>Internal operational reporting—not full accounting.</p></div><div className="ui-card"><h3>Shift close</h3><div className="ui-summary-row"><span>Expected cash</span><strong>{money(beforeStoreDay ? 0 : caseData.expectedCashCents)}</strong></div><div className="ui-summary-row"><span>Counted cash</span><strong>{money(beforeStoreDay ? 0 : caseData.countedCashCents)}</strong></div><Pill kind="good">₱0.00 variance</Pill></div></div></>;
  }
  if (screen === "audit") {
    return <><div className="ui-heading"><div><small>Admin / Activity tracking</small><h2>Audit</h2></div><Pill>Read only</Pill></div>
      <div className="ui-card"><h3>Audit log · fictional records</h3>{beforeStoreDay ? <div className="ui-empty" data-cinema-target="audit-sale">Important operator actions will appear here after the store day begins.</div> : <div className="ui-table"><Tr cols={["Activity", "Operator", "Detail", "Result"]} strong /><Tr cols={["SHIFT_OPENED", "Alex Cruz", "Opening ₱500.00", "Recorded"]} /><Tr cols={["SALE_COMPLETED", "Alex Cruz", receiptId, "Recorded"]} target="audit-sale" /><Tr cols={["STOCK_IN", "Manager", "Notebook A5 +5", "Recorded"]} /><Tr cols={["STOCK_ADJUSTED", "Manager", "Damaged stock −1", "Recorded"]} /></div>}<p>Actual user permissions and audit integrity are enforced by the native backend, not this film.</p></div></>;
  }
  if (screen === "backup") {
    return <><div className="ui-heading"><div><small>Admin / Recovery</small><h2>Backup & Restore</h2></div><Pill kind="good">Local-first</Pill></div>
      <div className="ui-grid-two"><div className="ui-card"><h3>Backup</h3><p>Local operator backup and restore workflows are controlled by the Salryn host.</p><div className="ui-action muted">Create Backup</div></div><div className="ui-card"><h3>Restore boundaries</h3><p>Restore access and data protection remain native responsibilities.</p><div className="ui-banner ui-banner-blue">Offline-ready operations</div></div></div></>;
  }
  return <div className="ui-empty">Visual scene not available</div>;
}

const SalrynWindow = memo(function SalrynWindow({ screen, local = 1, actId = "" }: WindowProps) {
  const selected = screen === "inventory" || screen === "stockin" || screen === "adjust" ? "Stock Movements"
    : screen === "reports" ? "Reports" : screen === "audit" ? "Audit" : screen === "history" || screen === "receipt" ? "Sales & Receipts"
    : screen === "backup" ? "Backup & Restore" : screen === "dashboard" ? "Dashboard" : "POS Checkout";
  return <div className="salryn-window">
    <div className="ui-header"><div className="ui-brand"><span className="ui-brandmark">S</span><div><strong>Northline General Merchandise</strong><small><span className="ui-status-dot" /> Salryn POS · Local host</small></div></div><div className="ui-account">AC <span>Alex Cruz · Cashier</span></div></div>
    <div className="ui-body"><aside className="ui-sidebar">{nav.map((group) => <div key={group[0]} className="ui-nav-group"><small>{group[0]}</small>{group.slice(1).map((label) => <div data-cinema-target={label==="POS Checkout" ? "nav-pos" : label==="Stock Movements" ? "nav-stock" : label==="Reports" ? "nav-reports" : label==="Audit" ? "nav-audit" : undefined} className={"ui-nav-item" + (label === selected ? " active" : "")} key={label}><span className="ui-nav-icon">▣</span>{label}</div>)}</div>)}</aside>
      <main className="ui-workspace"><WorkspaceScreen screen={screen} local={local} actId={actId} /></main></div>
  </div>;
});

function SyntheticCursor({ pointer, camera }: { pointer: FilmPointer; camera: { left:number; top:number; scale:number } }) {
  if (!pointer.visible) return null;
  const projected = pointOnScreen([pointer.x, pointer.y], camera);
  return <div data-cinema-pointer={pointer.targetId ?? ""} data-cinema-action={pointer.kind}
    className="film-fake-cursor" style={{left:projected.x+"px",top:projected.y+"px"}} aria-hidden="true">
    <span className="cinema-click-halo" style={{opacity:pointer.pulse,transform:"translate(-50%, -50%) scale(" + (0.85 + pointer.pulse * 0.4) + ")"}} />
    <span className="cinema-click-ring" data-cinema-ripple={pointer.ripple.toFixed(3)} style={{
      opacity:pointer.ringOpacity,
      transform:"translate(-50%, -50%) scale(" + (0.28 + pointer.ripple * 1.48) + ")"
    }} />
    <span className="cinema-click-impact" style={{opacity:pointer.glint,transform:"translate(-50%, -50%) scale(" + (0.8 + pointer.ripple * 1.1) + ")"}} />
    <svg data-cinema-press={pointer.press.toFixed(3)} className="cinema-cursor-arrow" width="26" height="31" viewBox="0 0 26 31"
      style={{transform:"scale(" + (1 - pointer.press * .17) + ") translate(" + (pointer.press * 1.2) + "px," + (pointer.press * 1.2) + "px)"}}>
      <path d="M3 2 L3 25 L9.3 19 L13.5 29 L19 26.2 L14.8 17.2 L23 16 Z" fill="#ffffff" stroke="#101828" strokeWidth="1.9" strokeLinejoin="round"/>
    </svg>
  </div>;
}

export default function App() {
  const ref = useRef<HTMLElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastAudioFrameRef = useRef<{shotId:string; local:number; kind:string; visible:boolean; targetId:string|null} | null>(null);
  const soundedShotIdsRef = useRef<Set<string>>(new Set());
  const [soundOn, setSoundOn] = useState(false);
  const [soundUnsupported, setSoundUnsupported] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewport, setViewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    let handle = 0;
    const update = () => {
      handle = 0;
      const bounds = ref.current?.getBoundingClientRect();
      if (!bounds) return;
      const nextProgress = clamp01(-bounds.top / Math.max(1, bounds.height - window.innerHeight));
      setProgress((previous) => Math.abs(previous - nextProgress) > 0.00003 ? nextProgress : previous);
      setViewport((previous) => previous.w === window.innerWidth && previous.h === window.innerHeight
        ? previous : { w: window.innerWidth, h: window.innerHeight });
    };
    const schedule = () => { if (!handle) handle = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      if (handle) cancelAnimationFrame(handle);
    };
  }, []);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [measured, setMeasured] = useState<Record<string, Record<string, { x:number; y:number; rect:{x:number;y:number;w:number;h:number} }>>>({});
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  const state = directorAt(progress, viewport, ACTS, measured, reduced);
  const { beat: current, shot, next: nextShot, pointer, camera } = state;
  // Do not synthesize browser audio until this button was explicitly pressed.
  // Playback is a side effect of a small *forward* crossing of a real click.
  const enableOrMuteSound = () => {
    lastAudioFrameRef.current = {shotId:shot.id,local:current.local,kind:pointer.kind,
      visible:pointer.visible,targetId:pointer.targetId};
    if (soundOn) {
      setSoundOn(false);
      void audioContextRef.current?.suspend().catch(() => {});
      return;
    }
    const ctor = window.AudioContext ||
      (window as Window & {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!ctor) { setSoundUnsupported(true); return; }
    try {
      const context = audioContextRef.current ?? new ctor();
      audioContextRef.current = context;
      // resume() runs synchronously inside a genuine user activation.
      void context.resume().then(() => {
        setSoundUnsupported(false);
        setSoundOn(true);
      }).catch(() => { setSoundOn(false); setSoundUnsupported(true); });
    } catch {
      setSoundOn(false);
      setSoundUnsupported(true);
    }
  };
  useEffect(() => {
    const frame = {shotId:shot.id,local:current.local,kind:pointer.kind,
      visible:pointer.visible,targetId:pointer.targetId};
    const previous = lastAudioFrameRef.current;
    lastAudioFrameRef.current = frame;
    if (shouldSoundClick(previous, frame, {
      enabled:soundOn, reduced, pageVisible:!document.hidden,
      heard:soundedShotIdsRef.current.has(shot.id)
    }) && audioContextRef.current?.state === "running") {
      soundedShotIdsRef.current.add(shot.id);
      try { playCinematicClick(audioContextRef.current); } catch { /* cosmetic cue only */ }
    }
  }, [soundOn,reduced,shot.id,current.local,pointer.kind,pointer.visible,pointer.targetId]);
  useEffect(() => {
    const hidden = () => { if (document.hidden) lastAudioFrameRef.current=null; };
    document.addEventListener("visibilitychange", hidden);
    return () => document.removeEventListener("visibilitychange", hidden);
  }, []);
  useEffect(() => () => { void audioContextRef.current?.close().catch(() => {}); }, []);
  // Heavy operator UI changes only on semantic shots and genuine typed states.
  // The separately rendered cursor can update every frame without rebuilding
  // the entire source-inspired interface tree.
  const screenLocal = ["shift-gate","scan","tender"].includes(shot.id) ? current.local : 1;
  const textAppearance = state.caption;
  const chaptersProgress = current.index + current.local;
  const chapters = [...new Set(ACTS.map((x) => x.step))];
  // Measure actual SOURCE-INSPIRED DOM nodes, after React renders the scene.
  // A stale or missing DOM target MUST hide the pointer instead of guessing.
  useLayoutEffect(() => {
    const scene = ref.current?.querySelector<HTMLElement>(".cinema-ui-layer[data-cinema-current]");
    const windowNode = scene?.querySelector<HTMLElement>(".salryn-window");
    if (!windowNode) return;
    const rootRect = windowNode.getBoundingClientRect();
    const entries: Record<string, { x:number; y:number; rect:{x:number;y:number;w:number;h:number} }> = {};
    windowNode.querySelectorAll<HTMLElement>("[data-cinema-target]").forEach(node => {
      const key = node.dataset.cinemaTarget;
      if (!key) return;
      const v = normalizeDomTarget(rootRect, node.getBoundingClientRect());
      if (v) entries[key] = v;
    });
    setMeasured(previous => {
      const existing = previous[shot.screen] ?? {};
      if (JSON.stringify(existing) === JSON.stringify(entries)) return previous;
      return { ...previous, [shot.screen]: entries };
    });
  }, [shot.id, shot.screen]);
  return <div className="experience">
    {reduced ? <section id="cinema" className="cinema-reduced" aria-labelledby="reduced-film-title">
      <div className="cinema-reduced-inner"><span className="cinema-chapter">SALRYN / REDUCED MOTION EXPERIENCE</span>
        <h2 id="reduced-film-title">From the first shift to the final report.</h2>
        <p>See the complete store-day sequence as a readable documentary instead of a moving 23-shot screen film.</p>
        <a href="./salryn/#scene-a-kernel">Explore the kernel and architecture ↓</a>
        <a href="./contact/?topic=salryn">Skip to demo inquiry ↗</a>
      </div>
    </section> : <section id="cinema" className="film-scroll cinema-r3" ref={ref} style={{height:String(ACTS.length * 72) + "svh"}}>
      <div className={"film-sticky cinema-sticky" + (shot.screen === "none" ? " cinema-sticky-opening" : "")}>
        <div className="cinema-immersive-art" aria-hidden="true">
          {shot.screen === "none" ?
            <>
              <div className="cinema-opening-identity" style={{opacity:1-state.blend}}>
                <div className="cinema-opening-orbits"><span /><span /><span /><span /></div>
                <div className="cinema-opening-kernel">S</div>
                <small>ONE WORKSPACE. CONNECTED OPERATIONS.</small>
              </div>
              {nextShot && state.blend > 0 ? <div className="cinema-camera" style={{
                opacity:state.blend,
                transform:"translate3d(" + camera.left + "px," + camera.top + "px,0) scale(" + camera.scale + ")"
              }}>
                <div className="cinema-ui-layer">
                  <SalrynWindow screen={nextShot.screen} local={0} actId={nextShot.id} />
                </div>
              </div> : null}
            </>
          : <div className="cinema-camera" style={{
                transform:"translate3d(" + camera.left + "px," + camera.top + "px,0) scale(" + camera.scale + ")"
              }}>
              <div className="cinema-ui-layer" data-cinema-current style={{opacity:nextShot?.screen !== shot.screen ? 1-state.blend : 1}}>
                <SalrynWindow screen={shot.screen} local={screenLocal} actId={shot.id} />
              </div>
              {nextShot && nextShot.screen !== shot.screen && nextShot.screen !== "none" && state.blend > 0 ?
                <div className="cinema-ui-layer" style={{opacity:state.blend}}>
                  <SalrynWindow screen={nextShot.screen} local={0} actId={nextShot.id} />
                </div>
              : null}
            </div>}
        </div>
        <SyntheticCursor pointer={pointer} camera={camera} />
        <div className="cinema-overlay-shade" aria-hidden="true" />
        <div className="cinema-horizon" aria-hidden="true"><span /></div>
        <div className="cinema-topline">
          <span className="cinema-label">SALRYN / AN OPERATIONAL STORY</span>
          <div className="cinema-topline-actions">
            <span className="cinema-topline-right">A KIRJANE PRODUCT <span className="cinema-dot" /> DEMONSTRATION</span>
            <button type="button" className="cinema-sound-toggle" data-cinema-sound-toggle
              aria-pressed={soundOn} onClick={enableOrMuteSound} disabled={soundUnsupported}>
              <span className="cinema-sound-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor"
                  strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9v6h4l5 4V5L8 9H4Z"/>
                  {soundOn ? <><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.6 6.6a8 8 0 0 1 0 10.8"/></> :
                    <path d="m17 10 4 4m0-4-4 4"/>}
                </svg>
              </span>
              <span>{soundUnsupported ? "AUDIO UNAVAILABLE" : soundOn ? "SOUND ON" : "ENABLE SOUND"}</span>
            </button>
          </div>
        </div>
        <div className="cinema-narrative" style={{ opacity:textAppearance, transform:"translate3d(0," + (7*(1-textAppearance)) + "px,0)" }}>
          <span className="cinema-chapter"><span className="cinema-chapter-rule" />{shot.step}</span>
          <h2>{shot.title}</h2>
          <p>{shot.body}</p>
          {shot.id === "end" ? <a className="cinema-conversion" href="./contact/?topic=salryn">BOOK A DEMO <span aria-hidden="true">↗</span></a> : null}
          <span className="cinema-proof">Source-inspired visual walkthrough · Fictional records · No live transactions</span>
        </div>
        <div className="cinema-bottomline">
          <div className="cinema-scroll-hint"><span className="cinema-wheel" aria-hidden="true"><span /></span><span>SCROLL TO DIRECT THE STORY</span></div>
          <div className="cinema-scene-name"><span>{shot.screen === "none" ? "THE INTRODUCTION" : shot.screen.replace(/[-]/g," ").toUpperCase()}</span> <span> / </span> SCENE {String(current.index + 1).padStart(2, "0")}</div>
        </div>
        <div className="film-progress cinema-progress">
          <div className="film-track" aria-hidden="true"><span style={{width:String(progress * 100)+"%"}} /></div>
          <div className="film-meta"><span>{String(current.index + 1).padStart(2, "0")} / {String(ACTS.length).padStart(2, "0")} SHOTS</span><span>{String(Math.round(chaptersProgress)).padStart(2, "0")} · {String(Math.round(progress * 100)).padStart(2, "0")}%</span></div>
        </div>
      </div>
    </section>}
  </div>;
}
