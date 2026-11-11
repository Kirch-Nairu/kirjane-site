import { test } from "@playwright/test";

test.use({
  video: {
    mode: "on",
    size: { width: 1440, height: 900 },
  },
});

test.describe("Kirjane R2 Video Recordings", () => {
  test("Desktop 1440x900 Motion & Interaction Walkthrough", async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Hero entry
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // 2. Smooth scroll down through homepage acts
    await page.evaluate(() => window.scrollBy({ top: 700, behavior: "smooth" }));
    await page.waitForTimeout(800);

    await page.evaluate(() => window.scrollBy({ top: 800, behavior: "smooth" }));
    await page.waitForTimeout(800);

    await page.evaluate(() => window.scrollBy({ top: 900, behavior: "smooth" }));
    await page.waitForTimeout(800);

    // 3. Process tabs interaction (forward and back)
    const tabBuild = page.locator("#tab-build");
    await tabBuild.click();
    await page.waitForTimeout(500);

    const tabVerify = page.locator("#tab-verify");
    await tabVerify.click();
    await page.waitForTimeout(500);

    const tabDiscover = page.locator("#tab-discover");
    await tabDiscover.click();
    await page.waitForTimeout(500);

    // 4. Scroll to team & footer
    await page.evaluate(() => window.scrollBy({ top: 900, behavior: "smooth" }));
    await page.waitForTimeout(800);

    // 5. Navigate to /about and test team spotlight switcher
    await page.click("nav a[href='/about']");
    await page.waitForURL("**/about");
    await page.waitForTimeout(600);

    const paulTab = page.locator("#team-tab-paul");
    await paulTab.click();
    await page.waitForTimeout(400);

    const sirisTab = page.locator("#team-tab-siris");
    await sirisTab.click();
    await page.waitForTimeout(400);

    // 6. Navigate to /projects
    await page.click("nav a[href='/projects']");
    await page.waitForURL("**/projects");
    await page.waitForTimeout(800);

    // 7. Navigate to /contact
    await page.click("a[href='/contact']");
    await page.waitForURL("**/contact");
    await page.waitForTimeout(500);

    const copyBtn = page.locator("button:has-text('Copy Email Address')");
    await copyBtn.click();
    await page.waitForTimeout(800);
  });

  test("Mobile 390x844 & Reduced Motion Walkthrough", async ({ page }) => {
    test.setTimeout(120000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    // Open mobile menu
    const menuToggle = page.locator("button[aria-controls='mobile-nav-panel']");
    await menuToggle.click();
    await page.waitForTimeout(400);

    // Navigate to /about
    await page.click("#mobile-nav-panel a[href='/about']");
    await page.waitForURL("**/about");
    await page.waitForTimeout(600);

    // Navigate to /contact
    await page.goto("/contact", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
  });
});
