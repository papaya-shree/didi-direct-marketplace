import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Mic, ClipboardCheck, Store, Landmark, RotateCcw } from "lucide-react";

const STORE_KEY = "didi-direct-state-v1";
import { initialProducts, initialSettlements, type Product, type Settlement } from "@/lib/data";
import { makerShareINR } from "@/lib/pricing";
import { ArtisanVoice } from "@/components/didi/ArtisanVoice";
import { LeaderReview } from "@/components/didi/LeaderReview";
import { BuyerStorefront } from "@/components/didi/BuyerStorefront";
import { FederationLedger } from "@/components/didi/FederationLedger";
import { LanguageSwitcher } from "@/components/didi/LanguageSwitcher";

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

type TabId = "artisan" | "leader" | "buyer" | "ledger";

function Index() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabId>("artisan");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [settlements, setSettlements] = useState<Settlement[]>(initialSettlements);
  const [loaded, setLoaded] = useState(false);

  const tabs: { id: TabId; label: string; icon: typeof Mic }[] = [
    { id: "artisan", label: t("roles.artisan"), icon: Mic },
    { id: "leader", label: t("roles.leader"), icon: ClipboardCheck },
    { id: "buyer", label: t("roles.buyer"), icon: Store },
    { id: "ledger", label: t("roles.ledger"), icon: Landmark },
  ];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (Array.isArray(d.products)) setProducts(d.products);
        if (Array.isArray(d.settlements)) setSettlements(d.settlements);
      }
    } catch { /* ignore corrupt data */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORE_KEY, JSON.stringify({ products, settlements }));
  }, [loaded, products, settlements]);

  const resetDemo = () => {
    if (!confirm(t("common.resetConfirm"))) return;
    localStorage.removeItem(STORE_KEY);
    setProducts(initialProducts);
    setSettlements(initialSettlements);
  };
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
          <div className="flex items-center justify-between gap-4">
            <p className="font-display text-xl text-foreground">
              {t("brand.prefix")}<span className="text-terracotta">.</span>{t("brand.suffix")}
            </p>
            <div className="md:hidden">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 p-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                    tab === id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  {id === "leader" && pending > 0 && (
                    <span className="rounded-full bg-terracotta px-1.5 text-xs text-primary-foreground">
                      {pending}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        {tab === "artisan" && <ArtisanVoice onSubmit={(p) => setProducts((ps) => [p, ...ps])} />}
        {tab === "leader" && <LeaderReview products={products} update={update} remove={(id) => setProducts((ps) => ps.filter((p) => p.id !== id))} />}
        {tab === "buyer" && <BuyerStorefront products={products} onSold={onSold} />}
        {tab === "ledger" && <FederationLedger rows={settlements} setRows={setSettlements} />}
      </main>
      <footer className="mx-auto flex max-w-6xl justify-end px-4 pb-8">
        <button onClick={resetDemo} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-3 w-3" />{t("common.resetDemoData")}
        </button>
      </footer>
    </div>
  );
}
