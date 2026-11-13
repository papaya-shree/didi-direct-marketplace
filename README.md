# Didi Direct Marketplace

**Didi Direct** is a cross-border, fair-wage commerce platform connecting rural Indian women artisan collectives directly to international buyers through voice-first listings, transparent deterministic pricing, PayPal checkout, and instant UPI federation settlements.

Built with **React 19**, **Vite**, **TanStack Router**, **Tailwind CSS v4**, and **Bun**, the platform supports **57 languages** with full RTL layout capabilities, on-demand locale chunking, and speech-to-text integration.

---

## Key Features & Core Views

### 1. Artisan Voice (`[Artisan Voice]`)
- **Voice-First Listings ("Bolo")**: Tailored for low-literacy artisans. Uses the browser Web Speech API mapped to regional BCP-47 speech recognition codes (e.g., `hi-IN`, `ta-IN`, `bn-IN`, `mr-IN`).
- **Graceful Fallback**: For languages without Web Speech API browser engines, clearly alerts the artisan and presents a lightweight text description fallback.
- **Client-Side Image Optimization**: Automatically downsizes uploaded craft photos to lightweight formats using HTML Canvas before upload.
- **Recent Voice Memos**: Displays local voice recording history with timestamps and durations.

### 2. Leader Review (`[Leader Review]`)
- **Collective Approval Queue**: Designated collective leaders review artisan drafts, fine-tune descriptions, and verify material costs and labor hours.
- **Deterministic Pricing**: Enforces fair wages mathematically without hidden markups:
  $$\text{USD Price} = \frac{\text{Materials (INR)} + (\text{Hours} \times \text{Wage Floor INR})}{1 - \text{Margin}} \times \text{FX}$$
- **Pricing Modal**: Real-time formula recalculation with strict margin boundaries ($0 \le \text{margin} < 1$).

### 3. Buyer Storefront (`[Buyer Storefront]`)
- **Global Catalog**: Displays live handcrafted goods categorized by craft (Handloom, Terracotta, Kantha, Embroidery, etc.) and attributed to specific makers and collectives.
- **PayPal Checkout & Invoicing**: Express checkout order creation and custom bulk invoicing requests.
- **Multilingual AI Assistant**: An interactive chatbot answering buyer inquiries on shipping, natural dye care, and craft heritage in the active language, while strictly preserving fixed pricing formulas.

### 4. Federation Ledger (`[Federation Ledger]`)
- **Transparent Cross-Border Flow**: Tracks international PayPal USD receipts $\rightarrow$ SBI Federation account conversion $\rightarrow$ instant UPI disbursements to artisans.
- **Simulate Instant UPI Settlement**: Simulates automated micro-batch UPI payouts and records cryptographically mocked transaction hashes.

---

## Comprehensive Internationalization (i18n)

The site is localized using `i18next`, `react-i18next`, and `i18next-browser-languagedetector` with **57 locales** categorized into three strategic tiers:

- **Tier 1 (24 Indian Languages)**: Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Nepali, Sindhi, Konkani, Dogri, Manipuri (Meitei), Sanskrit, Santali, Kashmiri, Bodo, Bhojpuri, and Mizo.
- **Tier 2 (17 Global Buyer Languages)**: English (Source of Truth), Spanish, French, German, Portuguese, Italian, Dutch, Arabic, Japanese, Korean, Chinese (Simplified), Chinese (Traditional), Russian, Turkish, Indonesian, Thai, and Vietnamese.
- **Tier 3 (16 Long-Tail & Testing Languages)**: Polish, Swedish, Greek, Czech, Romanian, Hungarian, Hebrew, Persian, Swahili, Finnish, Danish, Norwegian, Ukrainian, Malay, Filipino (Tagalog), and `en-XA` (Pseudo-locale).

Detailed language metadata, script directions, and review statuses are documented in [LOCALES.md](file:///Users/amishkasrivastava/Desktop/didi_marketplace/LOCALES.md).

### Architecture Highlights:
- **Zero Bundle Bloat**: All 57 locale files are dynamically loaded on-demand via Vite's dynamic imports. Each language chunk is only **~5.5 kB** (2.7 kB gzipped).
- **RTL Support**: Automatic `dir="rtl"` switching for Arabic, Urdu, Sindhi, Kashmiri, Persian, and Hebrew with Tailwind logical properties (`start-`, `end-`, `ms-`, `me-`, `ps-`, `pe-`).
- **No Tofu Fonts**: Google Noto Sans fonts loaded with `unicode-range` for Devanagari, Bengali, Tamil, Telugu, Gujarati, Gurmukhi, Kannada, Malayalam, Oriya, Arabic, and CJK.
- **Protected Glossary**: Currency (`USD`, `INR`), payment rails (`PayPal`, `UPI`), brands (`Didi Direct`), and maker names are protected against mistranslation.
- **Incremental Translation Script**: `scripts/translate.ts` uses SHA-256 hashing to translate only new or updated keys via Gemini API or Google Cloud Translation.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended) or [Bun](https://bun.sh/) (v1.1+)

### Installation
```bash
git clone https://github.com/papaya-shree/didi-direct-marketplace.git
cd didi-direct-marketplace
bun install
# or: npm install
```

### Development
```bash
bun dev
# or: npm run dev
```

### Testing
Run the automated test suite (including the 123 i18n quality gate tests):
```bash
bun test
# or: npm test
```

### Production Build
```bash
bun run build
# or: npm run build
```

---

## Translation Pipeline

To generate or update translations incrementally:
1. Configure your API key in `.env` (see `.env.example`):
   ```bash
   cp .env.example .env
   # Set GEMINI_API_KEY=your_key
   ```
2. Run the translation script:
   ```bash
   bun scripts/translate.ts
   ```
3. Audit JSX files for hardcoded string literals:
   ```bash
   bun scripts/check-hardcoded-strings.ts
   ```

---

## License

MIT
