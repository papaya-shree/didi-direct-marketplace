import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, ClipboardCheck, Store, Landmark } from "lucide-react";
import { initialProducts, initialSettlements, type Product, type Settlement } from "@/lib/data";
import { makerShareINR } from "@/lib/pricing";
import { ArtisanVoice } from "@/components/didi/ArtisanVoice";
import { LeaderReview } from "@/components/didi/LeaderReview";
import { BuyerStorefront } from "@/components/didi/BuyerStorefront";
import { FederationLedger } from "@/components/didi/FederationLedger";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Didi Direct — Handmade by Indian women artisans" },
      { name: "description", content: "Voice-first listings, fair deterministic pricing, PayPal checkout and instant UPI payouts for women artisan collectives." },
      { property: "og:title", content: "Didi Direct — Handmade by Indian women artisans" },
      { property: "og:description", content: "Voice-first listings, fair pricing, PayPal checkout and instant UPI payouts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tabs = [
  { id: "artisan", label: "Artisan Voice", icon: Mic },
  { id: "leader", label: "Leader Review", icon: ClipboardCheck },
  { id: "buyer", label: "Buyer Storefront", icon: Store },
  { id: "ledger", label: "Federation Ledger", icon: Landmark },
] as const;

function Index() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("artisan");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [settlements, setSettlements] = useState<Settlement[]>(initialSettlements);
  const pending = products.filter((p) => p.status === "Pending_Review").length;

  const update = (p: Product) => setProducts((ps) => ps.map((x) => (x.id === p.id ? p : x)));
  const onSold = (p: Product, usd: number) => {
    update({ ...p, status: "Sold" });
    setSettlements((s) => [{ id: `s${Date.now()}`, item: p.title, usd, inr: makerShareINR(usd, 0.8), maker: p.maker, share: 0.8, status: "Pending" }, ...s]);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-xl text-primary">Didi<span className="text-terracotta">.</span>Direct</p>
          <nav className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold ${tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"}`}>
                <Icon className="h-4 w-4" />{label}
                {id === "leader" && pending > 0 && <span className="rounded-full bg-terracotta px-1.5 text-xs text-primary-foreground">{pending}</span>}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        {tab === "artisan" && <ArtisanVoice onSubmit={(p) => setProducts((ps) => [p, ...ps])} />}
        {tab === "leader" && <LeaderReview products={products} update={update} remove={(id) => setProducts((ps) => ps.filter((p) => p.id !== id))} />}
        {tab === "buyer" && <BuyerStorefront products={products} onSold={onSold} />}
        {tab === "ledger" && <FederationLedger rows={settlements} setRows={setSettlements} />}
      </main>
    </div>
  );
}
