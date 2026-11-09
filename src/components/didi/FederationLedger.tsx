import { useState } from "react";
import { Zap, Loader2, Landmark, CheckCircle2 } from "lucide-react";
import type { Settlement } from "@/lib/data";
import { FX_INR_PER_USD } from "@/lib/pricing";

export function FederationLedger({ rows, setRows }: { rows: Settlement[]; setRows: (r: Settlement[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const usd = rows.reduce((a, r) => a + r.usd, 0);
  const inr = rows.filter((r) => r.status === "Settled").reduce((a, r) => a + r.inr, 0);
  const pending = rows.filter((r) => r.status === "Pending");

  const settle = async () => {
    setBusy(true);
    const res = await fetch("/api/ledger/settle", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: pending.map((r) => r.id) }) }).then((r) => r.json());
    const map = new Map<string, string>(res.settled.map((s: { id: string; hash: string }) => [s.id, s.hash]));
    setRows(rows.map((r) => (map.has(r.id) ? { ...r, status: "Settled", hash: map.get(r.id) ?? "" } : r)));
    setLog((l) => [...res.settled.map((s: { id: string; hash: string; at: string }) => `${s.at.slice(11, 19)}  ${s.hash}  → UPI credited`), ...(res.settled.length ? [] : [`${new Date().toISOString().slice(11, 19)}  nothing pending`]), ...l]);
    setBusy(false);
    const n = res.settled.length;
    setToast(n ? `${n} UPI payout${n > 1 ? "s" : ""} settled instantly` : "Nothing pending to settle");
    setTimeout(() => setToast(null), 3500);
  };

  const stat = (label: string, v: string) => <div className="rounded-xl border border-slate-200 bg-card p-5"><p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 font-display text-3xl text-foreground">{v}</p></div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">{stat("USD received (PayPal)", `$${usd.toFixed(2)}`)}{stat("INR withdrawn to bank", `₹${inr.toLocaleString("en-IN")}`)}{stat("FX rate", `₹${FX_INR_PER_USD}`)}</div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-muted-foreground"><Landmark className="h-4 w-4" />PayPal USD → SBI Federation a/c → UPI to makers</p>
        <button onClick={settle} disabled={busy} className="flex items-center gap-2 rounded-lg bg-terracotta px-4 py-2.5 text-sm font-semibold text-primary-foreground">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}Simulate Instant UPI Settlement</button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-muted-foreground"><tr>{["Item", "USD Received", "INR Withdrawn", "Maker", "Share", "Status"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody>{rows.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No payments yet. Sales from the storefront will appear here.</td></tr>}{rows.map((r) => (
            <tr key={r.id} className="border-b border-slate-200 last:border-0">
              <td className="px-4 py-3 font-medium text-foreground">{r.item}</td><td className="px-4 py-3">${r.usd.toFixed(2)}</td><td className="px-4 py-3">₹{r.inr.toLocaleString("en-IN")}</td><td className="px-4 py-3">{r.maker}</td><td className="px-4 py-3">{Math.round(r.share * 100)}%</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.status === "Settled" ? "bg-success text-success-foreground" : "bg-muted text-terracotta"}`}>{r.status}</span>{r.hash && <span className="ml-2 font-mono text-xs text-muted-foreground">{r.hash}</span>}</td>
            </tr>))}</tbody>
        </table>
      </div>
      {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-success px-4 py-2 text-sm font-semibold text-success-foreground"><CheckCircle2 className="h-4 w-4" />{toast}</div>}
      {log.length > 0 && <pre className="max-h-48 overflow-auto rounded-xl bg-foreground p-4 font-mono text-xs text-background">{log.join("\n")}</pre>}
    </div>
  );
}
