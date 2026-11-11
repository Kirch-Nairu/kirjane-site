import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const output = "build/client";
const routes = ["", "services", "projects", "about", "process", "contact"];
let failures = 0;
for (const route of routes) {
  const options = route
    ? [join(output, route, "index.html"), join(output, route + ".html")]
    : [join(output, "index.html")];
  const found = options.find(existsSync);
  if (!found) {
    console.error("MISSING pre-rendered route:", "/" + route);
    failures++;
    continue;
  }
  const html = readFileSync(found, "utf8");
  if (!html.includes("<h1")) {
    console.error("MISSING HTML H1:", "/" + route, found);
    failures++;
  } else {
    console.log("OK:", "/" + route, found);
  }
}
// The contact form is deliberately non-submittable before company approval.
const contactHtmlPath = [join(output, "contact", "index.html"), join(output, "contact.html")].find(existsSync);
if (contactHtmlPath) {
  const contactHtml = readFileSync(contactHtmlPath, "utf8");
  const fields = ["full-name", "email", "organization", "inquiry-type", "details"];
  for (const field of fields) {
    if (!contactHtml.includes(`name="${field}"`)) {
      console.error("MISSING contact field:", field);
      failures++;
    }
  }
  if (!/<fieldset[^>]*disabled/.test(contactHtml)) {
    console.error("SAFETY GATE: contact fieldset must remain disabled before approval.");
    failures++;
  }
}
if (failures) process.exit(1);
console.log("Verified six HTML route artifacts.");
