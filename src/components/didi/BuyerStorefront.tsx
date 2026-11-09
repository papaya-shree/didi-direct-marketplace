import { useState } from "react";
import { FileText, MessageCircle, X, Send, Loader2, CheckCircle2 } from "lucide-react";
import { collectives, type Product } from "@/lib/data";
import { priceUSD, WAGE_FLOOR_INR } from "@/lib/pricing";

const price = (p: Product) => priceUSD(p.materials, p.hours, WAGE_FLOOR_INR, p.margin);
const post = (url: string, body: unknown) => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.json());

export function BuyerStorefront({ products, onSold }: { products: Product[]; onSold: (p: Product, usd: number) => void }) {
  const visible = products.filter((p) => p.status !== "Pending_Review");
  const [invoiceFor, setInvoiceFor] = useState<Product | null>(null);
  const [paying, setPaying] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const checkout = async (p: Product) => {
    setPaying(p.id);
    const o = await post("/api/paypal/create-order", { productId: p.id, amount: price(p) });
    setPaying(null);
    onSold(p, price(p));
    setToast(`Paid · ${o.id}`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div>
      <div className="mb-6"><h2 className="font-display text-3xl text-primary">Handmade, direct from the maker.</h2><p className="text-muted-foreground">Every purchase pays a woman artisan in India within minutes.</p></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => {
          const col = collectives.find((c) => c.id === p.collectiveId);
          return (
            <div key={p.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-card">
              <div className="relative"><img src={p.image} alt={p.title} className="aspect-[4/3] w-full object-cover" />{p.status === "Sold" && <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">Sold</span>}</div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs uppercase tracking-wider text-terracotta">{p.craft}</p>
                <p className="font-semibold text-primary">{p.title}</p>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{p.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">By {p.maker} · {col?.name}</p>
                <p className="mt-3 font-display text-2xl text-primary">${price(p).toFixed(2)}</p>
                <button disabled={p.status === "Sold" || paying === p.id} onClick={() => checkout(p)} className="mt-3 flex items-center justify-center gap-2 rounded-full bg-[#FFC439] py-2.5 text-sm font-bold text-[#003087] disabled:opacity-40">
                  {paying === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span className="italic">Pay</span><span className="-ml-2 italic text-[#009CDE]">Pal</span> Checkout</>}
                </button>
                <button onClick={() => setInvoiceFor(p)} className="mt-2 flex items-center justify-center gap-1 rounded-full border border-slate-200 py-2 text-sm font-semibold"><FileText className="h-4 w-4" />Request Custom Invoice</button>
              </div>
            </div>
          );
        })}
      </div>
      {invoiceFor && <InvoiceModal p={invoiceFor} onClose={() => setInvoiceFor(null)} />}
      <Assistant products={visible} />
      {toast && <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-success px-4 py-2 text-sm font-semibold text-success-foreground"><CheckCircle2 className="h-4 w-4" />{toast}</div>}
    </div>
  );
}

function InvoiceModal({ p, onClose }: { p: Product; onClose: () => void }) {
  const [email, setEmail] = useState(""); const [qty, setQty] = useState(10); const [notes, setNotes] = useState("");
  const [res, setRes] = useState<{ id: string; total: { value: string } } | null>(null); const [busy, setBusy] = useState(false);
  const send = async () => { setBusy(true); setRes(await post("/api/paypal/create-invoice", { email, productId: p.id, quantity: qty, notes, unit: price(p) })); setBusy(false); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between"><div><p className="font-semibold text-primary">Custom invoice</p><p className="text-sm text-muted-foreground">{p.title}</p></div><button onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button></div>
        {res ? (
          <div className="mt-6 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-success" /><p className="mt-2 font-semibold">Invoice {res.id} sent</p><p className="text-sm text-muted-foreground">Total ${res.total.value} via PayPal Invoicing</p></div>
        ) : (
          <div className="mt-4 space-y-3">
            <input type="email" placeholder="buyer@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" />
            <textarea placeholder="Colours, sizes, delivery date…" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm" rows={3} />
            <p className="text-sm">Estimated total: <b>${(price(p) * qty).toFixed(2)}</b> <span className="text-muted-foreground">(${price(p).toFixed(2)} × {qty})</span></p>
            <button disabled={!email || busy} onClick={send} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{busy ? "Sending…" : "Send PayPal invoice"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function answer(q: string, products: Product[]) {
  const s = q.toLowerCase();
  if (/(discount|cheaper|lower|negotiat|deal)/.test(s)) return "Prices are set by a fixed fair-wage formula, so I can't change them. For bulk orders, try “Request Custom Invoice”.";
  const p = products.find((x) => x.title.toLowerCase().split(" ").some((w) => w.length > 3 && s.includes(w)));
  if (p) return `${p.title}: ${p.description} Made by ${p.maker} in about ${p.hours} hours. Price: $${price(p).toFixed(2)} (fixed).`;
  if (/ship|deliver/.test(s)) return "We ship worldwide from India, usually in 7–12 days.";
  if (/wash|care/.test(s)) return "Hand-wash cold with mild soap and dry in shade to keep natural dyes bright.";
  return "Ask me about any product, materials, care or shipping.";
}

function Assistant({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false); const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([{ me: false, t: "Hi! Ask me about any piece. I can't change prices." }]);
  const ask = () => { if (!q.trim()) return; setMsgs((m) => [...m, { me: true, t: q }, { me: false, t: answer(q, products) }]); setQ(""); };
  return (
    <>
      <button onClick={() => setOpen(!open)} aria-label="Assistant" className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-primary-foreground">{open ? <X /> : <MessageCircle />}</button>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 flex h-96 w-80 flex-col rounded-xl border border-slate-200 bg-card">
          <p className="border-b border-slate-200 p-3 text-sm font-semibold text-primary">Didi Assistant</p>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">{msgs.map((m, i) => <p key={i} className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.me ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>{m.t}</p>)}</div>
          <div className="flex gap-2 border-t border-slate-200 p-2"><input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Ask about the throw…" className="flex-1 rounded-md border border-slate-200 px-2 text-sm" /><button onClick={ask} aria-label="Send" className="rounded-md bg-primary p-2 text-primary-foreground"><Send className="h-4 w-4" /></button></div>
        </div>
      )}
    </>
  );
}
