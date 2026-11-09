import { useRef, useState } from "react";
import { Camera, Mic, Loader2, CheckCircle2, Send, AudioLines, Sparkles, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/data";

type Memo = { title: string; transcript: string; at: string; secs: number };
const sampleMemos: Memo[] = [
  { title: "Mirror-work Tote Bag", transcript: "ये शीशे की कढ़ाई वाला थैला है, आठ घंटे लगे…", at: "Kal, 4:10 pm", secs: 12 },
  { title: "Hand-block Printed Dupatta", transcript: "दाबू प्रिंट का दुपट्टा, बारह घंटे लगे…", at: "Somvar, 11:30 am", secs: 9 },
];

type Draft = { title: string; titleHi: string; description: string; craft: string; materials: number; hours: number; transcript: string };

export function ArtisanVoice({ onSubmit }: { onSubmit: (p: Product) => void }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [stage, setStage] = useState<"idle" | "recording" | "processing" | "done">("idle");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [sent, setSent] = useState(false);
  const seed = useRef(0);
  const elapsedRef = useRef(0);
  const [memos, setMemos] = useState<Memo[]>(sampleMemos);

  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const finish = async (spoken: string) => {
    setStage("processing");
    const res = await fetch("/api/voice-listing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seed: seed.current++ }) });
    const json = await res.json();
    const nd = { ...json.draft, transcript: spoken || json.draft.transcript };
    setDraft(nd);
    setMemos((m) => [{ title: nd.title, transcript: nd.transcript, at: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), secs: Math.max(3, Math.round(elapsedRef.current)) }, ...m].slice(0, 5));
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
    const iv = setInterval(() => (elapsedRef.current = (Date.now() - start) / 1000, setElapsed(elapsedRef.current)), 100);
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
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_24rem_1fr]">
    <aside className="hidden rounded-xl border border-slate-200 bg-card p-6 lg:block">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kaise kaam karta hai</p>
      <ol className="mt-4 space-y-5">
        {[
          { icon: Mic, t: "Speak in Hindi", s: "Photo lein aur apne saman ke baare mein bolein." },
          { icon: Sparkles, t: "AI creates story & USD price", s: "English listing and a fair-wage dollar price." },
          { icon: ShieldCheck, t: "Leader approves", s: "Your collective leader checks it and publishes." },
        ].map(({ icon: Icon, t, s }, i) => (
          <li key={t} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
            <div><p className="flex items-center gap-1.5 font-semibold text-foreground"><Icon className="h-4 w-4 text-primary" />{t}</p><p className="text-sm text-muted-foreground">{s}</p></div>
          </li>
        ))}
      </ol>
    </aside>
    <div className="mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-[2rem] border border-slate-300 bg-card shadow-md" style={{ minHeight: 640 }}>
      <div className="flex-1 p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">नमस्ते, कमला दीदी</p>
        <h2 className="mt-1 font-display text-3xl text-foreground">नया सामान बेचें</h2>
        <p className="mt-1 text-sm text-muted-foreground">Photo khichein, phir bolkar batayein.</p>
        {photo && <img src={photo} alt="Uploaded craft" className="mt-6 aspect-square w-full rounded-xl border border-slate-200 object-cover" />}
      </div>

      <div className="rounded-t-3xl border-t border-slate-200 bg-card p-6">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200" />
        {sent ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <p className="mt-3 font-semibold text-foreground">Leader ke paas bhej diya!</p>
            <p className="text-sm text-muted-foreground">Sent for review.</p>
            <button onClick={reset} className="mt-4 text-sm font-semibold text-terracotta">Aur banayein</button>
          </div>
        ) : stage === "done" && draft ? (
          <div className="space-y-3">
            <p className="rounded-lg bg-muted p-3 text-sm italic">“{draft.transcript}”</p>
            <div className="rounded-lg border border-slate-200 p-3 text-sm">
              <p className="font-semibold text-foreground">{draft.title}</p>
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
                <span key={i} className={`w-1.5 rounded-full bg-terracotta transition-all ${stage === "recording" ? "animate-wave" : "opacity-30"}`} style={{ height: `${Math.min(100, (20 + ((i * 37) % 60)) * (0.5 + level * 1.5))}%`, animationDelay: `${(i % 8) * 0.09}s` }} />
              ))}
            </div>
            <p className="mt-3 font-mono text-2xl text-foreground">0:{String(Math.floor(elapsed)).padStart(2, "0")}.{Math.floor((elapsed % 1) * 10)}</p>
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              {stage === "processing" ? <><Loader2 className="h-4 w-4 animate-spin" />Hindi samajh rahe hain…</> : <><span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />Sun rahe hain…</>}
            </p>
            {live && <p className="mt-3 rounded-lg bg-muted p-2 text-sm">{live}</p>}
            {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
            {stage === "recording" && <button onClick={record} className="mt-4 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground">Ruko (Stop)</button>}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-slate-200 py-6 text-foreground">
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
    <aside className="hidden rounded-xl border border-slate-200 bg-card p-6 lg:block">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Voice Memos</p>
      <ul className="mt-4 divide-y divide-slate-200">
        {memos.map((m, i) => (
          <li key={i} className="py-3 first:pt-0">
            <div className="flex items-center justify-between gap-2"><p className="flex items-center gap-1.5 text-sm font-semibold text-foreground"><AudioLines className="h-4 w-4 text-primary" />{m.title}</p><span className="text-xs text-muted-foreground">0:{String(m.secs).padStart(2, "0")}</span></div>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{m.transcript}</p>
            <p className="mt-1 text-xs text-muted-foreground">{m.at}</p>
          </li>
        ))}
      </ul>
    </aside>
    </div>
  );
}