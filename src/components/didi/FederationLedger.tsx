import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Zap, Loader2, Landmark, CheckCircle2 } from "lucide-react";
import type { Settlement } from "@/lib/data";
import { FX_INR_PER_USD } from "@/lib/pricing";
import { formatSettlementStatus, formatNumber } from "@/lib/formatters";

export function FederationLedger({
  rows,
  setRows,
}: {
  rows: Settlement[];
  setRows: (r: Settlement[]) => void;
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const usd = rows.reduce((a, r) => a + r.usd, 0);
  const inr = rows.filter((r) => r.status === "Settled").reduce((a, r) => a + r.inr, 0);
  const pending = rows.filter((r) => r.status === "Pending");

  const settle = async () => {
    setBusy(true);
    const res = await fetch("/api/ledger/settle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: pending.map((r) => r.id) }),
    }).then((r) => r.json());

    const map = new Map<string, string>(
      res.settled.map((s: { id: string; hash: string }) => [s.id, s.hash])
    );
    setRows(
      rows.map((r) =>
        map.has(r.id) ? { ...r, status: "Settled", hash: map.get(r.id) ?? "" } : r
      )
    );
    setLog((l) => [
      ...res.settled.map(
        (s: { id: string; hash: string; at: string }) =>
          `${s.at.slice(11, 19)}  ${s.hash}  → ${t("ledger.upiCredited")}`
      ),
      ...(res.settled.length
        ? []
        : [`${new Date().toISOString().slice(11, 19)}  ${t("ledger.nothingPendingLog")}`]),
      ...l,
    ]);
    setBusy(false);

    const n = res.settled.length;
    setToast(
      n
        ? t("ledger.upiSettledToast", { count: n })
        : t("ledger.nothingPending")
    );
    setTimeout(() => setToast(null), 3500);
  };

  const stat = (label: string, v: string) => (
    <div className="rounded-xl border border-slate-200 bg-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl text-foreground">{v}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stat(t("ledger.usdReceived"), `$${usd.toFixed(2)}`)}
        {stat(t("ledger.inrWithdrawn"), `₹${formatNumber(inr, currentLang)}`)}
        {stat(t("ledger.fxRate"), `₹${FX_INR_PER_USD}`)}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Landmark className="h-4 w-4 shrink-0" />
          {t("ledger.flowSummary")}
        </p>
        <button
          onClick={settle}
          disabled={busy}
          className="flex items-center gap-2 rounded-lg bg-terracotta px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 transition-opacity disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          {t("ledger.simulateSettlement")}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 text-start text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold text-start">{t("ledger.table.item")}</th>
              <th className="px-4 py-3 font-semibold text-start">{t("ledger.table.usdReceived")}</th>
              <th className="px-4 py-3 font-semibold text-start">{t("ledger.table.inrWithdrawn")}</th>
              <th className="px-4 py-3 font-semibold text-start">{t("ledger.table.maker")}</th>
              <th className="px-4 py-3 font-semibold text-start">{t("ledger.table.share")}</th>
              <th className="px-4 py-3 font-semibold text-start">{t("ledger.table.status")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  {t("ledger.table.empty")}
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-200 last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{r.item}</td>
                <td className="px-4 py-3 font-mono">${r.usd.toFixed(2)}</td>
                <td className="px-4 py-3 font-mono">₹{formatNumber(r.inr, currentLang)}</td>
                <td className="px-4 py-3">{r.maker}</td>
                <td className="px-4 py-3 font-mono">{Math.round(r.share * 100)}%</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      r.status === "Settled"
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-terracotta"
                    }`}
                  >
                    {formatSettlementStatus(r.status, t)}
                  </span>
                  {r.hash && (
                    <span className="ms-2 font-mono text-xs text-muted-foreground">
                      {r.hash}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 start-1/2 z-50 flex -translate-x-1/2 rtl:translate-x-1/2 items-center gap-2 rounded-full bg-success px-4 py-2 text-sm font-semibold text-success-foreground shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4" />
          {toast}
        </div>
      )}

      {log.length > 0 && (
        <pre className="max-h-48 overflow-auto rounded-xl bg-foreground p-4 font-mono text-xs text-background">
          {log.join("\n")}
        </pre>
      )}
    </div>
  );
}
