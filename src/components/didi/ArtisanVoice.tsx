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
  const [level, setLevel] = useState(0);
  const [live, setLive] = useState("");
  const MAX = 15;

  const record = async () => {
    if (stage === "recording") { stopRef.current?.(); return; }
    if (stage === "processing") return;
    setDraft(null); setElapsed(0); setError(null); setLive("");

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Mic band hai. Browser mein mic allow karein, ya app ko naye tab mein kholein. Abhi demo awaaz chal rahi hai.");
    }

    setStage("recording");
    const start = Date.now();
    let text = "";
    let ended = false;

    // Real audio level for the waveform
    let ctx: AudioContext | null = null; let raf = 0;
    if (stream) {
      ctx = new AudioContext();
      const an = ctx.createAnalyser(); an.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      const tick = () => { an.getByteFrequencyData(buf); setLevel(buf.reduce((a, b) => a + b, 0) / buf.length / 128); raf = requestAnimationFrame(tick); };
      tick();
    }

    const w = window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
    const SR = stream ? (w.SpeechRecognition ?? w.webkitSpeechRecognition) : undefined;
    const rec = SR ? new SR() : null;

    const end = () => {
      if (ended) return; ended = true;
      clearInterval(iv); clearTimeout(cap); cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop()); void ctx?.close();
      try { rec?.stop(); } catch { /* already stopped */ }
      stopRef.current = null; setLevel(0);
      void finish(text.trim());
    };
    const iv = setInterval(() => setElapsed((Date.now() - start) / 1000), 100);
    const cap = setTimeout(end, (stream ? MAX : 3) * 1000);
    stopRef.current = end;

    if (rec) {
      rec.lang = "hi-IN"; rec.continuous = true; rec.interimResults = true;
      rec.onresult = (e: any) => { text = Array.from(e.results as ArrayLike<any>).map((r: any) => r[0].transcript).join(" "); setLive(text); };
      rec.onerror = () => {};
      try { rec.start(); } catch { /* ignore */ }
    }
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
        ) : stage === "recording" || stage === "processing" ? (
          <div className="py-4 text-center" aria-live="polite">
            <div className="flex h-16 items-center justify-center gap-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className={`w-1.5 rounded-full bg-terracotta ${stage === "recording" ? "animate-wave" : "opacity-30"}`} style={{ height: `${20 + ((i * 37) % 60)}%`, animationDelay: `${(i % 8) * 0.09}s` }} />
              ))}
            </div>
            <p className="mt-3 font-mono text-2xl text-primary">0:0{Math.floor(elapsed)}.{Math.floor((elapsed % 1) * 10)}</p>
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {stage === "processing" ? <><Loader2 className="h-4 w-4 animate-spin" />Hindi samajh rahe hain…</> : <><span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />Sun rahe hain…</>}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-slate-200 py-6 text-primary">
              <Camera className="h-7 w-7" />
              <span className="text-sm font-semibold">{photo ? "Badlein" : "Photo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setPhoto(URL.createObjectURL(f)); }} />
            </label>
            <button onClick={record} className="flex flex-col items-center gap-2 rounded-2xl bg-terracotta py-6 text-primary-foreground">
              <Mic className="h-7 w-7" />
              <span className="text-sm font-semibold">Bolo</span>
            </button>
            {error && <p className="col-span-2 text-center text-sm text-destructive">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
