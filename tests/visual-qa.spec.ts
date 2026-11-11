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
      await page.waitForTimeout(700);

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
    await page.waitForTimeout(600);

    const capSection = page.locator(".editorial-cap-ledger");
    await capSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "g4-home-capabilities-1440x900.png"),
      fullPage: false,
    });

    const salrynSection = page.locator(".flavor-explorer").first();
    await salrynSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "g4-home-salryn-1440x900.png"),
      fullPage: false,
    });

    const teamSection = page.locator(".team-split-screen").first();
    await teamSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "g4-home-team-split-1440x900.png"),
      fullPage: false,
    });

    const processSection = page.locator(".process-story-shell").first();
    await processSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
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
        await page.waitForTimeout(550);

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
    await page.waitForTimeout(900);

    // Test Skip-link focus
    await page.keyboard.press("Tab");
    const skipLink = page.locator(".skip-link");
    await expect(skipLink).toBeFocused();

    // Test Salryn Interactive Simulator (Flavor switch + Qty + Mode switch)
    const salryn = page.locator(".flavor-explorer").first();
    await salryn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.getByRole("tab", { name: /Salryn General Merchandise/i }).click();
    await page.waitForTimeout(400);
    await expect(page.getByRole("heading", { name: "Salryn General Merchandise" })).toBeVisible();
    await page.getByRole("tab", { name: /2\. Automatic Accounting Ledger/i }).click();
    await page.waitForTimeout(450);
    await expect(page.getByText("Sample Ledger Balanced")).toBeVisible();

    // Test Full-Bleed 50/50 Team Showcase (Forward & Backward + Keyboard)
    const team = page.locator(".team-split-screen").first();
    await team.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
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

    // Test Progressive 5-Stage Storytelling Process (Forward & Reverse)
    const process = page.locator(".process-story-shell").first();
    await process.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(page.locator(".process-story-slide.is-active h3")).toContainText(
      "Listen & Map the Real Workflow",
    );

    for (let step = 2; step <= 5; step++) {
      await page.getByRole("button", { name: "Next delivery stage" }).click();
      await page.waitForTimeout(400);
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
