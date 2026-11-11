import { useState } from "react";
import { salrynFlavors, salrynKernelModules } from "../data/content";
import { ArrowLink } from "./Editorial";
import { SpotlightCard } from "./Motion";

interface SimCatalogItem {
  sku: string;
  name: string;
  unit: string;
  price: number;
  cost: number;
  stock: number;
}

const flavorCatalogs: Record<string, SimCatalogItem[]> = {
  cafe: [
    { sku: "CAF-101", name: "Spanish Latte (16oz · Oat)", unit: "Cup", price: 165, cost: 58, stock: 84 },
    { sku: "CAF-104", name: "Artisan Butter Croissant", unit: "Piece", price: 140, cost: 48, stock: 32 },
    { sku: "CAF-209", name: "Ceremonial Matcha Espresso", unit: "Cup", price: 185, cost: 66, stock: 50 },
  ],
  "gen-merch": [
    { sku: "GM-4001", name: "Premium Commercial Rice (25kg)", unit: "Sack", price: 1380, cost: 1190, stock: 120 },
    { sku: "GM-4088", name: "Household Essentials Wholesale Pack", unit: "Case", price: 2450, cost: 1980, stock: 45 },
    { sku: "GM-4102", name: "Cooking Oil Bulk Container (18L)", unit: "Tin", price: 1620, cost: 1340, stock: 68 },
  ],
  hardware: [
    { sku: "HW-901", name: "Type 1 Portland Cement (40kg)", unit: "Bag", price: 245, cost: 198, stock: 450 },
    { sku: "HW-914", name: "Deformed Steel Bar 10mm x 6m", unit: "Length", price: 195, cost: 152, stock: 600 },
    { sku: "HW-955", name: "Marine Plywood 3/4 Standard", unit: "Sheet", price: 1480, cost: 1180, stock: 95 },
  ],
  pharmacy: [
    { sku: "PH-301", name: "Amoxicillin 500mg (Lot #FEFO-27)", unit: "Box/100", price: 680, cost: 440, stock: 74 },
    { sku: "PH-318", name: "Ascorbic Acid + Zinc Immune Pack", unit: "Box/100", price: 520, cost: 330, stock: 110 },
    { sku: "PH-344", name: "Digital Blood Pressure Monitor", unit: "Unit", price: 1890, cost: 1320, stock: 22 },
  ],
  services: [
    { sku: "SRV-01", name: "Full Preventive Maintenance Package", unit: "Job Order", price: 3500, cost: 1200, stock: 99 },
    { sku: "SRV-04", name: "Diagnostic & Calibration Service", unit: "Session", price: 1500, cost: 450, stock: 99 },
    { sku: "SRV-09", name: "Replacement Component Kit + Labor", unit: "Bundle", price: 4200, cost: 2400, stock: 28 },
  ],
  enterprise: [
    { sku: "ENT-01", name: "Inter-Branch Stock Consolidation Batch", unit: "Manifest", price: 48500, cost: 36000, stock: 15 },
    { sku: "ENT-02", name: "Automated Procurement Contract Order", unit: "PO Lot", price: 125000, cost: 94000, stock: 8 },
    { sku: "ENT-03", name: "Multi-Entity Royalty & Service Settlement", unit: "Cycle", price: 32000, cost: 11000, stock: 12 },
  ],
};

type SimViewMode = "pos" | "ledger" | "architecture";

export function SalrynInteractiveSimulator() {
  const [activeFlavorId, setActiveFlavorId] = useState<string>(salrynFlavors[0].id);
  const [viewMode, setViewMode] = useState<SimViewMode>("pos");
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "CAF-101": 2,
    "CAF-104": 1,
  });
  const [commitCount, setCommitCount] = useState<number>(142);

  const activeFlavor =
    salrynFlavors.find((flavor) => flavor.id === activeFlavorId) ?? salrynFlavors[0];
  const catalog = flavorCatalogs[activeFlavor.id] ?? flavorCatalogs.cafe;

  const handleFlavorSelect = (flavorId: string) => {
    setActiveFlavorId(flavorId);
    const nextCatalog = flavorCatalogs[flavorId] ?? flavorCatalogs.cafe;
    setQuantities({
      [nextCatalog[0].sku]: 2,
      [nextCatalog[1].sku]: 1,
    });
  };

  const adjustQty = (sku: string, delta: number) => {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[sku] ?? 0) + delta);
      return { ...prev, [sku]: next };
    });
  };

  const lineItems = catalog.map((item) => {
    const qty = quantities[item.sku] ?? 0;
    return {
      ...item,
      qty,
      lineTotal: qty * item.price,
      lineCost: qty * item.cost,
      remainingStock: Math.max(0, item.stock - qty),
    };
  });

  const grossRevenue = lineItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const totalCostOfGoods = lineItems.reduce((acc, item) => acc + item.lineCost, 0);
  const netVatSales = grossRevenue / 1.12;
  const vatAmount = grossRevenue - netVatSales;
  const grossMargin = grossRevenue - totalCostOfGoods;

  return (
    <div className="flavor-explorer">
      {/* Left Column: Flavor Selector */}
      <div className="flavor-tabs-column">
        <span className="eyebrow eyebrow-lime">01 // SELECT SALRYN INDUSTRY FLAVOR</span>
        <div className="flavor-tab-list" role="tablist" aria-label="Salryn industry flavors">
          {salrynFlavors.map((flavor) => {
            const isSelected = flavor.id === activeFlavor.id;
            return (
              <button
                key={flavor.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={isSelected ? "flavor-tab active" : "flavor-tab"}
                onClick={() => handleFlavorSelect(flavor.id)}
              >
                <span className="flavor-tab-code">{flavor.code}</span>
                <span className="flavor-tab-name">{flavor.name}</span>
                <span aria-hidden="true">→</span>
              </button>
            );
          })}
        </div>

        <div className="salryn-sim-summary-box">
          <span className="kernel-code">{activeFlavor.code} // VERTICAL PROFILE</span>
          <strong>{activeFlavor.industry}</strong>
          <p>{activeFlavor.description}</p>
        </div>
      </div>

      {/* Right Column: Live Interactive Simulator & Architecture Diagram */}
      <SpotlightCard className="flavor-detail-panel">
        <div className="flavor-detail-top">
          <span className="telemetry-pill telemetry-pill-dark">
            {activeFlavor.name.toUpperCase()} // INTERACTIVE KERNEL PREVIEW
          </span>
          <span className="flavor-kernel-status">TX-COMMIT #{commitCount} · AUDIT VERIFIED</span>
        </div>

        {/* Mode Switcher Bar */}
        <div className="sim-mode-switcher" role="tablist" aria-label="Simulator inspection views">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "pos"}
            className={viewMode === "pos" ? "sim-mode-btn active" : "sim-mode-btn"}
            onClick={() => setViewMode("pos")}
          >
            01 // LIVE POS & STOCK MOCKUP
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "ledger"}
            className={viewMode === "ledger" ? "sim-mode-btn active" : "sim-mode-btn"}
            onClick={() => setViewMode("ledger")}
          >
            02 // CPA DOUBLE-ENTRY LEDGER
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "architecture"}
            className={viewMode === "architecture" ? "sim-mode-btn active" : "sim-mode-btn"}
            onClick={() => setViewMode("architecture")}
          >
            03 // KERNEL ARCHITECTURE DIAGRAM
          </button>
        </div>

        {/* VIEW 1: INTERACTIVE POS & INVENTORY TERMINAL */}
        {viewMode === "pos" ? (
          <div className="sim-view-stage">
            <div className="sim-stage-header">
              <div>
                <h3>{activeFlavor.name} — Live Terminal</h3>
                <p className="flavor-tagline">
                  Click <strong>+</strong> or <strong>−</strong> to test real-time stock depletion &
                  automatic ledger calculation.
                </p>
              </div>
              <button
                type="button"
                className="sim-commit-btn"
                onClick={() => setCommitCount((c) => c + 1)}
              >
                Post to Ledger ↗
              </button>
            </div>

            <div className="sim-pos-table">
              <div className="sim-pos-head">
                <span>SKU / ITEM</span>
                <span>STOCK LEFT</span>
                <span>UNIT PRICE</span>
                <span>QTY</span>
                <span>LINE TOTAL</span>
              </div>
              {lineItems.map((item) => (
                <div key={item.sku} className="sim-pos-row">
                  <div className="sim-item-cell">
                    <span className="sim-sku">{item.sku}</span>
                    <strong>{item.name}</strong>
                  </div>
                  <div className="sim-stock-cell">
                    <span className="sim-stock-badge">
                      {item.remainingStock} {item.unit}s
                    </span>
                  </div>
                  <div className="sim-price-cell">₱{item.price.toLocaleString()}</div>
                  <div className="sim-qty-controls">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name}`}
                      onClick={() => adjustQty(item.sku, -1)}
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${item.name}`}
                      onClick={() => adjustQty(item.sku, 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="sim-total-cell">₱{item.lineTotal.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="sim-telemetry-totals">
              <div className="sim-stat-box">
                <span>NET VATABLE SALES</span>
                <strong>₱{netVatSales.toFixed(2)}</strong>
              </div>
              <div className="sim-stat-box">
                <span>OUTPUT VAT (12%)</span>
                <strong>₱{vatAmount.toFixed(2)}</strong>
              </div>
              <div className="sim-stat-box">
                <span>EST. GROSS MARGIN</span>
                <strong className="text-lime">₱{grossMargin.toLocaleString()}</strong>
              </div>
              <div className="sim-stat-box sim-stat-highlight">
                <span>TOTAL AMOUNT DUE</span>
                <strong>₱{grossRevenue.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        ) : null}

        {/* VIEW 2: DOUBLE-ENTRY ACCOUNTING LEDGER & AUDIT TRAIL */}
        {viewMode === "ledger" ? (
          <div className="sim-view-stage">
            <div className="sim-stage-header">
              <div>
                <h3>Automated Double-Entry Journal</h3>
                <p className="flavor-tagline">
                  Every POS action in {activeFlavor.name} writes balanced accounting entries and
                  tamper-evident audit logs automatically.
                </p>
              </div>
              <span className="status-chip">BALANCED // DR = CR</span>
            </div>

            <div className="sim-ledger-grid">
              <div className="sim-ledger-head">
                <span>ACCT CODE</span>
                <span>ACCOUNT TITLE</span>
                <span>DEBIT (DR)</span>
                <span>CREDIT (CR)</span>
              </div>
              <div className="sim-ledger-row">
                <span className="sim-sku">1010-CASH</span>
                <strong>Cash on Hand / Shift Drawer</strong>
                <span className="text-lime">₱{grossRevenue.toFixed(2)}</span>
                <span>—</span>
              </div>
              <div className="sim-ledger-row">
                <span className="sim-sku">4010-REV</span>
                <strong>Sales Revenue — {activeFlavor.name}</strong>
                <span>—</span>
                <span>₱{netVatSales.toFixed(2)}</span>
              </div>
              <div className="sim-ledger-row">
                <span className="sim-sku">2120-VAT</span>
                <strong>Output Tax Payable (12%)</strong>
                <span>—</span>
                <span>₱{vatAmount.toFixed(2)}</span>
              </div>
              <div className="sim-ledger-row">
                <span className="sim-sku">5010-COGS</span>
                <strong>Cost of Goods Sold / Depletion</strong>
                <span className="text-lime">₱{totalCostOfGoods.toFixed(2)}</span>
                <span>—</span>
              </div>
              <div className="sim-ledger-row">
                <span className="sim-sku">1210-INV</span>
                <strong>Merchandise / Raw Inventory Asset</strong>
                <span>—</span>
                <span>₱{totalCostOfGoods.toFixed(2)}</span>
              </div>
            </div>

            <div className="placeholder-slot-box">
              <span>
                AUDIT HASH // SHA-256 VERIFIED · OPERATOR: SHIFT-CASHIER-01 · FLAVOR:{" "}
                {activeFlavor.code} · COMMIT #{commitCount}
              </span>
            </div>
          </div>
        ) : null}

        {/* VIEW 3: INTERACTIVE KERNEL ARCHITECTURE TOPOLOGY */}
        {viewMode === "architecture" ? (
          <div className="sim-view-stage">
            <div className="sim-stage-header">
              <div>
                <h3>Salryn Kernel Architecture Topology</h3>
                <p className="flavor-tagline">
                  How <strong>{activeFlavor.name}</strong> mounts directly onto the shared Salryn
                  Enterprise Kernel.
                </p>
              </div>
            </div>

            <div className="arch-topology-diagram">
              <div className="arch-layer arch-layer-flavor">
                <span className="kernel-code">MOUNTED INDUSTRY FLAVOR LAYER ({activeFlavor.code})</span>
                <div className="arch-node-row">
                  {activeFlavor.modules.map((mod) => (
                    <div key={mod} className="arch-node arch-node-active">
                      <span>◆</span> {mod}
                    </div>
                  ))}
                </div>
              </div>

              <div className="arch-connector-bus" aria-hidden="true">
                <span>⇅ BOUNDED CONTRACT & INVARIANT BUS ⇅</span>
              </div>

              <div className="arch-layer arch-layer-kernel">
                <span className="kernel-code">SALRYN CORE KERNEL (SHARED ACROSS ALL FLAVORS)</span>
                <div className="arch-node-row">
                  {salrynKernelModules.map((kmod) => (
                    <div key={kmod.code} className="arch-node">
                      <strong>{kmod.code}</strong>
                      <span>{kmod.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="placeholder-slot-box">
              <span>{activeFlavor.placeholderNote}</span>
            </div>
          </div>
        ) : null}

        <div className="flavor-panel-footer">
          <ArrowLink to="/projects" light>
            Full Salryn Architecture Breakdown
          </ArrowLink>
          <ArrowLink to="/contact" light>
            Deploy {activeFlavor.name}
          </ArrowLink>
        </div>
      </SpotlightCard>
    </div>
  );
}
