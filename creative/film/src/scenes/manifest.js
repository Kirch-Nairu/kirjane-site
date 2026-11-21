// A versioned, entirely fictional visual film. It never calls Salryn business APIs.
// Scripted actions and measured cursor targets now live in director/precision.mjs.
// This film manifest contains NO guessed pointer coordinates.
export const FILM_SOURCE_SHA = "dc5a6dcf713da7d4e9d0f47b47a685027eae45b9";
export const ACTS = Object.freeze([
  { id:"opening", step:"00 / AN INVITATION",title:"Manage your business with ease?",body:"Running a store should not mean chasing disconnected records.",screen:"none", weight:1.5},
  { id:"q-pos",step:"01 / THE QUESTIONS",title:"Point of sale?",body:"Every transaction counts. See the entire operation—not just the total.",screen:"checkout-search",weight:1.1},
  { id:"q-stock",step:"01 / THE QUESTIONS",title:"Inventory and stock tracking?",body:"Know what you have, what moved, and what needs attention.",screen:"inventory",weight:1.1},
  { id:"q-finance",step:"01 / THE QUESTIONS",title:"Cash and financial visibility?",body:"Close each shift with traceable numbers.",screen:"reports",weight:1.1},
  { id:"q-audit",step:"01 / THE QUESTIONS",title:"Audit trails and accountability?",body:"Find the record behind every important operator action.",screen:"audit",weight:1.1},
  { id:"promise",step:"02 / OUR ANSWER",title:"We’ve got the work covered.",body:"Meet Salryn. One connected workspace for everyday retail operations.",screen:"dashboard",weight:1.8},
  { id:"overview",step:"03 / THE WORKSPACE",title:"A clear view of the business.",body:"Owner summaries, cashier tools, catalog, inventory and access controls.",screen:"dashboard",weight:1.1},
  { id:"shift-gate",step:"04 / BEGIN THE DAY",title:"Every sale starts with a shift.",body:"Open the cashier workstation with an accountable opening amount.",screen:"shift",weight:1.2},
  { id:"shift-open",step:"04 / BEGIN THE DAY",title:"₱500.00 opening cash. Shift open.",body:"The register is now ready to record sales.",screen:"shift-open",weight:1.1},
  { id:"scan",step:"05 / CHECKOUT",title:"Scan. Find. Add.",body:"The barcode identifies a real catalog item in the demonstration.",screen:"checkout-search",weight:1.1},
  { id:"cart",step:"05 / CHECKOUT",title:"Two notebooks. One clear total.",body:"Quantity × price = ₱170.00; stock validation remains a backend responsibility in real Salryn.",screen:"checkout-cart",weight:1.2},
  { id:"tender",step:"05 / CHECKOUT",title:"₱200.00 received.",body:"A cash tender with ₱30.00 change.",screen:"checkout-tender",weight:1.2},
  { id:"review",step:"05 / CHECKOUT",title:"Review before completing.",body:"A deliberate final confirmation, rather than a silent transaction.",screen:"checkout-review",weight:1.0},
  { id:"complete",step:"06 / THE RECORD",title:"Sale completed. Receipt preserved.",body:"A completed sale and its persisted receipt history remain linked.",screen:"checkout-done",weight:1.5},
  { id:"receipt",step:"06 / THE RECORD",title:"The receipt tells the story.",body:"The illustration uses fictional data—no receipt is actually generated or printed.",screen:"receipt",weight:1.25},
  { id:"history",step:"06 / SALES HISTORY",title:"Every sale can be traced.",body:"Receipt reference, cashier, amount, and transaction state.",screen:"history",weight:1.2},
  { id:"stock",step:"07 / INVENTORY",title:"Stock moves with the sale.",body:"30 notebooks → sold 2 → 28 on hand.",screen:"inventory",weight:1.4},
  { id:"receiving",step:"08 / STOCK OPERATIONS",title:"Restock with a recorded movement.",body:"Receive 5 units. Available stock moves from 28 to 33.",screen:"stockin",weight:1.2},
  { id:"adjustment",step:"08 / STOCK OPERATIONS",title:"Adjustments need a reason.",body:"Record one damaged unit: 33 − 1 = 32.",screen:"adjust",weight:1.2},
  { id:"shift-close",step:"09 / THE CLOSE",title:"₱670.00 expected. ₱670.00 counted.",body:"Opening cash + net cash sales = expected cash. Variance: ₱0.00.",screen:"reports",weight:1.5},
  { id:"audit",step:"10 / ACCOUNTABILITY",title:"See what happened—and who acted.",body:"The audit trail makes changes explainable.",screen:"audit",weight:1.3},
  { id:"offline",step:"11 / RESILIENCE",title:"Designed for local-first operations.",body:"Source-documented offline-first operation and local backup capabilities, subject to deployment scope.",screen:"backup",weight:1.2},
  { id:"end",step:"12 / YOUR NEXT STEP",title:"Interested? Make Salryn yours.",body:"Book a genuine demonstration of the product suited to your operation.",screen:"dashboard",weight:2.0},
]);
