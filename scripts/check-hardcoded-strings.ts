import fs from "node:fs";
import path from "node:path";

const SRC_DIR = path.resolve(import.meta.dirname, "../src/components/didi");

// Whitelist of allowed strings (brands, symbols, CSS/style tokens, numbers)
const ALLOWED_LITERALS = new Set([
  "Didi",
  "Direct",
  ".",
  "·",
  "₹",
  "$",
  "%",
  "USD",
  "INR",
  "PayPal",
  "Pay",
  "Pal",
  "Checkout",
  "Kamla Devi",
  "404",
  "0:00",
]);

function checkFile(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const warnings: string[] = [];

  // Look for return (...) JSX bodies
  const returnMatch = content.match(/return\s*\([\s\S]*?\);/g);
  if (!returnMatch) return warnings;

  for (const jsxBlock of returnMatch) {
    const textPattern = />([^<>{}\n]+)</g;
    let match: RegExpExecArray | null;

    while ((match = textPattern.exec(jsxBlock)) !== null) {
      const raw = match[1].trim();
      if (!raw) continue;
      if (/^[0-9.:,₹$%+\-×/·—–\s()]+$/.test(raw)) continue;
      if (ALLOWED_LITERALS.has(raw)) continue;

      warnings.push(`[${path.basename(filePath)}] Potential raw JSX string: "${raw}"`);
    }
  }

  return warnings;
}

function main() {
  console.log("Auditing JSX files for un-extracted string literals...");
  const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith(".tsx"));
  const allWarnings: string[] = [];

  for (const f of files) {
    const p = path.join(SRC_DIR, f);
    allWarnings.push(...checkFile(p));
  }

  if (allWarnings.length > 0) {
    console.warn(`Found ${allWarnings.length} potential hardcoded string occurrences:\n`);
    for (const w of allWarnings) {
      console.warn(`  ⚠ ${w}`);
    }
  } else {
    console.log("✓ No untranslated raw string literals found in components!");
  }
}

main();
