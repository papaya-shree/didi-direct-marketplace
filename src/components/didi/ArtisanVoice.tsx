import { useRef, useState } from "react";
import { Camera, Mic, Loader2, CheckCircle2, Send } from "lucide-react";
import type { Product } from "@/lib/data";

type Draft = { title: string; titleHi: string; description: string; craft: string; materials: number; hours: number; transcript: string };

export function ArtisanVoice({ onSubmit }: { onSubmit: (p: Product) => void }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [stage, setStage] = useState<"idle" | "recording" | "processing" | "done">("idle");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [sent, setSent] = useState(false);
  const seed = useRef(0);

  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const finish = async (spoken: string) => {
    setStage("processing");
    const res = await fetch("/api/voice-listing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seed: seed.current++ }) });
    const json = await res.json();
    setDraft({ ...json.draft, transcript: spoken || json.draft.transcript });
    setStage("done");
  };

  const [elapsed, setElapsed] = useState(0);
  void stopRef; void setError;

  const record = async () => {
    if (stage === "recording" || stage === "processing") return;
    setDraft(null); setElapsed(0); setStage("recording");
    const start = Date.now();
    const iv = setInterval(() => setElapsed(Math.min(3, (Date.now() - start) / 1000)), 100);
    await new Promise((r) => setTimeout(r, 3000));
    clearInterval(iv); setElapsed(3);
    await finish("");
  };

  const submit = () => {
    if (!draft) return;
    onSubmit({ id: `p${Date.now()}`, title: draft.title, titleHi: draft.titleHi, description: draft.description, craft: draft.craft, collectiveId: "c1", maker: "Kamla Devi", materials: draft.materials, hours: draft.hours, margin: 0.25, status: "Pending_Review", image: photo ?? "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=70&auto=format&fit=crop" });
    setSent(true);
  };

  const reset = () => { setPhoto(null); setDraft(null); setStage("idle"); setSent(false); };

  return (
    <div className="mx-auto flex max-w-sm flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-muted" style={{ minHeight: 640 }}>
      <div className="flex-1 p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">नमस्ते, कमला दीदी</p>
        <h2 className="mt-1 font-display text-3xl text-primary">नया सामान बेचें</h2>
        <p className="mt-1 text-sm text-muted-foreground">Photo khichein, phir bolkar batayein.</p>
        {photo && <img src={photo} alt="Uploaded craft" className="mt-6 aspect-square w-full rounded-xl border border-slate-200 object-cover" />}
      </div>

      <div className="rounded-t-3xl border-t border-slate-200 bg-card p-6">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200" />
        {sent ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <p className="mt-3 font-semibold text-primary">Leader ke paas bhej diya!</p>
            <p className="text-sm text-muted-foreground">Sent for review.</p>
            <button onClick={reset} className="mt-4 text-sm font-semibold text-terracotta">Aur banayein</button>
          </div>
        ) : stage === "done" && draft ? (
          <div className="space-y-3">
            <p className="rounded-lg bg-muted p-3 text-sm italic">“{draft.transcript}”</p>
            <div className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold text-primary">{draft.title}</p>
              <p className="text-muted-foreground">{draft.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">₹{draft.materials} materials · {draft.hours} hrs · {draft.craft}</p>
            </div>
            <button onClick={record} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold text-terracotta"><Mic className="h-4 w-4" /> Dobara bolein</button>
            <button onClick={submit} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground"><Send className="h-4 w-4" /> Bhejein (Submit)</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-slate-200 py-6 text-primary">
              <Camera className="h-7 w-7" />
              <span className="text-sm font-semibold">{photo ? "Badlein" : "Photo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPhoto(URL.createObjectURL(f)); }} />
            </label>
            <button onClick={record} disabled={stage === "processing"} className="flex flex-col items-center gap-2 rounded-2xl bg-terracotta py-6 text-primary-foreground disabled:opacity-80">
              {stage === "processing" ? <Loader2 className="h-7 w-7 animate-spin" /> : <Mic className={`h-7 w-7 ${stage === "recording" ? "animate-pulse" : ""}`} />}
              <span className="text-sm font-semibold">{stage === "recording" ? "Rokne ke liye dabayein" : stage === "processing" ? "Samajh rahe…" : "Bolo"}</span>
            </button>
            {error && <p className="col-span-2 text-center text-sm text-destructive">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
