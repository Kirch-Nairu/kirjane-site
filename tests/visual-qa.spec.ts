import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const VIEWPORTS = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "768x900", width: 768, height: 900 },
  { name: "390x844", width: 390, height: 844 },
  { name: "360x800", width: 360, height: 800 },
] as const;

const ROUTES = [
  { slug: "home", path: "/" },
  { slug: "services", path: "/services" },
  { slug: "projects", path: "/projects" },
  { slug: "about", path: "/about" },
  { slug: "process", path: "/process" },
  { slug: "contact", path: "/contact" },
] as const;

const ARTIFACT_DIR = path.resolve(process.cwd(), "qa-artifacts");
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, "screenshots");
const VIDEO_DIR = path.join(ARTIFACT_DIR, "videos");

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
});

test.describe("Kirjane R2 Visual Acceptance & Route QA", () => {
  test("Gate M1: Homepage First Viewport Hero Captures at 1440, 768, 390, 360", async ({
    page,
  }) => {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      // Verify no horizontal overflow
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      expect(overflow, `Horizontal overflow on / at ${vp.name}`).toBe(false);

      // Verify signature hero headline is visible in first viewport
      const headline = page.locator("h1");
      await expect(headline).toBeVisible();
      await expect(headline).toContainText("COMPLEX WORK.");
      await expect(headline).toContainText("CLEAR SYSTEMS.");

      // Capture exact first viewport (non-fullPage)
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `r2-hero-first-viewport-${vp.name}.png`),
        fullPage: false,
      });

      // Capture full page
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `home-${vp.name}.png`),
        fullPage: true,
      });
    }
  });

  test("Gate M2: Complete 6 Routes × 4 Viewports Matrix (24 screenshots)", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    for (const route of ROUTES) {
      for (const vp of VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route.path, { waitUntil: "networkidle" });
        await page.waitForTimeout(400);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth
        );
        expect(overflow, `Horizontal overflow on ${route.path} at ${vp.name}`).toBe(false);

        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${route.slug}-${vp.name}.png`),
          fullPage: true,
        });
      }
    }

    expect(pageErrors, "Zero uncaught page errors across all routes").toEqual([]);
  });

  test("Gate M3: Interactive State Validations (Process Tabs & Team Selection)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Home Process Tabs interaction
    await page.goto("/", { waitUntil: "networkidle" });
    const tabBuild = page.locator("#tab-build");
    await expect(tabBuild).toBeVisible();
    await tabBuild.click();
    await page.waitForTimeout(300);
    const panelBuild = page.locator("#panel-build");
    await expect(panelBuild).toContainText("Engineering the Backend Kernel");

    // About Team Selection interaction
    await page.goto("/about", { waitUntil: "networkidle" });
    const sirisTab = page.locator("#team-tab-siris");
    await expect(sirisTab).toBeVisible();
    await sirisTab.click();
    await page.waitForTimeout(300);
    const spotlight = page.locator("h3:has-text('Siris')");
    await expect(spotlight).toBeVisible();

    // Mobile Navigation Toggle
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    const menuToggle = page.locator("button[aria-controls='mobile-nav-panel']");
    await expect(menuToggle).toBeVisible();
    await menuToggle.click();
    await page.waitForTimeout(300);
    const mobileLink = page.locator("#mobile-nav-panel a[href='/projects']");
    await expect(mobileLink).toBeVisible();
  });

  test("Gate M4: Contact Channel & Mailto Fallback Validation", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/contact", { waitUntil: "networkidle" });

    // Copy Email button test
    const copyBtn = page.locator("button:has-text('Copy Email Address')");
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();
    await page.waitForTimeout(300);
    const copiedFeedback = page.locator("button:has-text('Address Copied!')");
    await expect(copiedFeedback).toBeVisible();

    // Verify Direct Email Link
    const mailtoLink = page.locator("a[href='mailto:kirjanelabs@gmail.com']").first();
    await expect(mailtoLink).toBeVisible();
  });

  test("Gate M5: Content Provenance Assertions", async ({ page }) => {
    await page.goto("/projects", { waitUntil: "networkidle" });

    // Check Salryn delivery status
    const salrynBadge = page.locator("#salryn [class*='statusBadge']");
    await expect(salrynBadge).toContainText("Commercial Pilot");

    // Check Scoryn delivery status
    const scorynBadge = page.locator("#scoryn [class*='statusBadge']");
    await expect(scorynBadge).toContainText("Event-Proven Platform");

    // Check Talibon delivery status
    const talibonBadge = page.locator("#talibon [class*='statusBadge']");
    await expect(talibonBadge).toContainText("Institutional Deployment");

    // Check About Team Member count is exactly 7
    await page.goto("/about", { waitUntil: "networkidle" });
    const selectorButtons = page.locator("[role='tablist'] button[role='tab']");
    await expect(selectorButtons).toHaveCount(7);
  });
});
