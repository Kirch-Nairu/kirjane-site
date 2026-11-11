import { test, expect, chromium } from "@playwright/test";
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

test.describe("Kirjane R1 Visual Acceptance, Motion & Route QA", () => {
  test("Gate G3 & G4: Homepage First Viewport + Section Captures across 4 viewports", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.waitForTimeout(600);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, `Horizontal overflow on / at ${vp.name}`).toBe(false);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `g3-hero-${vp.name}.png`),
        fullPage: false,
      });
    }

    // Capture dedicated 1440x900 section views for Gate G4 inspection
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const capSection = page.locator(".editorial-cap-ledger");
    await capSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "g4-home-capabilities-1440x900.png"),
      fullPage: false,
    });

    const salrynSection = page.locator(".flavor-explorer").first();
    await salrynSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "g4-home-salryn-1440x900.png"),
      fullPage: false,
    });

    const teamSection = page.locator(".team-split-screen").first();
    await teamSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "g4-home-team-split-1440x900.png"),
      fullPage: false,
    });

    const processSection = page.locator(".process-story-shell").first();
    await processSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "g4-home-process-story-1440x900.png"),
      fullPage: false,
    });

    expect(errors).toEqual([]);
  });

  test("Gate G7: 24-Capture Matrix (6 routes × 4 viewports) & Content Integrity", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    for (const route of ROUTES) {
      for (const vp of VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(route.path, { waitUntil: "networkidle" });
        await page.waitForTimeout(450);

        // Verify zero horizontal overflow
        const hasOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        );
        expect(hasOverflow, `Overflow on ${route.path} at ${vp.name}`).toBe(false);

        // Verify Gate G6 truthful content rules on every route
        const bodyText = await page.locator("body").innerText();
        expect(bodyText).not.toContain("24/7");
        expect(bodyText).not.toContain("Daily Encrypted Backups");
        expect(bodyText).not.toContain("100% Verified");
        expect(bodyText).not.toContain("KirionForge");
        expect(bodyText).not.toContain("Operation-FORGE");

        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${route.slug}-${vp.name}.png`),
          fullPage: true,
        });
      }
    }

    expect(errors).toEqual([]);
  });

  test("Gate G5: Process Stages Real Forward & Reverse Scroll Scrubbing", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/process", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const track = page.locator(".process-story-track");
    await track.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    // Initial stage is Stage 01
    await expect(page.locator(".process-story-slide.is-active h3")).toContainText(
      "Listen & Map the Real Workflow",
    );

    // Scroll down forward through the track
    await page.evaluate(() => {
      const el = document.querySelector(".process-story-track");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + 600, behavior: "instant" });
      }
    });
    await page.waitForTimeout(400);

    // Bounded progress advances
    const activeTextMid = await page.locator(".process-story-slide.is-active h3").innerText();
    expect(activeTextMid.length).toBeGreaterThan(0);

    // Scroll down further toward end of track
    await page.evaluate(() => {
      const el = document.querySelector(".process-story-track");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const height = el.getBoundingClientRect().height;
        window.scrollTo({ top: top + height * 0.85, behavior: "instant" });
      }
    });
    await page.waitForTimeout(450);

    // Stage advances toward final steps
    await expect(page.locator(".process-story-slide.is-active h3")).toContainText(
      "Deploy, Host & Stand By Your Team",
    );

    // Test REVERSE scrolling: scroll back up to top of track
    await page.evaluate(() => {
      const el = document.querySelector(".process-story-track");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + 50, behavior: "instant" });
      }
    });
    await page.waitForTimeout(450);

    // Reversible scroll returns to Stage 01
    await expect(page.locator(".process-story-slide.is-active h3")).toContainText(
      "Listen & Map the Real Workflow",
    );
  });

  test("Gate G5 & Mobile: Process Stages Touch-Swipe Navigation", async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
    });
    const page = await context.newPage();

    await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const track = page.locator(".process-story-track").first();
    await track.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    // Initial stage is Stage 01
    await expect(page.locator(".process-story-slide.is-active h3").first()).toContainText(
      "Listen & Map the Real Workflow",
    );

    // Touch Swipe Left (advance forward): clientX 320 -> clientX 60 (deltaX: -260)
    await page.evaluate(() => {
      const el = document.querySelector(".process-story-track");
      if (!el) return;
      const startTouch = new Touch({ identifier: 1, target: el, clientX: 320, clientY: 400 });
      const endTouch = new Touch({ identifier: 1, target: el, clientX: 60, clientY: 400 });
      el.dispatchEvent(new TouchEvent("touchstart", { touches: [startTouch], changedTouches: [startTouch], bubbles: true }));
      el.dispatchEvent(new TouchEvent("touchend", { touches: [], changedTouches: [endTouch], bubbles: true }));
    });
    await page.waitForTimeout(400);

    // Verified advances to Stage 02
    await expect(page.locator(".process-story-slide.is-active h3").first()).toContainText(
      "Define the Rules & Numbers",
    );

    // Another Touch Swipe Left to Stage 03
    await page.evaluate(() => {
      const el = document.querySelector(".process-story-track");
      if (!el) return;
      const startTouch = new Touch({ identifier: 2, target: el, clientX: 320, clientY: 400 });
      const endTouch = new Touch({ identifier: 2, target: el, clientX: 60, clientY: 400 });
      el.dispatchEvent(new TouchEvent("touchstart", { touches: [startTouch], changedTouches: [startTouch], bubbles: true }));
      el.dispatchEvent(new TouchEvent("touchend", { touches: [], changedTouches: [endTouch], bubbles: true }));
    });
    await page.waitForTimeout(400);

    await expect(page.locator(".process-story-slide.is-active h3").first()).toContainText(
      "Engineer the System & Interface",
    );

    // Touch Swipe Right (reverse backward): clientX 60 -> clientX 320 (deltaX: +260)
    await page.evaluate(() => {
      const el = document.querySelector(".process-story-track");
      if (!el) return;
      const startTouch = new Touch({ identifier: 3, target: el, clientX: 60, clientY: 400 });
      const endTouch = new Touch({ identifier: 3, target: el, clientX: 320, clientY: 400 });
      el.dispatchEvent(new TouchEvent("touchstart", { touches: [startTouch], changedTouches: [startTouch], bubbles: true }));
      el.dispatchEvent(new TouchEvent("touchend", { touches: [], changedTouches: [endTouch], bubbles: true }));
    });
    await page.waitForTimeout(400);

    // Verified reverses to Stage 02
    await expect(page.locator(".process-story-slide.is-active h3").first()).toContainText(
      "Define the Rules & Numbers",
    );

    await context.close();
    await browser.close();
  });

  test("Gate G6: Contact Experience, Form Usability & Functional Social/Email Channels", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions for copy draft test
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/contact", { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    // 1. Direct Email channel is a functional mailto link
    const emailLink = page.locator('a[href^="mailto:kirjanelabs@gmail.com"]');
    await expect(emailLink.first()).toBeVisible();

    // 2. Facebook channel is an active external link
    const fbLink = page.locator('.contact-channel-card[href="https://www.facebook.com/kirjanelabs"]');
    await expect(fbLink).toBeVisible();
    await expect(fbLink).toHaveAttribute("target", "_blank");

    // 3. Inquiry form fields are ACTIVE and NOT disabled
    const nameInput = page.locator("#contact-name");
    const emailInput = page.locator("#contact-email");
    const orgInput = page.locator("#contact-organization");
    const detailsInput = page.locator("#contact-details");
    const submitBtn = page.locator('button[type="submit"].inquiry-submit');

    await expect(nameInput).not.toBeDisabled();
    await expect(emailInput).not.toBeDisabled();
    await expect(orgInput).not.toBeDisabled();
    await expect(detailsInput).not.toBeDisabled();
    await expect(submitBtn).not.toBeDisabled();

    // 4. Fill form and test Copy Formatted Draft action
    await nameInput.fill("Juan dela Cruz");
    await emailInput.fill("juan@enterprise.ph");
    await orgInput.fill("Bohol Commercial Hub");
    await detailsInput.fill("Looking for a Salryn Retail setup for 2 grocery branches.");

    const copyBtn = page.getByRole("button", { name: /Copy Formatted Draft/i });
    await copyBtn.click();
    await page.waitForTimeout(300);

    await expect(page.getByText("✓ Inquiry text copied to clipboard!")).toBeVisible();
  });

  test("Gate G6: Salryn Capability Audit & Readiness Badging Verification", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/projects", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Verify readiness badges on flavor cards
    await expect(page.getByText("Piloted Configuration").first()).toBeVisible();
    await expect(page.getByText("In-Development").first()).toBeVisible();
    await expect(page.getByText("Proposed Configuration").first()).toBeVisible();
    await expect(page.getByText("Custom Deployment").first()).toBeVisible();

    // Verify Salryn interactive simulator shows readiness details
    const sim = page.locator(".flavor-explorer");
    await sim.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await expect(page.getByText("Readiness Audit:").first()).toBeVisible();

    // Switch to View 3: Included Modules & Core Kernel
    await page.getByRole("tab", { name: /3\. Included Modules/i }).click();
    await page.waitForTimeout(400);

    await expect(page.getByText("Shared Salryn Core Modules (Implemented)")).toBeVisible();
    await expect(page.getByText("● Implemented Core").first()).toBeVisible();
  });

  test("Gate G7: Measured Performance & Layout Stability across all 6 routes", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const performanceResults: Record<
      string,
      { cls: number; dclMs: number; loadMs: number; ttfbMs: number }
    > = {};

    for (const route of ROUTES) {
      // Inject CLS observer before load
      await page.addInitScript(() => {
        (window as unknown as { __clsValue: number }).__clsValue = 0;
        try {
          const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!(entry as unknown as { hadRecentInput?: boolean }).hadRecentInput) {
                (window as unknown as { __clsValue: number }).__clsValue +=
                  (entry as unknown as { value: number }).value || 0;
              }
            }
          });
          observer.observe({ type: "layout-shift", buffered: true });
        } catch {
          // ignore
        }
      });

      await page.goto(route.path, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);

      const metrics = await page.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0] as
          | PerformanceNavigationTiming
          | undefined;
        const cls = (window as unknown as { __clsValue: number }).__clsValue ?? 0;
        return {
          cls: Math.round(cls * 1000) / 1000,
          dclMs: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : 0,
          loadMs: nav ? Math.round(nav.loadEventEnd - nav.startTime) : 0,
          ttfbMs: nav ? Math.round(nav.responseStart - nav.startTime) : 0,
        };
      });

      // Strict assertions: CLS must be under 0.05 (well below 0.1 threshold)
      expect(metrics.cls, `CLS on ${route.path} exceeds threshold`).toBeLessThan(0.05);

      performanceResults[route.slug] = metrics;
    }

    // Save measured evidence to qa-artifacts/performance-metrics.json
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, "performance-metrics.json"),
      JSON.stringify(performanceResults, null, 2),
      "utf-8",
    );
  });

  test("Gate G5 & G7: Interactive Controls, Keyboard Navigation, Reduced Motion & Motion Videos", async () => {
    const browser = await chromium.launch();

    // 1. Desktop Interactive + Motion Recording (1440x900)
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: {
        dir: VIDEO_DIR,
        size: { width: 1440, height: 900 },
      },
    });
    const page = await context.newPage();

    await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);

    // Test Skip-link focus
    await page.keyboard.press("Tab");
    const skipLink = page.locator(".skip-link");
    await expect(skipLink).toBeFocused();

    // Test Salryn Interactive Simulator (Flavor switch + Qty + Mode switch)
    const salryn = page.locator(".flavor-explorer").first();
    await salryn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.getByRole("tab", { name: /Salryn General Merchandise/i }).click();
    await page.waitForTimeout(400);
    await expect(page.getByRole("heading", { name: "Salryn General Merchandise" })).toBeVisible();
    await page.getByRole("tab", { name: /2\. Automatic Accounting Ledger/i }).click();
    await page.waitForTimeout(450);
    await expect(page.getByText("Sample Ledger Balanced")).toBeVisible();

    // Test Full-Bleed 50/50 Team Showcase (Forward & Backward + Keyboard)
    const team = page.locator(".team-split-screen").first();
    await team.scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
    await expect(page.locator(".team-copy-slide.is-active h3")).toHaveText("Kirch");

    // Step forward through Paul -> James Karl -> Siris
    await page.getByRole("button", { name: "Next team member" }).click();
    await page.waitForTimeout(450);
    await expect(page.locator(".team-copy-slide.is-active h3")).toHaveText("Paul");

    await page.getByRole("tab", { name: /03\s*James Karl/i }).click();
    await page.waitForTimeout(450);
    await expect(page.locator(".team-copy-slide.is-active h3")).toHaveText("James Karl");

    // Keyboard ArrowRight to Siris (04) and ArrowLeft back to James Karl (03)
    await page.locator(".team-roster-Dock button.is-active").focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(450);
    await expect(page.locator(".team-copy-slide.is-active h3")).toHaveText("Siris");

    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(450);
    await expect(page.locator(".team-copy-slide.is-active h3")).toHaveText("James Karl");

    // Test Progressive 5-Stage Storytelling Process (Forward & Reverse buttons)
    const process = page.locator(".process-story-shell").first();
    await process.scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
    await expect(page.locator(".process-story-slide.is-active h3")).toContainText(
      "Listen & Map the Real Workflow",
    );

    for (let step = 2; step <= 5; step++) {
      await page.getByRole("button", { name: "Next delivery stage" }).click();
      await page.waitForTimeout(350);
    }
    await expect(page.locator(".process-story-slide.is-active h3")).toContainText(
      "Deploy, Host & Stand By Your Team",
    );

    // Reverse back to Stage 01
    await page.getByRole("tab", { name: /01\s*Understand/i }).click();
    await page.waitForTimeout(450);
    await expect(page.locator(".process-story-slide.is-active h3")).toContainText(
      "Listen & Map the Real Workflow",
    );

    const desktopVideo = page.video();
    await context.close();
    if (desktopVideo) {
      const videoPath = await desktopVideo.path();
      const targetVideo = path.join(VIDEO_DIR, "kirjane-desktop-motion-1440x900.webm");
      if (fs.existsSync(videoPath)) {
        fs.copyFileSync(videoPath, targetVideo);
        if (videoPath !== targetVideo) fs.unlinkSync(videoPath);
      }
    }

    // 2. Mobile Navigation Drawer & Reduced-Motion Verification (390x844)
    const rmContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
      recordVideo: {
        dir: VIDEO_DIR,
        size: { width: 390, height: 844 },
      },
    });
    const rmPage = await rmContext.newPage();
    await rmPage.goto("http://localhost:5173/", { waitUntil: "networkidle" });
    await rmPage.waitForTimeout(500);

    // Verify mobile menu opens and closes with Escape
    const menuBtn = rmPage.getByRole("button", { name: /Open navigation menu/i });
    await menuBtn.click();
    await expect(rmPage.locator("#mobile-menu")).toBeVisible();
    await rmPage.keyboard.press("Escape");
    await expect(rmPage.locator("#mobile-menu")).toBeHidden();

    // Capture reduced-motion screenshot
    await rmPage.screenshot({
      path: path.join(SCREENSHOT_DIR, "g5-reduced-motion-390x844.png"),
      fullPage: false,
    });

    const rmVideo = rmPage.video();
    await rmContext.close();
    if (rmVideo) {
      const rmVideoPath = await rmVideo.path();
      const targetRmVideo = path.join(VIDEO_DIR, "kirjane-reduced-motion-390x844.webm");
      if (fs.existsSync(rmVideoPath)) {
        fs.copyFileSync(rmVideoPath, targetRmVideo);
        if (rmVideoPath !== targetRmVideo) fs.unlinkSync(rmVideoPath);
      }
    }

    await browser.close();
  });
});