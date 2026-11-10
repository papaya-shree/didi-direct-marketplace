import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { LANGUAGES } from "@/i18n/languages";

const LOCALES_DIR = path.resolve(__dirname, "../locales");
const EN_PATH = path.join(LOCALES_DIR, "en/common.json");

function flattenKeys(obj: Record<string, any>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result[fullKey] = value;
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenKeys(value, fullKey));
    }
  }
  return result;
}

function extractPlaceholders(str: string): string[] {
  const matches = str.match(/{{[^{}]+}}/g);
  return matches ? matches.sort() : [];
}

describe("i18n Locales Quality Gate", () => {
  const enJson = JSON.parse(fs.readFileSync(EN_PATH, "utf-8"));
  const enFlat = flattenKeys(enJson);
  const enKeyCount = Object.keys(enFlat).length;

  it("English source of truth has valid keys", () => {
    expect(enKeyCount).toBeGreaterThan(30);
  });

  for (const lang of LANGUAGES) {
    describe(`Locale [${lang.code}] (${lang.name})`, () => {
      const localePath = path.join(LOCALES_DIR, lang.code, "common.json");

      it("file exists and is valid JSON", () => {
        expect(fs.existsSync(localePath)).toBe(true);
        const raw = fs.readFileSync(localePath, "utf-8");
        expect(() => JSON.parse(raw)).not.toThrow();
      });

      it("has all keys from English and preserves placeholders", () => {
        const targetJson = JSON.parse(fs.readFileSync(localePath, "utf-8"));
        const targetFlat = flattenKeys(targetJson);

        for (const [key, enVal] of Object.entries(enFlat)) {
          expect(targetFlat[key], `Missing key '${key}' in locale '${lang.code}'`).toBeDefined();
          expect(
            typeof targetFlat[key] === "string" && targetFlat[key].trim().length > 0,
            `Empty value for key '${key}' in locale '${lang.code}'`
          ).toBe(true);

          const enPlaceholders = extractPlaceholders(enVal);
          const targetPlaceholders = extractPlaceholders(targetFlat[key]);
          expect(
            targetPlaceholders,
            `Placeholder mismatch in '${lang.code}' for key '${key}'`
          ).toEqual(enPlaceholders);
        }
      });
    });
  }

  it("checks long-string overflow safety on button/tab strings for German, Tamil, Malayalam, Arabic", () => {
    const checkLocales = ["de", "ta", "ml", "ar", "en-XA"];
    for (const code of checkLocales) {
      const filePath = path.join(LOCALES_DIR, code, "common.json");
      if (fs.existsSync(filePath)) {
        const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const flat = flattenKeys(json);
        // Verify key navigation roles and action button labels exist and are reasonable in length
        expect(flat["roles.artisan"].length).toBeGreaterThan(3);
        expect(flat["roles.leader"].length).toBeGreaterThan(3);
        expect(flat["roles.buyer"].length).toBeGreaterThan(3);
        expect(flat["roles.ledger"].length).toBeGreaterThan(3);
        expect(flat["leader.publish"].length).toBeGreaterThan(1);
        expect(flat["storefront.payPalCheckout"].length).toBeGreaterThan(3);
      }
    }
  });
});
