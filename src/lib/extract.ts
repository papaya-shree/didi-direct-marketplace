// Pulls material cost (₹) and hours worked out of a Hindi / Hinglish transcript.
const WORDS: Record<string, number> = {
  एक: 1, दो: 2, तीन: 3, चार: 4, पांच: 5, पाँच: 5, छह: 6, छः: 6, छे: 6, सात: 7, आठ: 8, नौ: 9, दस: 10,
  ग्यारह: 11, बारह: 12, तेरह: 13, चौदह: 14, पंद्रह: 15, सोलह: 16, सत्रह: 17, अठारह: 18, उन्नीस: 19, बीस: 20,
  पच्चीस: 25, तीस: 30, पैंतीस: 35, चालीस: 40, पैंतालीस: 45, पचास: 50, साठ: 60, सत्तर: 70, अस्सी: 80, नब्बे: 90,
  सौ: 100, हज़ार: 1000, हजार: 1000,
  ek: 1, do: 2, teen: 3, char: 4, chaar: 4, paanch: 5, panch: 5, chhe: 6, saat: 7, aath: 8, nau: 9, das: 10,
  barah: 12, pandrah: 15, bees: 20, pachchis: 25, tees: 30, chalis: 40, pachas: 50, saath: 60, sau: 100, hazaar: 1000, hazar: 1000,
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12, twenty: 20, fifty: 50, hundred: 100, thousand: 1000,
};
const HOURS = /^(घंटे|घंटा|घण्टे|घंटों|ghante|ghanta|ghanton|hours?|hrs?)$/i;
const MONEY = /^(रुपये|रुपए|रुपया|रूपये|रु|rupaye|rupees?|rupay|rs\.?|inr|₹)$/i;

type Tok = { w: string; n: number | null };

function tokenize(text: string): Tok[] {
  const raw = text.replace(/₹\s*/g, "₹ ").replace(/[,।.!?;:"“”]/g, (c) => (c === "," ? "" : " ")).split(/\s+/).filter(Boolean);
  return raw.map((w) => {
    const d = w.replace(/^₹/, "");
    if (/^\d+$/.test(d)) return { w, n: Number(d) };
    const v = WORDS[w.toLowerCase()];
    return { w, n: v ?? null };
  });
}

function groups(toks: Tok[]) {
  const out: { value: number; start: number; end: number }[] = [];
  let i = 0;
  while (i < toks.length) {
    if (toks[i]!.n === null) { i++; continue; }
    const start = i; let total = 0, cur = 0;
    while (i < toks.length && toks[i]!.n !== null) {
      const v = toks[i]!.n!;
      if (v === 100) cur = (cur || 1) * 100;
      else if (v === 1000) { total += (cur || 1) * 1000; cur = 0; }
      else cur += v;
      i++;
    }
    out.push({ value: total + cur, start, end: i - 1 });
  }
  return out;
}

export function extractNumbers(text: string): { materials: number | null; hours: number | null } {
  const toks = tokenize(text);
  const gs = groups(toks);
  let materials: number | null = null, hours: number | null = null;
  const near = (g: { start: number; end: number }, re: RegExp, before: number, after: number) => {
    for (let k = g.start - before; k <= g.end + after; k++) if (k >= 0 && k < toks.length && (k < g.start || k > g.end) && re.test(toks[k]!.w)) return true;
    return false;
  };
  for (const g of gs) {
    if (hours === null && near(g, HOURS, 0, 1)) hours = g.value;
    else if (materials === null && near(g, MONEY, 1, 1)) materials = g.value;
  }
  return { materials, hours };
}
