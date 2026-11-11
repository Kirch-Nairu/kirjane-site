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
    { sku: "GM-4001", name: "Commercial Rice (25kg Sack)", unit: "Sack", price: 1380, cost: 1190, stock: 120 },
    { sku: "GM-4088", name: "Household Wholesale Case", unit: "Case", price: 2450, cost: 1980, stock: 45 },
    { sku: "GM-4102", name: "Cooking Oil Bulk Container (18L)", unit: "Tin", price: 1620, cost: 1340, stock: 68 },
  ],
  hardware: [
    { sku: "HW-901", name: "Type 1 Portland Cement (40kg)", unit: "Bag", price: 245, cost: 198, stock: 450 },
    { sku: "HW-914", name: "Deformed Steel Bar 10mm × 6m", unit: "Length", price: 195, cost: 152, stock: 600 },
    { sku: "HW-955", name: "Marine Plywood 3/4 Standard", unit: "Sheet", price: 1480, cost: 1180, stock: 95 },
  ],
  pharmacy: [
    { sku: "PH-301", name: "Amoxicillin 500mg (Earliest Expiry Lot)", unit: "Box/100", price: 680, cost: 440, stock: 74 },
    { sku: "PH-318", name: "Ascorbic Acid + Zinc Pack", unit: "Box/100", price: 520, cost: 330, stock: 110 },
    { sku: "PH-344", name: "Digital Blood Pressure Monitor", unit: "Unit", price: 1890, cost: 1320, stock: 22 },
  ],
  services: [
    { sku: "SRV-01", name: "Full Preventive Maintenance Service", unit: "Job Order", price: 3500, cost: 1200, stock: 99 },
    { sku: "SRV-04", name: "Diagnostic & Calibration Check", unit: "Session", price: 1500, cost: 450, stock: 99 },
    { sku: "SRV-09", name: "Replacement Parts + Labor Bundle", unit: "Bundle", price: 4200, cost: 2400, stock: 28 },
  ],
  enterprise: [
    { sku: "ENT-01", name: "Branch Stock Transfer Manifest", unit: "Batch", price: 48500, cost: 36000, stock: 15 },
    { sku: "ENT-02", name: "Supplier Purchase Order Lot", unit: "PO Lot", price: 125000, cost: 94000, stock: 8 },
    { sku: "ENT-03", name: "Monthly Franchise Billing Cycle", unit: "Cycle", price: 32000, cost: 11000, stock: 12 },
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
  const [receiptNumber, setReceiptNumber] = useState<number>(1042);

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
      {/* Left Column: Industry Selector */}
      <div className="flavor-tabs-column">
        <span className="section-kicker section-kicker-light">Choose your business type</span>
        <div className="flavor-tab-list" role="tablist" aria-label="Salryn industry setups">
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
              </button>
            );
          })}
        </div>

        <div className="salryn-sim-summary-box">
          <strong>Built for {activeFlavor.industry}</strong>
          <p>{activeFlavor.description}</p>
        </div>
      </div>

      {/* Right Column: Interactive Preview */}
      <SpotlightCard className="flavor-detail-panel">
        <div className="flavor-detail-top">
          <span className="telemetry-pill telemetry-pill-dark">
            Interactive Preview · {activeFlavor.name}
          </span>
          <span className="flavor-kernel-status">Receipt #{receiptNumber}</span>
        </div>

        {/* Mode Switcher Bar */}
        <div className="sim-mode-switcher" role="tablist" aria-label="Preview views">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "pos"}
            className={viewMode === "pos" ? "sim-mode-btn active" : "sim-mode-btn"}
            onClick={() => setViewMode("pos")}
          >
            1. Live Checkout & Stock
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "ledger"}
            className={viewMode === "ledger" ? "sim-mode-btn active" : "sim-mode-btn"}
            onClick={() => setViewMode("ledger")}
          >
            2. Automatic Accounting
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "architecture"}
            className={viewMode === "architecture" ? "sim-mode-btn active" : "sim-mode-btn"}
            onClick={() => setViewMode("architecture")}
          >
            3. Included Features
          </button>
        </div>

        {/* VIEW 1: INTERACTIVE POS & INVENTORY TERMINAL */}
        {viewMode === "pos" ? (
          <div className="sim-view-stage">
            <div className="sim-stage-header">
              <div>
                <h3>{activeFlavor.name}</h3>
                <p className="flavor-tagline">
                  Adjust quantities below to see how stock and daily profit update in real time.
                </p>
              </div>
              <button
                type="button"
                className="sim-commit-btn"
                onClick={() => setReceiptNumber((n) => n + 1)}
              >
                Complete Sale
              </button>
            </div>

            <div className="sim-pos-table">
              <div className="sim-pos-head">
                <span>Item</span>
                <span>In Stock</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
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
                <span>Net Sales</span>
                <strong>₱{netVatSales.toFixed(2)}</strong>
              </div>
              <div className="sim-stat-box">
                <span>VAT (12%)</span>
                <strong>₱{vatAmount.toFixed(2)}</strong>
              </div>
              <div className="sim-stat-box">
                <span>Gross Profit</span>
                <strong className="text-lime">₱{grossMargin.toLocaleString()}</strong>
              </div>
              <div className="sim-stat-box sim-stat-highlight">
                <span>Total Sale</span>
                <strong>₱{grossRevenue.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        ) : null}

        {/* VIEW 2: DOUBLE-ENTRY ACCOUNTING LEDGER */}
        {viewMode === "ledger" ? (
          <div className="sim-view-stage">
            <div className="sim-stage-header">
              <div>
                <h3>Automatic Accounting Entries</h3>
                <p className="flavor-tagline">
                  Designed with our accountant co-founders—every sale balances your books
                  automatically.
                </p>
              </div>
              <span className="status-chip">Books Balanced</span>
            </div>

            <div className="sim-ledger-grid">
              <div className="sim-ledger-head">
                <span>Account</span>
                <span>Description</span>
                <span>Debit (In)</span>
                <span>Credit (Out)</span>
              </div>
              <div className="sim-ledger-row">
                <span className="sim-sku">Cash / Drawer</span>
                <strong>Cash received at register</strong>
                <span className="text-lime">₱{grossRevenue.toFixed(2)}</span>
                <span>—</span>
              </div>
              <div className="sim-ledger-row">
                <span className="sim-sku">Sales Revenue</span>
                <strong>Net sales ({activeFlavor.name})</strong>
                <span>—</span>
                <span>₱{netVatSales.toFixed(2)}</span>
              </div>
              <div className="sim-ledger-row">
                <span className="sim-sku">Tax Payable</span>
                <strong>12% Output VAT recorded</strong>
                <span>—</span>
                <span>₱{vatAmount.toFixed(2)}</span>
              </div>
              <div className="sim-ledger-row">
                <span className="sim-sku">Cost of Sales</span>
                <strong>Item cost deducted</strong>
                <span className="text-lime">₱{totalCostOfGoods.toFixed(2)}</span>
                <span>—</span>
              </div>
              <div className="sim-ledger-row">
                <span className="sim-sku">Inventory</span>
                <strong>Stock value updated</strong>
                <span>—</span>
                <span>₱{totalCostOfGoods.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* VIEW 3: INCLUDED FEATURES & CORE KERNEL */}
        {viewMode === "architecture" ? (
          <div className="sim-view-stage">
            <div className="sim-stage-header">
              <div>
                <h3>What comes with {activeFlavor.name}</h3>
                <p className="flavor-tagline">
                  Industry-specific tools powered by the shared Salryn business core.
                </p>
              </div>
            </div>

            <div className="arch-topology-diagram">
              <div className="arch-layer arch-layer-flavor">
                <span className="kernel-code">Included in {activeFlavor.name}</span>
                <div className="arch-node-row">
                  {activeFlavor.modules.map((mod) => (
                    <div key={mod} className="arch-node arch-node-active">
                      <span>✓</span> {mod}
                    </div>
                  ))}
                </div>
              </div>

              <div className="arch-layer arch-layer-kernel">
                <span className="kernel-code">Powered by the Salryn Core System</span>
                <div className="arch-node-row">
                  {salrynKernelModules.map((kmod) => (
                    <div key={kmod.code} className="arch-node">
                      <strong>{kmod.name}</strong>
                      <span>{kmod.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flavor-panel-footer">
          <ArrowLink to="/projects" light>
            See All Salryn Setups
          </ArrowLink>
          <ArrowLink to="/contact" light>
            Request a Salryn Demo
          </ArrowLink>
        </div>
      </SpotlightCard>
    </div>
  );
}
