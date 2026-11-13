import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { LANGUAGES, type LanguageInfo } from "../src/i18n/languages";

const LOCALES_DIR = path.resolve(import.meta.dirname, "../src/locales");
const EN_PATH = path.join(LOCALES_DIR, "en/common.json");
const GLOSSARY_PATH = path.resolve(import.meta.dirname, "glossary.json");
const HASH_FILE = path.resolve(import.meta.dirname, ".translation-hash.json");

type JsonObject = { [key: string]: any };

function flattenKeys(obj: JsonObject, prefix = ""): Record<string, string> {
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

function unflattenKeys(flat: Record<string, string>): JsonObject {
  const result: JsonObject = {};
  for (const [flatKey, value] of Object.entries(flat)) {
    const parts = flatKey.split(".");
    let curr = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!curr[part] || typeof curr[part] !== "object") {
        curr[part] = {};
      }
      curr = curr[part];
    }
    curr[parts[parts.length - 1]] = value;
  }
  return result;
}

function extractPlaceholders(str: string): string[] {
  const matches = str.match(/{{[^{}]+}}/g);
  return matches ? matches.sort() : [];
}

function validateTranslations(
  englishFlat: Record<string, string>,
  translatedFlat: Record<string, string>,
  langCode: string
): void {
  const missingKeys = Object.keys(englishFlat).filter((k) => !(k in translatedFlat));
  if (missingKeys.length > 0) {
    throw new Error(
      `[Validation Error] Locale '${langCode}' is missing ${missingKeys.length} keys:\n` +
        missingKeys.slice(0, 10).join("\n") +
        (missingKeys.length > 10 ? "\n..." : "")
    );
  }

  for (const [key, enVal] of Object.entries(englishFlat)) {
    const transVal = translatedFlat[key];
    if (typeof transVal !== "string" || transVal.trim() === "") {
      throw new Error(`[Validation Error] Locale '${langCode}' key '${key}' is empty or invalid.`);
    }

    const enPlaceholders = extractPlaceholders(enVal);
    const transPlaceholders = extractPlaceholders(transVal);
    if (enPlaceholders.join(",") !== transPlaceholders.join(",")) {
      throw new Error(
        `[Validation Error] Locale '${langCode}' key '${key}' placeholder mismatch.\nExpected: ${enPlaceholders.join(", ")}\nGot: ${transPlaceholders.join(", ")}`
      );
    }
  }
}

async function translateWithGemini(
  texts: Record<string, string>,
  targetLang: LanguageInfo,
  glossary: string[],
  apiKey: string
): Promise<Record<string, string>> {
  const prompt = `You are a professional localization expert.
Translate the following key-value JSON dictionary from English into ${targetLang.name} (${targetLang.nativeName}).
Strict rules:
1. Return ONLY valid JSON mapping the exact same keys to translated strings. No markdown codeblocks, no commentary.
2. PRESERVE all placeholder tokens like {{count}}, {{materials}}, {{hours}}, {{price}}, {{maker}}, etc. exactly as written.
3. Protected terms that MUST NEVER be translated or transliterated: ${glossary.join(", ")}.
4. Natural tone appropriate for ${targetLang.name} speakers.
5. Do not leave any string empty.

JSON to translate:
${JSON.stringify(texts, null, 2)}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini API error ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Gemini returned empty response.");
  return JSON.parse(rawText);
}

async function main() {
  const enSource: JsonObject = JSON.parse(fs.readFileSync(EN_PATH, "utf-8"));
  const glossaryData = JSON.parse(fs.readFileSync(GLOSSARY_PATH, "utf-8"));
  const glossary: string[] = glossaryData.protectedTerms || [];

  const enFlat = flattenKeys(enSource);
  const currentHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(enFlat))
    .digest("hex");

  let hashes: Record<string, string> = {};
  if (fs.existsSync(HASH_FILE)) {
    try {
      hashes = JSON.parse(fs.readFileSync(HASH_FILE, "utf-8"));
    } catch {}
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const targetLanguages = LANGUAGES.filter((l) => l.code !== "en" && l.code !== "en-XA");

  console.log(`Starting translation pipeline for ${targetLanguages.length} languages...`);

  for (const lang of targetLanguages) {
    const localeDir = path.join(LOCALES_DIR, lang.code);
    const localeFile = path.join(localeDir, "common.json");

    if (fs.existsSync(localeFile) && hashes[lang.code] === currentHash) {
      console.log(`✓ [${lang.code}] Up to date.`);
      continue;
    }

    let existingFlat: Record<string, string> = {};
    if (fs.existsSync(localeFile)) {
      try {
        existingFlat = flattenKeys(JSON.parse(fs.readFileSync(localeFile, "utf-8")));
      } catch {}
    }

    const missingKeys: Record<string, string> = {};
    for (const [k, v] of Object.entries(enFlat)) {
      if (!existingFlat[k]) {
        missingKeys[k] = v;
      }
    }

    if (Object.keys(missingKeys).length === 0) {
      // Validate existing file
      validateTranslations(enFlat, existingFlat, lang.code);
      hashes[lang.code] = currentHash;
      console.log(`✓ [${lang.code}] Verified all keys present.`);
      continue;
    }

    console.log(`Translating ${Object.keys(missingKeys).length} keys for [${lang.code}] (${lang.name})...`);

    if (!geminiKey) {
      console.warn(
        `⚠ No GEMINI_API_KEY found. Skipping remote generation for [${lang.code}]. Run with GEMINI_API_KEY set to translate new keys.`
      );
      continue;
    }

    const newlyTranslated = await translateWithGemini(missingKeys, lang, glossary, geminiKey);
    const merged = { ...existingFlat, ...newlyTranslated };

    validateTranslations(enFlat, merged, lang.code);

    if (!fs.existsSync(localeDir)) fs.mkdirSync(localeDir, { recursive: true });
    fs.writeFileSync(localeFile, JSON.stringify(unflattenKeys(merged), null, 2) + "\n");
    hashes[lang.code] = currentHash;
    console.log(`✓ [${lang.code}] Successfully generated and saved.`);
  }

  fs.writeFileSync(HASH_FILE, JSON.stringify(hashes, null, 2) + "\n");
  console.log("Translation pipeline finished.");
}

main().catch((err) => {
  console.error("Translation script failed:", err);
  process.exit(1);
});

