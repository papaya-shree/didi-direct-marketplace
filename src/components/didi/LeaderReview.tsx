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
  const [edit, setEdit] = useState(false);
  const [d, setD] = useState(p);
  const usd = priceUSD(d.materials, d.hours, WAGE_FLOOR_INR, d.margin);
  const col = collectives.find((c) => c.id === p.collectiveId);
  const field = (label: string, key: "materials" | "hours" | "margin", step = 1) => (
    <label className="text-xs text-muted-foreground">{label}
      <input type="number" step={step} value={d[key]} disabled={!edit} onChange={(e) => setD({ ...d, [key]: Number(e.target.value) })} className="mt-1 w-full rounded-md border border-slate-200 bg-card px-2 py-1.5 text-sm text-foreground disabled:bg-muted" />
    </label>
  );
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-card">
      <div className="flex gap-4 border-b border-slate-200 p-4">
        <img src={p.image} alt={p.title} className="h-20 w-20 rounded-lg object-cover" />
        <div className="min-w-0">
          {edit ? <input value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} className="w-full rounded-md border border-slate-200 px-2 py-1 font-semibold" /> : <p className="font-semibold text-primary">{d.title}</p>}
          <p className="text-sm text-muted-foreground">{p.titleHi} · {p.maker}</p>
          <p className="text-xs text-muted-foreground">{col?.name}, {col?.state}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deterministic price</p>
        <div className="grid grid-cols-3 gap-2">{field("Materials ₹", "materials")}{field("Hours", "hours")}{field("Margin", "margin", 0.05)}</div>
        <div className="mt-3 rounded-lg bg-muted p-3 font-mono text-xs leading-relaxed">
          (₹{d.materials} + {d.hours}h × ₹{WAGE_FLOOR_INR}) ÷ (1 − {d.margin}) × {FX_USD_PER_INR}
          <div className="mt-1 font-display text-2xl text-primary">${usd.toFixed(2)} <span className="font-sans text-xs text-muted-foreground">USD</span></div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button onClick={() => update({ ...d, status: "Live" })} className="flex items-center justify-center gap-1 rounded-lg bg-success py-2 text-sm font-semibold text-success-foreground"><Check className="h-4 w-4" />Publish</button>
          <button onClick={() => { if (edit) update(d); setEdit(!edit); }} className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold"><Pencil className="h-4 w-4" />{edit ? "Save" : "Edit"}</button>
          <button onClick={() => remove(p.id)} className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-destructive"><X className="h-4 w-4" />Reject</button>
        </div>
      </div>
    </div>
  );
}
