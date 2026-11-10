import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, MessageCircle, X, Send, Loader2, CheckCircle2 } from "lucide-react";
import { collectives, type Product } from "@/lib/data";
import { priceUSD, WAGE_FLOOR_INR } from "@/lib/pricing";
import { formatProductStatus } from "@/lib/formatters";

const price = (p: Product) => priceUSD(p.materials, p.hours, WAGE_FLOOR_INR, p.margin);
const post = (url: string, body: unknown) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => r.json());

export function BuyerStorefront({
  products,
  onSold,
}: {
  products: Product[];
  onSold: (p: Product, usd: number) => void;
}) {
  const { t } = useTranslation();
  const visible = products.filter((p) => p.status !== "Pending_Review");
  const [invoiceFor, setInvoiceFor] = useState<Product | null>(null);
  const [paying, setPaying] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const checkout = async (p: Product) => {
    setPaying(p.id);
    const o = await post("/api/paypal/create-order", { productId: p.id, amount: price(p) });
    setPaying(null);
    onSold(p, price(p));
    setToast(t("storefront.paidToast", { orderId: o.id }));
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-3xl text-foreground">{t("storefront.headline")}</h2>
        <p className="text-muted-foreground">{t("storefront.subheadline")}</p>
      </div>

      {visible.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-card p-12 text-center text-muted-foreground">
          {t("storefront.emptyState")}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => {
          const col = collectives.find((c) => c.id === p.collectiveId);
          return (
            <div
              key={p.id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-card"
            >
              <div className="relative">
                <img src={p.image} alt={p.title} className="aspect-[4/3] w-full object-cover" />
                {p.status === "Sold" && (
                  <span className="absolute start-3 top-3 rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background">
                    {formatProductStatus(p.status, t)}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs uppercase tracking-wider text-terracotta">{p.craft}</p>
                <p className="font-semibold text-foreground">{p.title}</p>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{p.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("storefront.byMaker", { maker: p.maker, collective: col?.name })}
                </p>
                <p className="mt-3 font-display text-2xl text-foreground">
                  ${price(p).toFixed(2)}
                </p>
                <button
                  disabled={p.status === "Sold" || paying === p.id}
                  onClick={() => checkout(p)}
                  aria-label={t("storefront.payWithPayPal")}
                  className="mt-3 flex items-center justify-center gap-2 rounded-full bg-paypal py-2.5 text-sm font-bold text-paypal-foreground disabled:opacity-40 hover:opacity-95 transition-opacity"
                >
                  {paying === p.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span className="italic">Pay</span>
                      <span className="-ms-1 italic text-paypal-accent">Pal</span> Checkout
                    </>
                  )}
                </button>
                <button
                  onClick={() => setInvoiceFor(p)}
                  className="mt-2 flex items-center justify-center gap-1 rounded-full border border-slate-200 py-2 text-sm font-semibold hover:bg-muted/50 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  {t("storefront.requestInvoice")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {invoiceFor && <InvoiceModal p={invoiceFor} onClose={() => setInvoiceFor(null)} />}
      <Assistant products={visible} />

      {toast && (
        <div className="fixed bottom-6 start-1/2 z-50 flex -translate-x-1/2 rtl:translate-x-1/2 items-center gap-2 rounded-full bg-success px-4 py-2 text-sm font-semibold text-success-foreground shadow-lg">
          <CheckCircle2 className="h-4 w-4" />
          {toast}
        </div>
      )}
    </div>
  );
}

function InvoiceModal({ p, onClose }: { p: Product; onClose: () => void }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [qty, setQty] = useState(10);
  const [notes, setNotes] = useState("");
  const [res, setRes] = useState<{ id: string; total: { value: string } } | null>(null);
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setBusy(true);
    setRes(
      await post("/api/paypal/create-invoice", {
        email,
        productId: p.id,
        quantity: qty,
        notes,
        unit: price(p),
      })
    );
    setBusy(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-foreground">{t("storefront.customInvoiceTitle")}</p>
            <p className="text-sm text-muted-foreground">{p.title}</p>
          </div>
          <button onClick={onClose} aria-label={t("common.close")}>
            <X className="h-5 w-5" />
          </button>
        </div>
        {res ? (
          <div className="mt-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
            <p className="mt-2 font-semibold">
              {t("storefront.invoiceSentTitle", { id: res.id })}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("storefront.invoiceSentSubtitle", { total: res.total.value })}
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <input
              type="email"
              placeholder={t("storefront.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-foreground bg-background"
            />
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-foreground bg-background"
            />
            <textarea
              placeholder={t("storefront.notesPlaceholder")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-foreground bg-background"
              rows={3}
            />
            <p className="text-sm">
              {t("storefront.estimatedTotal")}{" "}
              <b>${(price(p) * qty).toFixed(2)}</b>{" "}
              <span className="text-muted-foreground">
                {t("storefront.calculationBreakdown", {
                  unitPrice: price(p).toFixed(2),
                  qty,
                })}
              </span>
            </p>
            <button
              disabled={!email || busy}
              onClick={send}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {busy ? t("storefront.sending") : t("storefront.sendInvoice")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function answer(q: string, products: Product[], t: (k: string, opts?: any) => string) {
  const s = q.toLowerCase();
  if (/(discount|cheaper|lower|negotiat|deal|छूट|कम|सस्ता|descuento|rabais|rabatt|خصم)/i.test(s)) {
    return t("assistant.responses.discount");
  }
  const p = products.find((x) =>
    x.title
      .toLowerCase()
      .split(" ")
      .some((w) => w.length > 3 && s.includes(w))
  );
  if (p) {
    return t("assistant.responses.productDetail", {
      title: p.title,
      description: p.description,
      maker: p.maker,
      hours: p.hours,
      price: price(p).toFixed(2),
    });
  }
  if (/ship|deliver|पहुंच|भेज|envio|livraison|versand|شحن/i.test(s)) {
    return t("assistant.responses.shipping");
  }
  if (/wash|care|धो|सफाई|lavado|lavage|pflege|غسيل/i.test(s)) {
    return t("assistant.responses.care");
  }
  return t("assistant.responses.fallback");
}

function Assistant({ products }: { products: Product[] }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([
    { me: false, t: t("assistant.initialMessage") },
  ]);

  const ask = () => {
    if (!q.trim()) return;
    const userQuery = q;
    setQ("");
    setMsgs((m) => [
      ...m,
      { me: true, t: userQuery },
      { me: false, t: answer(userQuery, products, t) },
    ]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={t("assistant.toggleAria")}
        className="fixed bottom-6 end-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
      >
        {open ? <X /> : <MessageCircle />}
      </button>

      {open && (
        <div className="fixed bottom-24 end-6 z-40 flex h-96 w-80 flex-col rounded-xl border border-slate-200 bg-card shadow-2xl">
          <p className="border-b border-slate-200 p-3 text-sm font-semibold text-foreground">
            {t("assistant.title")}
          </p>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {msgs.map((m, i) => (
              <p
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  m.me
                    ? "ms-auto bg-primary text-primary-foreground text-end"
                    : "me-auto bg-muted text-start"
                }`}
              >
                {m.t}
              </p>
            ))}
          </div>
          <div className="flex gap-2 border-t border-slate-200 p-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder={t("assistant.inputPlaceholder")}
              className="flex-1 rounded-md border border-slate-200 px-2 text-sm text-foreground bg-background"
            />
            <button
              onClick={ask}
              aria-label={t("assistant.sendAria")}
              className="rounded-md bg-primary p-2 text-primary-foreground hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
