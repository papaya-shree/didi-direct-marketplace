import { useState } from "react";
import { Check, Pencil, X, Inbox } from "lucide-react";
import { collectives, type Product } from "@/lib/data";
import { priceUSD, WAGE_FLOOR_INR, FX_USD_PER_INR } from "@/lib/pricing";

export function LeaderReview({ products, update, remove }: { products: Product[]; update: (p: Product) => void; remove: (id: string) => void }) {
  const queue = products.filter((p) => p.status === "Pending_Review");
  if (!queue.length) return <div className="rounded-xl border border-slate-200 bg-card p-12 text-center text-muted-foreground"><Inbox className="mx-auto mb-2 h-8 w-8" />Queue is clear.</div>;
  return <div className="grid gap-4 lg:grid-cols-2">{queue.map((p) => <ReviewCard key={p.id} p={p} update={update} remove={remove} />)}</div>;
}

function ReviewCard({ p, update, remove }: { p: Product; update: (p: Product) => void; remove: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const usd = priceUSD(p.materials, p.hours, WAGE_FLOOR_INR, p.margin);
  const col = collectives.find((c) => c.id === p.collectiveId);
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-card">
      <div className="flex gap-4 border-b border-slate-200 p-4">
        <img src={p.image} alt={p.title} className="h-20 w-20 rounded-lg object-cover" />
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{p.title}</p>
          <p className="text-sm text-muted-foreground">{p.titleHi} · {p.maker}</p>
          <p className="text-xs text-muted-foreground">{col?.name}, {col?.state}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deterministic price</p>
        <Formula materials={p.materials} hours={p.hours} margin={p.margin} usd={usd} />
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button onClick={() => update({ ...p, status: "Live" })} className="flex items-center justify-center gap-1 rounded-lg bg-success py-2 text-sm font-semibold text-success-foreground"><Check className="h-4 w-4" />Publish</button>
          <button onClick={() => setOpen(true)} className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold"><Pencil className="h-4 w-4" />Edit</button>
          <button onClick={() => remove(p.id)} className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-destructive"><X className="h-4 w-4" />Reject</button>
        </div>
      </div>
      {open && <PricingModal p={p} onClose={() => setOpen(false)} onSave={(np) => { update(np); setOpen(false); }} />}
    </div>
  );
}

function Formula({ materials, hours, margin, usd }: { materials: number; hours: number; margin: number; usd: number }) {
  return (
    <div className="rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed">
      (₹{materials} + {hours}h × ₹{WAGE_FLOOR_INR}) ÷ (1 − {margin}) × {FX_USD_PER_INR}
      <div className="mt-1 font-display text-2xl text-foreground">${usd.toFixed(2)} <span className="font-sans text-xs text-muted-foreground">USD</span></div>
    </div>
  );
}

function PricingModal({ p, onClose, onSave }: { p: Product; onClose: () => void; onSave: (p: Product) => void }) {
  const [d, setD] = useState(p);
  const valid = d.margin >= 0 && d.margin < 1 && d.materials >= 0 && d.hours >= 0;
  const usd = valid ? priceUSD(d.materials, d.hours, WAGE_FLOOR_INR, d.margin) : 0;
  const field = (label: string, key: "materials" | "hours" | "margin", step = 1) => (
    <label className="text-xs text-muted-foreground">{label}
      <input type="number" step={step} min={0} value={d[key]} onChange={(e) => setD({ ...d, [key]: Number(e.target.value) })} className="mt-1 w-full rounded-md border border-slate-200 bg-card px-2 py-2 text-sm text-foreground" />
    </label>
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={onClose}>
      <div role="dialog" aria-label="Edit pricing" className="w-full max-w-md rounded-xl border border-slate-200 bg-card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between"><div><p className="font-semibold text-foreground">Edit pricing</p><p className="text-sm text-muted-foreground">{p.title}</p></div><button onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button></div>
        <label className="text-xs text-muted-foreground">Title<input value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} className="mt-1 mb-3 w-full rounded-md border border-slate-200 px-2 py-2 text-sm text-foreground" /></label>
        <div className="grid grid-cols-3 gap-2">{field("Materials ₹", "materials")}{field("Hours", "hours")}{field("Margin (0–0.99)", "margin", 0.05)}</div>
        <div className="mt-3">{valid ? <Formula materials={d.materials} hours={d.hours} margin={d.margin} usd={usd} /> : <p className="text-sm text-destructive">Margin must be between 0 and 0.99.</p>}</div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-200 py-2 text-sm font-semibold">Cancel</button>
          <button disabled={!valid} onClick={() => onSave(d)} className="rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">Save price</button>
        </div>
      </div>
    </div>
  );
}
