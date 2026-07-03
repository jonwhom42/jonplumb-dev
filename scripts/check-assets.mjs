// Warns (does not fail) when Jon's binary assets are missing before a build.
// These are handled gracefully at runtime, but a missing resume must not be
// shared on the live URL — hence the loud reminder.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const assets = [
  {
    path: "public/resume.pdf",
    warn: "⚠ public/resume.pdf missing — do not share the live URL until it ships.",
  },
  {
    path: "public/nitruz-demo.mp4",
    warn: "⚠ public/nitruz-demo.mp4 missing — the Nitruz demo will show the request fallback.",
  },
];

let missing = 0;
for (const a of assets) {
  if (!existsSync(join(root, a.path))) {
    console.warn(`\x1b[33m${a.warn}\x1b[0m`);
    missing++;
  }
}

if (missing === 0) {
  console.log("\x1b[32m✓ all optional binary assets present\x1b[0m");
}

// Never fail the build — these are Jon's TODOs, not blockers.
process.exit(0);
