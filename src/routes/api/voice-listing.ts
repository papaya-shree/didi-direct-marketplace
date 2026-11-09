import { createFileRoute } from "@tanstack/react-router";

const drafts = [
  { transcript: "यह हाथ से बना कढ़ाई वाला कुशन कवर है, आठ घंटे लगे, सामान तीन सौ रुपये का।", title: "Hand-embroidered Cushion Cover", titleHi: "कढ़ाई कुशन कवर", description: "Cotton cushion cover with hand-done chain-stitch florals.", craft: "Embroidery", materials: 300, hours: 8 },
  { transcript: "यह बांस की टोकरी है, छह घंटे लगे, सामान दो सौ रुपये का।", title: "Woven Bamboo Basket", titleHi: "बांस की टोकरी", description: "Sturdy hand-woven bamboo basket with natural finish.", craft: "Basketry", materials: 200, hours: 6 },
];

export const Route = createFileRoute("/api/voice-listing")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as { seed?: number };
        await new Promise((r) => setTimeout(r, 900));
        const d = drafts[(body.seed ?? 0) % drafts.length]!;
        return Response.json({ ok: true, stt: { lang: "hi-IN", confidence: 0.94 }, vision: { labels: [d.craft, "handmade"] }, draft: d });
      },
    },
  },
});
