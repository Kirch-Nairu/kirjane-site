import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const base = "build/client";
const routes = ["/", "/services", "/projects", "/about", "/process", "/contact"];
let failed = false;
for (const route of routes) {
  const file = join(base, route === "/" ? "index.html" : route.slice(1), "index.html");
  if (!existsSync(file)) {
    console.error("MISSING:", file);
    failed = true;
    continue;
  }
  const html = readFileSync(file, "utf8");
  const checks = [
    ["server-rendered content", /<h1\b/i.test(html)],
    ["HTML document", /<html\b/i.test(html)],
    ["page-specific metadata", /<title\b/i.test(html)],
  ];
  for (const [label, ok] of checks) if (!ok) {
    console.error("FAILED", route, label);
    failed = true;
  }
  if (!checks.some(([, ok]) => !ok)) console.log("PASS", route, file);
}
if (failed) process.exitCode = 1;
