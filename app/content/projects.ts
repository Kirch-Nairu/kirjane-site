import type { ProjectCaseStudy } from "./types";
import { projectEvidence } from "./evidence";

export const projects: ProjectCaseStudy[] = [
  {
    id: "salryn-bms",
    slug: "salryn",
    number: "01",
    category: "Flagship Business Management System",
    title: "Salryn",
    subtitle: "A unified operational kernel for retail, hospitality, pharmacy, and trade.",
    summary:
      "Co-engineered by systems architects and accountants, Salryn unifies checkout transactions, real-time inventory management, purchasing workflows, and automated double-entry accounting into one coherent system.",
    problem:
      "Small and mid-sized enterprises often struggle with disconnected point-of-sale registers, manual inventory spreadsheets, and delayed book balancing that take days to reconcile at the end of each month.",
    solution:
      "Salryn anchors the front-of-house register to a balanced accounting ledger in real time. Every scan, return, or stock transfer writes directly to general ledger accounts with zero drift.",
    outcome:
      "Piloted in commercial retail and cafe environments across Bohol, giving operators real-time visibility into daily margins, low-stock warnings, and cash drawers.",
    deliveryState: "pilot",
    statusBadge: "Commercial Pilot",
    architectureHighlights: [
      "Zero-drift double-entry ledger integration behind every transaction",
      "Sector-specific operational flavors (Cafe, General Merch, Hardware, Pharmacy)",
      "Multi-branch and multi-terminal stock consolidation",
      "Shift reconciliation with discrepancy audits and cashier lockouts",
    ],
    evidence: projectEvidence.salryn,
    demonstrationLabel: "Demonstrated in active commercial pilot and internal test benches.",
  },
  {
    id: "scoryn-tabulation",
    slug: "scoryn",
    number: "02",
    category: "Live Competition & Scoring Platform",
    title: "Scoryn",
    subtitle: "Real-time, fault-tolerant scoring and audit tabulation for live events.",
    summary:
      "Scoryn provides instantaneous tablet-to-server score aggregation for pageants, athletic events, and institutional competitions, replacing error-prone paper scorecards and manual calculator tallying.",
    problem:
      "Live competitions face critical deadlines where manual score collection and spreadsheet data entry introduce human calculation errors, delayed announcements, and audit challenges under intense public pressure.",
    solution:
      "Judges score on dedicated networked tablet interfaces. Scoryn calculates weighted scores, enforces round cutoffs, flags anomalies, and generates tamper-evident audit printouts for officials.",
    outcome:
      "Successfully deployed as the official automated tabulation system for Miss Poblacion Occidental, Mister Valencia, and Miss Lila.",
    deliveryState: "delivered",
    statusBadge: "Event-Proven Platform",
    architectureHighlights: [
      "Decentralized scoring synchronization resilient to intermittent venue Wi-Fi",
      "Automated weighted scoring algorithms and deterministic tie-break criteria",
      "Cryptographic round lockouts to prevent retrospective tampering",
      "Instantaneous official audit sheets and organizer summary views",
    ],
    evidence: projectEvidence.scoryn,
    demonstrationLabel: "Verified through official live event tabulations in Bohol.",
  },
  {
    id: "talibon-intra-office",
    slug: "talibon",
    number: "03",
    category: "Government & Institutional Workflow",
    title: "Talibon Intra-Office System",
    subtitle: "Digital document routing, receiving logs, and accountability for municipal offices.",
    summary:
      "Engineered to modernize inter-departmental communications and document routing within municipal local government units, replacing physical paper transit with traceable digital tracking.",
    problem:
      "Municipal departments frequently rely on manual messenger delivery and physical logbooks, causing lost paper trails, bottlenecked approvals, and lack of accountability for time-sensitive public documents.",
    solution:
      "A centralized intranet platform that logs document movement across departments, records digital receiving receipts with timestamps, and provides department heads with real-time status visibility.",
    outcome:
      "Institutional workflow system engineered for the Municipality of Talibon, tailored to public-sector document security and audit requirements.",
    deliveryState: "development",
    statusBadge: "Institutional Deployment",
    architectureHighlights: [
      "Role-based routing permissions matching official municipal hierarchies",
      "Tamper-proof digital receiving receipts and historical movement audit logs",
      "Department-level priority queues and overdue notification flags",
      "Air-gapped and intranet-compatible on-premise server deployment",
    ],
    evidence: projectEvidence.talibon,
    demonstrationLabel: "Engineered for institutional municipal operations.",
  },
];
