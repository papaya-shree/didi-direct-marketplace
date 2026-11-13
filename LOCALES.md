# Didi Direct Marketplace — Supported Locales

This document catalogs all languages supported by Didi Direct Marketplace, categorized across three strategic tiers and verified against the Google Cloud Translation supported languages directory.

> [!NOTE]
> **Source of Truth**: English (`en`) is the canonical source of truth located in `src/locales/en/common.json`.
> **Tier 3 Disclaimer**: All Tier 3 languages are currently machine-translated without manual human post-editing.

---

## Language Tiers

### Tier 1 — Indian Regional & Scheduled Languages (24)
Includes the 22 scheduled languages of the Eighth Schedule to the Constitution of India supported by Google Translation, plus significant regional languages.

| Code | English Name | Native Name | Script Direction | Speech-to-Text Support | Review Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `hi` | Hindi | हिन्दी | LTR | `hi-IN` | Human-reviewed |
| `bn` | Bengali | বাংলা | LTR | `bn-IN` | Machine-translated |
| `te` | Telugu | తెలుగు | LTR | `te-IN` | Machine-translated |
| `mr` | Marathi | मराठी | LTR | `mr-IN` | Machine-translated |
| `ta` | Tamil | தமிழ் | LTR | `ta-IN` | Machine-translated |
| `ur` | Urdu | اردو | RTL | `ur-IN` | Machine-translated |
| `gu` | Gujarati | ગુજરાતી | LTR | `gu-IN` | Machine-translated |
| `kn` | Kannada | ಕನ್ನಡ | LTR | `kn-IN` | Machine-translated |
| `or` | Odia | ଓଡ଼ିଆ | LTR | Text fallback | Machine-translated |
| `ml` | Malayalam | മലയാളം | LTR | `ml-IN` | Machine-translated |
| `pa` | Punjabi | ਪੰਜਾਬੀ | LTR | `pa-Guru-IN` | Machine-translated |
| `as` | Assamese | অসমীয়া | LTR | Text fallback | Machine-translated |
| `mai` | Maithili | मैथिली | LTR | Text fallback | Machine-translated |
| `ne` | Nepali | नेपाली | LTR | `ne-NP` | Machine-translated |
| `sd` | Sindhi | سنڌي | RTL | Text fallback | Machine-translated |
| `gom` | Konkani | कोंकणी | LTR | Text fallback | Machine-translated |
| `doi` | Dogri | डोगरी | LTR | Text fallback | Machine-translated |
| `mni` | Manipuri (Meitei) | ꯃꯤꯇꯩꯂꯣꯟ | LTR | Text fallback | Machine-translated |
| `sa` | Sanskrit | संस्कृतम् | LTR | Text fallback | Machine-translated |
| `sat` | Santali | ᱥᱟᱱᱛᱟᱲᱤ | LTR | Text fallback | Machine-translated |
| `ks` | Kashmiri | کٲشُر | RTL | Text fallback | Machine-translated |
| `brx` | Bodo | बड़ो | LTR | Text fallback | Machine-translated |
| `bho` | Bhojpuri | भोजपुरी | LTR | Text fallback | Machine-translated |
| `lus` | Mizo | Mizo ṭawng | LTR | Text fallback | Machine-translated |

---

### Tier 2 — Global Buyer Languages (17)
Major languages spoken by international buyers across North America, Europe, East Asia, Southeast Asia, Latin America, and the Middle East.

| Code | English Name | Native Name | Script Direction | Speech-to-Text Support | Review Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `en` | English | English | LTR | `en-US` | Source of truth |
| `es` | Spanish | Español | LTR | `es-ES` | Human-reviewed |
| `fr` | French | Français | LTR | `fr-FR` | Human-reviewed |
| `de` | German | Deutsch | LTR | `de-DE` | Human-reviewed |
| `pt` | Portuguese | Português | LTR | `pt-BR` | Machine-translated |
| `it` | Italian | Italiano | LTR | `it-IT` | Machine-translated |
| `nl` | Dutch | Nederlands | LTR | `nl-NL` | Machine-translated |
| `ar` | Arabic | العربية | RTL | `ar-SA` | Human-reviewed |
| `ja` | Japanese | 日本語 | LTR | `ja-JP` | Machine-translated |
| `ko` | Korean | 한국어 | LTR | `ko-KR` | Machine-translated |
| `zh-CN` | Chinese (Simplified) | 简体中文 | LTR | `zh-CN` | Machine-translated |
| `zh-TW` | Chinese (Traditional) | 繁體中文 | LTR | `zh-TW` | Machine-translated |
| `ru` | Russian | Русский | LTR | `ru-RU` | Machine-translated |
| `tr` | Turkish | Türkçe | LTR | `tr-TR` | Machine-translated |
| `id` | Indonesian | Bahasa Indonesia | LTR | `id-ID` | Machine-translated |
| `th` | Thai | ไทย | LTR | `th-TH` | Machine-translated |
| `vi` | Vietnamese | Tiếng Việt | LTR | `vi-VN` | Machine-translated |

---

### Tier 3 — Long-Tail Languages & Quality Testing (16)
Additional Google Cloud Translation supported languages and testing pseudo-locales.

| Code | English Name | Native Name | Script Direction | Review Status | Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `pl` | Polish | Polski | LTR | Machine-translated | Unreviewed |
| `sv` | Swedish | Svenska | LTR | Machine-translated | Unreviewed |
| `el` | Greek | Ελληνικά | LTR | Machine-translated | Unreviewed |
| `cs` | Czech | Čeština | LTR | Machine-translated | Unreviewed |
| `ro` | Romanian | Română | LTR | Machine-translated | Unreviewed |
| `hu` | Hungarian | Magyar | LTR | Machine-translated | Unreviewed |
| `he` | Hebrew | עברית | RTL | Machine-translated | Unreviewed |
| `fa` | Persian | فارسی | RTL | Machine-translated | Unreviewed |
| `sw` | Swahili | Kiswahili | LTR | Machine-translated | Unreviewed |
| `fi` | Finnish | Suomi | LTR | Machine-translated | Unreviewed |
| `da` | Danish | Dansk | LTR | Machine-translated | Unreviewed |
| `no` | Norwegian | Norsk | LTR | Machine-translated | Unreviewed |
| `uk` | Ukrainian | Українська | LTR | Machine-translated | Unreviewed |
| `ms` | Malay | Bahasa Melayu | LTR | Machine-translated | Unreviewed |
| `fil` | Filipino (Tagalog) | Tagalog | LTR | Machine-translated | Unreviewed |
| `en-XA` | Pseudo-locale | [!!! Ƥşéûḓô-ľôćáľé !!!] | LTR | Synthetic test | Used for i18n testing & overflow checks |

---

## How to Add a New Language

1. **Register the language** in `src/i18n/languages.ts`:
   ```ts
   {
     code: "nl",
     name: "Dutch",
     nativeName: "Nederlands",
     tier: 2,
     dir: "ltr",
     speechCode: "nl-NL", // or null if unsupported by Web Speech API
     reviewed: false,
   }
   ```
2. **Generate or create the translation file**:
   - Run `bun scripts/translate.ts` with `GEMINI_API_KEY` set, or
   - Manually create `src/locales/<code >/common.json` with all keys from `src/locales/en/common.json`.
3. **Validate keys and placeholders**:
   ```bash
   bun test
   ```
4. **Update `LOCALES.md`** to document the addition, script direction, tier, and review status.

