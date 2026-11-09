import { createFileRoute } from "@tanstack/react-router";

const drafts = [
  { transcript: "नमस्ते, मैं कमला हूँ। ये हाथ से कढ़ाई किया हुआ कुशन कवर है, सूती कपड़े पर चेन स्टिच के फूल बनाए हैं। आठ घंटे लगे और सामान लगभग तीन सौ रुपये का आया।", title: "Hand-embroidered Cushion Cover", titleHi: "कढ़ाई कुशन कवर", description: "Cotton cushion cover with hand-done chain-stitch florals.", craft: "Embroidery", materials: 300, hours: 8 },
  { transcript: "ये बांस की टोकरी है, पूरी हाथ से बुनी है, कोई केमिकल नहीं लगाया। छह घंटे लगे, बांस और रंग मिलाकर दो सौ रुपये का खर्चा हुआ।", title: "Woven Bamboo Basket", titleHi: "बांस की टोकरी", description: "Sturdy hand-woven bamboo basket with a natural, chemical-free finish.", craft: "Basketry", materials: 200, hours: 6 },
  { transcript: "ये मिट्टी के दीयों का सेट है, बारह दीये हैं, हाथ से रंगे हैं। चार घंटे लगे और मिट्टी, रंग का सामान एक सौ पचास रुपये का।", title: "Hand-painted Terracotta Diya Set (12)", titleHi: "मिट्टी के दीये", description: "Twelve hand-shaped clay diyas, painted in festive colours.", craft: "Terracotta", materials: 150, hours: 4 },
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
