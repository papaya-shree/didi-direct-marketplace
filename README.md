# Didi Direct Marketplace

Act as a Principal Full-Stack Engineer. Build a responsive Next.js/React (Tailwind CSS, Lucide icons) MVP SPA for "Didi Direct"—a cross-border commerce app connecting Indian women artisans to global buyers via Voice AI and PayPal. Include a top role-switcher tab across 4 views: `[Artisan Voice] | [Leader Review] | [Buyer Storefront] | [Federation Ledger]`.

### 1. Design System

- Palette: Primary `#0F172A` (Navy), Accent `#C2410C` (Terracotta), Background `#F8FAFC` (Off-White), Card `#FFFFFF` (White), Success `#059669` (Emerald), Text `#1E293B` (Dark Slate).

- Style: Ultra-minimalist, high contrast, clean `border-slate-200` lines, zero shadow clutter.

### 2. Core Views

- View A (Artisan Voice Entry): Mobile bottom-sheet with photo upload and Hindi voice record button ("Bolo"). Simulates STT/Vision processing to output a draft listing.

- View B (Leader Review): Approval queue with a deterministic pricing card ($USD = \frac{\text{Materials} + (\text{Hours} \times \text{Wage Floor})}{1 - \text{Margin}} \times \text{FX}$) and buttons to Approve/Publish, Edit, or Reject.

- View C (Buyer Storefront & Chat): English product grid with PayPal Express Checkout button, a "Request Custom Invoice" modal (PayPal Invoicing API mock), and an AI Assistant widget that answers product questions without altering prices.

- View D (Federation Ledger): USD-to-INR bank withdrawal overview, settlement table (Item, USD Received, INR Withdrawn, Maker, Share, Status), and a "Simulate Instant UPI Settlement" button that logs mock transaction hashes.

### 3. API Route Mocks & Data Models

- Implement mock APIs: `/api/voice-listing`, `/api/paypal/create-order`, `/api/paypal/create-invoice`, `/api/ledger/settle`.

- Pre-load mock data: 3 Women Collectives, 4 Products across states (`Pending_Review`, `Live`, `Sold`), and 2 historical USD $\rightarrow$ INR $\rightarrow$ UPI payout records.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bff5b32a-562a-42b7-90e9-42a32436e982).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
