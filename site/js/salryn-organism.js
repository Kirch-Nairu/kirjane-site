/**
 * Salryn Flagship Product — Authoritative Kernel, Eight Engines & Twelve Industry Families
 *
 * Strictly reflects Kirjane's authoritative Salryn product architecture:
 *   - One unified offline-first business management software kernel
 *   - Eight core engines: Commerce, Inventory, Procurement, Financial, Workforce, Operations, Security, Infrastructure
 *   - Security is ALWAYS a mandatory core foundation (never an optional add-on)
 *   - Twelve illustrative industry families: Retail, Food & Beverage, Hardware & Supply, Healthcare & Wellness,
 *     Services, Hospitality, Rental, Distribution, Automotive, Manufacturing, Agriculture, Enterprise
 *
 * Every flavor, capability preview, and guided configuration summary is transparently labeled as
 * architectural vision or illustrative application. Zero fabricated SKUs, pricing, clients, or guarantees.
 */
import gsap from '../vendor/gsap/index.js';
import { isReducedMotion, morphSvgPath } from './motion-system.js';

export const SALRYN_ENGINES_8 = [
  {
    idx: 0,
    id: 'commerce',
    name: 'Commerce',
    short: 'Commerce',
    mandatory: false,
    layerLabel: 'Customer & Transaction Surface',
    summary: 'Point of sale, customer orders, pricing schedules, returns, and day-to-day commercial transaction recording.',
    role: 'Captures frontline sales and customer activity cleanly into shared ledger primitives.',
    linkedFamilies: [0, 1, 2, 4, 5, 6, 7, 8, 11]
  },
  {
    idx: 1,
    id: 'inventory',
    name: 'Inventory',
    short: 'Inventory',
    mandatory: false,
    layerLabel: 'Stock & Movement Custody',
    summary: 'Append-only stock movement ledgers, unit conversions, multi-location balances, and traceable item custody.',
    role: 'Tracks physical goods deterministically across shelves, back rooms, and storage sites.',
    linkedFamilies: [0, 1, 2, 3, 6, 7, 8, 9, 10, 11]
  },
  {
    idx: 2,
    id: 'procurement',
    name: 'Procurement',
    short: 'Procurement',
    mandatory: false,
    layerLabel: 'Purchasing & Receiving Discipline',
    summary: 'Purchase requisitions, purchase orders, physical goods receiving, supplier records, and invoice reconciliation.',
    role: 'Separates purchasing requests from confirmed receipts and supplier settlement obligations.',
    linkedFamilies: [0, 1, 2, 5, 7, 8, 9, 10, 11]
  },
  {
    idx: 3,
    id: 'financial',
    name: 'Financial',
    short: 'Financial',
    mandatory: false,
    layerLabel: 'Minor-Unit Accounting Core',
    summary: 'Exact minor-unit monetary accounting, cash drawer custody, tender reconciliation, payables, receivables, and ledgers.',
    role: 'Preserves signed decimal conservation across shifts, refunds, settlements, and financial records.',
    linkedFamilies: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  {
    idx: 4,
    id: 'workforce',
    name: 'Workforce',
    short: 'Workforce',
    mandatory: false,
    layerLabel: 'Team Roles & Shift Accountability',
    summary: 'Staff rosters, shift openings and handovers, departmental assignments, and named operational responsibility.',
    role: 'Connects daily operational actions to accountable team members and shift windows.',
    linkedFamilies: [1, 3, 4, 5, 8, 9, 10, 11]
  },
  {
    idx: 5,
    id: 'operations',
    name: 'Operations',
    short: 'Operations',
    mandatory: false,
    layerLabel: 'Structured Workflows & Approvals',
    summary: 'Multi-step operational queues, task handoffs, exception escalation, and explicit human approval gates.',
    role: 'Replaces informal spreadsheet handoffs with repeatable, auditable operational state transitions.',
    linkedFamilies: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  {
    idx: 6,
    id: 'security',
    name: 'Security',
    short: 'Security (Core)',
    mandatory: true,
    layerLabel: 'Mandatory Core Foundation · Always Active',
    summary: 'Role-based permissions, actor authentication, approval ceilings, custody boundaries, and tamper-evident audit logs.',
    role: 'Built into the kernel itself and always enabled across every deployment; never sold or toggled as an optional extra.',
    linkedFamilies: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  },
  {
    idx: 7,
    id: 'infrastructure',
    name: 'Infrastructure',
    short: 'Infrastructure',
    mandatory: true,
    layerLabel: 'Offline-First Runtime & Document Custody',
    summary: 'Local-first storage architecture, verifiable receipts and print vouchers, local workstation runtime, and controlled backups.',
    role: 'Keeps daily operational workspaces responsive locally without forcing constant cloud dependency.',
    linkedFamilies: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  }
];

export const SALRYN_FAMILIES_12 = [
  {
    idx: 0,
    id: 'retail',
    name: 'Retail',
    category: 'Illustrative Industry Family',
    summary: 'Counter checkout, item-level inventory custody, supplier replenishment, and shift cash reconciliation.',
    engines: [0, 1, 2, 3, 6, 7],
    applications: 'Independent stores, multi-aisle specialty outlets, and growing local retail shops.'
  },
  {
    idx: 1,
    id: 'food-beverage',
    name: 'Food & Beverage',
    category: 'Illustrative Industry Family',
    summary: 'Order queues, ingredient stock usage, supplier purchasing, shift staffing, and daily tender closeout.',
    engines: [0, 1, 2, 3, 4, 6, 7],
    applications: 'Cafes, bakeries, quick-service counters, and multi-station hospitality kitchens.'
  },
  {
    idx: 2,
    id: 'hardware-supply',
    name: 'Hardware & Supply',
    category: 'Illustrative Industry Family',
    summary: 'Unit-converted stock tracking, bulk receiving, contractor invoicing, and counter-to-yard dispatch.',
    engines: [0, 1, 2, 3, 5, 6, 7],
    applications: 'Building supply yards, electrical depots, plumbing merchants, and trade counters.'
  },
  {
    idx: 3,
    id: 'healthcare-wellness',
    name: 'Healthcare & Wellness',
    category: 'Illustrative Industry Family',
    summary: 'Role-bounded client intake, clinical supply inventory, appointment operations, and accountable billing.',
    engines: [1, 3, 4, 5, 6, 7],
    applications: 'Independent clinics, optical practices, pharmacies, and wellness centers.'
  },
  {
    idx: 4,
    id: 'services',
    name: 'Services',
    category: 'Illustrative Industry Family',
    summary: 'Structured job tracking, team assignment, structured invoicing, and explicit client approval checkpoints.',
    engines: [0, 3, 4, 5, 6, 7],
    applications: 'Technical repair practices, studio agencies, consulting offices, and maintenance firms.'
  },
  {
    idx: 5,
    id: 'hospitality',
    name: 'Hospitality',
    category: 'Illustrative Industry Family',
    summary: 'Front-desk folios, housekeeping and operational queues, vendor purchasing, and shift reconciliation.',
    engines: [0, 2, 3, 4, 5, 6, 7],
    applications: 'Boutique guesthouses, lodges, venues, and regional hospitality operators.'
  },
  {
    idx: 6,
    id: 'rental',
    name: 'Rental',
    category: 'Illustrative Industry Family',
    summary: 'Asset check-out custody, return condition verification, deposit ledgers, and maintenance readiness.',
    engines: [0, 1, 3, 5, 6, 7],
    applications: 'Tool hire counters, event equipment depots, and specialized fleet lending desks.'
  },
  {
    idx: 7,
    id: 'distribution',
    name: 'Distribution',
    category: 'Illustrative Industry Family',
    summary: 'High-volume purchasing, warehouse bin transfers, wholesale order fulfillment, and receivables tracking.',
    engines: [0, 1, 2, 3, 5, 6, 7],
    applications: 'Regional wholesalers, wholesale depots, and B2B goods distributors.'
  },
  {
    idx: 8,
    id: 'automotive',
    name: 'Automotive',
    category: 'Illustrative Industry Family',
    summary: 'Service bay work orders, spare-parts inventory custody, technician assignments, and itemized billing.',
    engines: [0, 1, 2, 3, 4, 5, 6, 7],
    applications: 'Independent service workshops, parts counters, and tire or alignment centers.'
  },
  {
    idx: 9,
    id: 'manufacturing',
    name: 'Manufacturing',
    category: 'Illustrative Industry Family',
    summary: 'Raw material procurement, structured production runs, stock consumption ledgers, and quality approvals.',
    engines: [1, 2, 3, 4, 5, 6, 7],
    applications: 'Light assembly shops, custom fabrication studios, and batch production units.'
  },
  {
    idx: 10,
    id: 'agriculture',
    name: 'Agriculture',
    category: 'Illustrative Industry Family',
    summary: 'Input procurement, harvest lot custody, seasonal crew coordination, and offline-resilient rural records.',
    engines: [1, 2, 3, 4, 5, 6, 7],
    applications: 'Agri-supply cooperatives, packing sheds, and regional farm operations.'
  },
  {
    idx: 11,
    id: 'enterprise',
    name: 'Enterprise',
    category: 'Illustrative Industry Family',
    summary: 'Multi-department approval governance, consolidated ledger discipline, and cross-site architectural expansion.',
    engines: [0, 1, 2, 3, 4, 5, 6, 7],
    applications: 'Multi-branch organizations seeking unified internal controls without fragmented point tools.'
  }
];

export const SALRYN_CAPABILITIES = [
  {
    id: 'security-core',
    engineIdx: 6,
    name: 'Security & Permission Foundation',
    mandatory: true,
    note: 'Mandatory kernel foundation. Permissions, audit trails, and custody rules are always active.'
  },
  {
    id: 'infra-core',
    engineIdx: 7,
    name: 'Offline-First Infrastructure & Print',
    mandatory: true,
    note: 'Core local runtime, structured storage, and verifiable document output.'
  },
  {
    id: 'cap-commerce',
    engineIdx: 0,
    name: 'Point of Sale & Commercial Orders',
    mandatory: false,
    note: 'Frontline transactions, returns, customer receipts, and shift billing.'
  },
  {
    id: 'cap-inventory',
    engineIdx: 1,
    name: 'Inventory Custody & Movement Ledger',
    mandatory: false,
    note: 'Real-time stock balances, transfers, adjustments, and unit conversions.'
  },
  {
    id: 'cap-procurement',
    engineIdx: 2,
    name: 'Procurement & Supplier Receiving',
    mandatory: false,
    note: 'Purchase requests, orders, receiving verification, and supplier bills.'
  },
  {
    id: 'cap-financial',
    engineIdx: 3,
    name: 'Financial Ledgers & Cash Control',
    mandatory: false,
    note: 'Minor-unit accounting, drawer reconciliation, payables, and receivables.'
  },
  {
    id: 'cap-workforce',
    engineIdx: 4,
    name: 'Workforce Shifts & Accountability',
    mandatory: false,
    note: 'Staff scheduling, shift custody handovers, and operational attribution.'
  },
  {
    id: 'cap-operations',
    engineIdx: 5,
    name: 'Operational Workflows & Approvals',
    mandatory: false,
    note: 'Structured queues, multi-step sign-off gates, and task coordination.'
  }
];

export const SALRYN_GROWTH_STAGES = [
  {
    idx: 0,
    stage: 'Single-Site Core',
    elevation: 'Foundation',
    summary: 'Begin with one dependable local workstation running Commerce, Inventory, and mandatory Security & Infrastructure.',
    enginesActive: ['Commerce', 'Inventory', 'Security', 'Infrastructure']
  },
  {
    idx: 1,
    stage: 'Procurement & Stock Discipline',
    elevation: 'Operational Depth',
    summary: 'Activate Procurement and structured receiving on the exact same database as supplier volume and SKU counts grow.',
    enginesActive: ['Commerce', 'Inventory', 'Procurement', 'Security', 'Infrastructure']
  },
  {
    idx: 2,
    stage: 'Financial & Workforce Governance',
    elevation: 'Organizational Control',
    summary: 'Introduce Financial ledger reconciliation, Workforce shift custody, and Operations approval queues without migrating platforms.',
    enginesActive: ['Commerce', 'Inventory', 'Procurement', 'Financial', 'Workforce', 'Operations', 'Security', 'Infrastructure']
  },
  {
    idx: 3,
    stage: 'Multi-Station & Multi-Site Horizon',
    elevation: 'Architectural Expansion',
    summary: 'Scale outward to additional workstations and potential connected multi-location deployments while preserving one consistent kernel.',
    enginesActive: ['All 8 Core Engines · Multi-Station Ready']
  }
];

export const SALRYN_STATES = [
  {
    id: 'kernel',
    tabLabel: 'Unified Kernel Core',
    flavorIdx: -1,
    tag: 'One Unified Offline-First Kernel · 8 Core Engines',
    title: 'One kernel built to adapt across twelve industry families.',
    description: 'Commerce, Inventory, Procurement, Financial, Workforce, Operations, mandatory Security, and Infrastructure live together inside Salryn so organizations expand capabilities without replacing their core system.',
    activeEngines: [0, 1, 2, 3, 4, 5, 6, 7],
    activeFamilies: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    fieldProfile: { warp: 0.86, density: 11.0, energy: 0.52, focusX: 0.52, focusY: 0.50 },
    threeProfile: { spread: 0.0, twist: 0.0, ringScale: 1.0, pulse: 0.65 },
    surfaceTitle: 'Salryn Unified Kernel Architecture',
    surfaceNote: 'Conceptual architecture preview · Core foundation',
    rows: [
      { title: 'Security & Infrastructure Foundation', meta: 'Always active across every flavor; never an optional tier or add-on', status: 'Mandatory Core', lime: true },
      { title: 'Modular Capability Activation', meta: 'Activate Commerce, Inventory, Procurement, Financial, Workforce, or Operations as needed', status: '8 Core Engines', lime: false },
      { title: 'Twelve Industry Adaptation Families', meta: 'Illustrative configurations shaped from one consistent architectural kernel', status: '12 Families', lime: false }
    ]
  },
  {
    id: 'commerce-supply',
    tabLabel: 'Retail, Supply & Distribution',
    flavorIdx: 0,
    tag: 'Illustrative Adaptation · Retail, Hardware & Supply, Distribution',
    title: 'Shaped for storefront checkout, yard stock, and supplier purchasing.',
    description: 'Combines Commerce, Inventory, Procurement, and Financial engines over mandatory Security and offline-first Infrastructure for businesses moving physical goods daily.',
    activeEngines: [0, 1, 2, 3, 6, 7],
    activeFamilies: [0, 2, 7],
    fieldProfile: { warp: 1.14, density: 14.0, energy: 0.72, focusX: 0.34, focusY: 0.60 },
    threeProfile: { spread: 0.44, twist: 0.88, ringScale: 1.12, pulse: 0.90 },
    surfaceTitle: 'Commerce & Supply Configuration View',
    surfaceNote: 'Illustrative architectural direction · Not a released SKU',
    rows: [
      { title: 'Counter Sales & Movement Custody', meta: 'Commerce + Inventory · Links frontline checkout directly to append-only stock balances', status: 'Engines Active', lime: true },
      { title: 'Requisition, Receiving & Supplier Payables', meta: 'Procurement + Financial · Verifies received goods before settlement posting', status: 'Reconciled', lime: false },
      { title: 'Mandatory Security & Offline Continuity', meta: 'Security + Infrastructure · Role custody and local resilience always enforced', status: 'Core Locked', lime: false }
    ]
  },
  {
    id: 'hospitality-service',
    tabLabel: 'Food, Hospitality & Services',
    flavorIdx: 1,
    tag: 'Illustrative Adaptation · Food & Beverage, Hospitality, Services, Rental',
    title: 'Composed for shift teams, service queues, and asset turnover.',
    description: 'Activates Commerce, Workforce, Operations, and Financial custody so service desks, hospitality venues, and rental counters run smoothly across busy shifts.',
    activeEngines: [0, 1, 3, 4, 5, 6, 7],
    activeFamilies: [1, 4, 5, 6],
    fieldProfile: { warp: 1.24, density: 15.2, energy: 0.76, focusX: 0.70, focusY: 0.58 },
    threeProfile: { spread: 0.62, twist: 1.65, ringScale: 1.06, pulse: 0.94 },
    surfaceTitle: 'Service & Hospitality Configuration View',
    surfaceNote: 'Illustrative architectural direction · Not a released SKU',
    rows: [
      { title: 'Shift Handover & Staff Accountability', meta: 'Workforce + Financial · Connects cash drawers and service tickets to named shifts', status: 'Accountable', lime: true },
      { title: 'Operational Queues & Asset Check-Out', meta: 'Operations + Inventory · Structured task flow and return verification', status: 'Structured', lime: false },
      { title: 'Mandatory Security & Offline Continuity', meta: 'Security + Infrastructure · Protects counter operations when links drop', status: 'Core Locked', lime: false }
    ]
  },
  {
    id: 'production-enterprise',
    tabLabel: 'Production, Care & Enterprise',
    flavorIdx: 2,
    tag: 'Illustrative Adaptation · Healthcare, Automotive, Manufacturing, Agriculture, Enterprise',
    title: 'Engineered for regulated workflows, fabrication, and multi-site control.',
    description: 'Engages Inventory, Procurement, Workforce, Operations, and Financial engines under strict Security boundaries for clinics, workshops, production units, and multi-branch teams.',
    activeEngines: [1, 2, 3, 4, 5, 6, 7],
    activeFamilies: [3, 8, 9, 10, 11],
    fieldProfile: { warp: 0.98, density: 13.0, energy: 0.66, focusX: 0.42, focusY: 0.36 },
    threeProfile: { spread: 0.48, twist: 2.55, ringScale: 1.15, pulse: 0.86 },
    surfaceTitle: 'Production & Enterprise Configuration View',
    surfaceNote: 'Illustrative architectural direction · Not a released SKU',
    rows: [
      { title: 'Multi-Step Workflows & Approval Gates', meta: 'Operations + Procurement · Formal human sign-off for high-value requisitions and jobs', status: 'Governed', lime: true },
      { title: 'Lot Custody & Workshop Material Tracking', meta: 'Inventory + Workforce · Traceable consumption across jobs, bays, or departments', status: 'Traceable', lime: false },
      { title: 'Mandatory Security & Local Custody', meta: 'Security + Infrastructure · Strict role isolation and auditable records built in', status: 'Core Locked', lime: false }
    ]
  }
];

function closedRingPath(cx, cy, radiusFn, segments = 48) {
  const pts = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const r = radiusFn(a);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  const parts = [`M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`];
  const t = 0.24;
  for (let i = 0; i < segments; i++) {
    const p0 = pts[(i - 1 + segments) % segments];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % segments];
    const p3 = pts[(i + 2) % segments];
    const c1x = p1[0] + (p2[0] - p0[0]) * t;
    const c1y = p1[1] + (p2[1] - p0[1]) * t;
    const c2x = p2[0] - (p3[0] - p1[0]) * t;
    const c2y = p2[1] - (p3[1] - p1[1]) * t;
    parts.push(`C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`);
  }
  parts.push('Z');
  return parts.join(' ');
}

export function mountSalrynExplorer({ svgMount, tabsContainer, detailEls, fieldController, onStateChange }) {
  const reduced = isReducedMotion();
  let currentIdx = 0;

  if (tabsContainer) {
    tabsContainer.innerHTML = SALRYN_STATES.map((st, idx) => `
      <button type="button" class="hairline-tab" role="tab" data-salryn-idx="${idx}" aria-selected="${idx === 0}">
        ${st.tabLabel}
      </button>
    `).join('');
  }

  function highlightSvgArchitecture(svg, st, stateIdx) {
    if (!svg) return;

    // 1. Live 48-segment cubic Bezier shell morphing around (720, 460)
    const outer = svg.querySelector('#salryn-shell-outer');
    const mid = svg.querySelector('#salryn-shell-mid');
    const inner = svg.querySelector('#salryn-shell-inner');
    const phase = stateIdx * 0.72;
    const amp = stateIdx === 0 ? 12 : 19;

    if (outer) {
      const target = closedRingPath(720, 460, (a) => 372 + amp * Math.sin(3 * a + phase) + 8 * Math.cos(5 * a - phase), 48);
      morphSvgPath(outer, outer.getAttribute('d'), target, 0.72);
    }
    if (mid) {
      const target = closedRingPath(720, 460, (a) => 256 + (amp * 0.75) * Math.cos(4 * a + phase) + 6 * Math.sin(2 * a), 48);
      morphSvgPath(mid, mid.getAttribute('d'), target, 0.72);
    }
    if (inner) {
      const target = closedRingPath(720, 460, (a) => 146 + 8 * Math.sin(3 * a - phase), 48);
      morphSvgPath(inner, inner.getAttribute('d'), target, 0.72);
    }

    // 2. Highlight active 8 Core Engines
    svg.querySelectorAll('.engine-node, .engine-spoke').forEach((node) => {
      const eIdx = parseInt(node.dataset.engine, 10);
      const active = st.activeEngines.includes(eIdx);
      if (reduced) node.style.opacity = active ? '1' : '0.24';
      else gsap.to(node, { opacity: active ? 1 : 0.24, duration: 0.42, ease: 'power2.out' });
    });

    // 3. Highlight active 12 Industry Families & filaments
    svg.querySelectorAll('.family-node, .family-filament').forEach((node) => {
      const fIdx = parseInt(node.dataset.family, 10);
      const active = st.activeFamilies.includes(fIdx);
      if (reduced) node.style.opacity = active ? '1' : '0.20';
      else gsap.to(node, { opacity: active ? 1 : 0.20, duration: 0.42, ease: 'power2.out' });
    });
  }

  function applyState(idx) {
    currentIdx = Math.max(0, Math.min(SALRYN_STATES.length - 1, idx));
    const st = SALRYN_STATES[currentIdx];

    if (tabsContainer) {
      tabsContainer.querySelectorAll('button[data-salryn-idx]').forEach((b, i) => {
        b.setAttribute('aria-selected', String(i === currentIdx));
      });
    }

    if (detailEls.tag) detailEls.tag.textContent = st.tag;
    if (detailEls.title) detailEls.title.textContent = st.title;
    if (detailEls.desc) detailEls.desc.textContent = st.description;
    if (detailEls.surfaceTitle) detailEls.surfaceTitle.textContent = st.surfaceTitle;
    if (detailEls.surfaceNote) detailEls.surfaceNote.textContent = st.surfaceNote;

    if (detailEls.rows) {
      detailEls.rows.innerHTML = st.rows.map((r) => `
        <div class="salryn-ui-row ${r.lime ? 'accent-row' : ''}">
          <div>
            <strong>${r.title}</strong>
            <span>${r.meta}</span>
          </div>
          <em class="salryn-ui-state ${r.lime ? 'lime' : ''}">${r.status}</em>
        </div>
      `).join('');
      if (!reduced) {
        gsap.fromTo(
          detailEls.rows.children,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.36, stagger: 0.05, ease: 'power3.out', clearProps: 'transform,opacity' }
        );
      }
    }

    const svg = svgMount ? svgMount.querySelector('svg') : null;
    highlightSvgArchitecture(svg, st, currentIdx);

    if (fieldController) fieldController.setProfile(st.fieldProfile);
    if (typeof onStateChange === 'function') onStateChange(st, currentIdx);
  }

  if (tabsContainer) {
    tabsContainer.querySelectorAll('button[data-salryn-idx]').forEach((btn) => {
      btn.addEventListener('click', () => applyState(parseInt(btn.dataset.salrynIdx, 10)));
    });
  }

  if (svgMount) {
    const svgUrl = svgMount.dataset.svgSrc || './assets/salryn-ecosystem-architecture.svg';
    fetch(svgUrl)
      .then((r) => r.text())
      .then((svgText) => {
        svgMount.innerHTML = svgText;
        svgMount.dataset.status = 'ready';
        const svg = svgMount.querySelector('svg');
        if (svg) {
          svg.querySelectorAll('.family-node').forEach((node) => {
            node.style.cursor = 'pointer';
            node.addEventListener('click', () => {
              const fIdx = parseInt(node.dataset.family, 10);
              const stIdx = SALRYN_STATES.findIndex((s, i) => i > 0 && s.activeFamilies.includes(fIdx));
              applyState(stIdx !== -1 ? stIdx : 0);
            });
          });
          const core = svg.querySelector('#salryn-kernel-core');
          if (core) {
            core.style.cursor = 'pointer';
            core.addEventListener('click', () => applyState(0));
          }
        }
        applyState(0);
      })
      .catch(() => applyState(0));
  } else {
    applyState(0);
  }

  return { applyState, getCurrentIndex: () => currentIdx };
}
