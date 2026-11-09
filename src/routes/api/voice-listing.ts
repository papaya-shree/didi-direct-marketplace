import { createFileRoute } from "@tanstack/react-router";

type Meta = { title: string; titleHi: string; description: string; craft: string };

const SAMPLE = "नमस्ते, ये हाथ से बना सामान है। आठ घंटे लगे और सामान लगभग तीन सौ रुपये का आया।";

const KEYWORDS: [RegExp, Meta][] = [
  [/dupatta|scarf|stole|shawl/i, { title: "Handcrafted Dupatta", titleHi: "हस्तनिर्मित दुपट्टा", description: "Soft handwoven dupatta finished by hand.", craft: "Textile" }],
  [/saree|sari/i, { title: "Handwoven Saree", titleHi: "हथकरघा साड़ी", description: "Traditional handloom saree woven by a village artisan.", craft: "Handloom" }],
  [/jewel|earring|necklace|bangle|bead/i, { title: "Terracotta Jewelry", titleHi: "मिट्टी के गहने", description: "Lightweight hand-shaped jewelry, painted by hand.", craft: "Jewelry" }],
  [/basket|bamboo/i, { title: "Woven Bamboo Basket", titleHi: "बांस की टोकरी", description: "Sturdy hand-woven bamboo basket.", craft: "Basketry" }],
  [/diya|pot|clay|terracotta/i, { title: "Hand-painted Terracotta Pottery", titleHi: "मिट्टी के बर्तन", description: "Hand-shaped clay piece, painted in festive colours.", craft: "Terracotta" }],
  [/cushion|pillow|embroid/i, { title: "Hand-embroidered Cushion Cover", titleHi: "कढ़ाई कुशन कवर", description: "Cotton cushion cover with hand-done embroidery.", craft: "Embroidery" }],
  [/quilt|kantha|throw/i, { title: "Kantha Stitch Throw", titleHi: "कांथा चादर", description: "Layered cotton throw with running-stitch kantha work.", craft: "Kantha" }],
  [/bag|purse|pouch/i, { title: "Handmade Fabric Bag", titleHi: "हाथ से बना थैला", description: "Durable handmade bag from local fabric.", craft: "Textile" }],
];
const GENERIC: Meta = { title: "Handmade Craft Piece", titleHi: "हस्तनिर्मित सामान", description: "A one-of-a-kind piece made by hand by a woman artisan.", craft: "Handicraft" };

const fromText = (s: string) => KEYWORDS.find(([re]) => re.test(s))?.[1] ?? null;

async function fromImage(image: string): Promise<Meta | null> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: 'This is a photo of an Indian handicraft for sale. Reply ONLY with JSON: {"title": short English product title like "Handcrafted Dupatta" or "Terracotta Jewelry", "titleHi": same title in Hindi (Devanagari), "craft": one-word category, "description": one appealing English sentence describing what is visible}.' },
            { type: "image_url", image_url: { url: image } },
          ],
        }],
      }),
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const txt = j.choices?.[0]?.message?.content ?? "";
    const m = JSON.parse(txt.slice(txt.indexOf("{"), txt.lastIndexOf("}") + 1)) as Meta;
    return m.title ? m : null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/api/voice-listing")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as { transcript?: string; image?: string; filename?: string };
        const transcript = body.transcript?.trim() || SAMPLE;
        const meta = (body.image ? await fromImage(body.image) : null) ?? fromText(body.filename ?? "") ?? fromText(transcript) ?? GENERIC;
        return Response.json({ ok: true, draft: { ...meta, transcript } });
      },
    },
  },
});
