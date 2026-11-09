export type Status = "Pending_Review" | "Live" | "Sold";
export interface Collective { id: string; name: string; state: string; members: number; upi: string }
export interface Product {
  id: string; title: string; titleHi: string; description: string; collectiveId: string; maker: string;
  materials: number; hours: number; margin: number; status: Status; image: string; craft: string;
}
export interface Settlement { id: string; item: string; usd: number; inr: number; maker: string; share: number; status: "Settled" | "Pending"; hash?: string }

export const collectives: Collective[] = [
  { id: "c1", name: "Sakhi Mahila Mandal", state: "Rajasthan", members: 42, upi: "sakhi@sbi" },
  { id: "c2", name: "Kantha Didi Sangha", state: "West Bengal", members: 28, upi: "kantha@upi" },
  { id: "c3", name: "Chanderi Weavers Collective", state: "Madhya Pradesh", members: 35, upi: "chanderi@hdfc" },
];

const img = (seed: string) => `https://images.unsplash.com/${seed}?w=600&q=70&auto=format&fit=crop`;

export const initialProducts: Product[] = [
  { id: "p1", title: "Hand-block Printed Cotton Dupatta", titleHi: "हाथ ठप्पा दुपट्टा", description: "Indigo dabu print on soft mulmul cotton, natural dyes.", collectiveId: "c1", maker: "Kamla Devi", materials: 450, hours: 12, margin: 0.25, status: "Live", image: img("photo-1610030469983-98e550d6193c"), craft: "Block print" },
  { id: "p2", title: "Kantha Stitched Throw", titleHi: "कांथा कंबल", description: "Layered vintage saris hand-quilted with running stitch.", collectiveId: "c2", maker: "Rina Das", materials: 800, hours: 40, margin: 0.25, status: "Live", image: img("photo-1528459801416-a9e53bbf4e17"), craft: "Kantha" },
  { id: "p3", title: "Chanderi Silk Stole", titleHi: "चंदेरी स्टोल", description: "Sheer silk-cotton weave with zari buttis.", collectiveId: "c3", maker: "Sunita Koli", materials: 1200, hours: 30, margin: 0.3, status: "Sold", image: img("photo-1601244005535-a48d21d951ac"), craft: "Handloom" },
  { id: "p4", title: "Mirror-work Tote Bag", titleHi: "शीशा कढ़ाई थैला", description: "Hand-embroidered cotton tote with abhla mirror work.", collectiveId: "c1", maker: "Geeta Bai", materials: 300, hours: 8, margin: 0.25, status: "Pending_Review", image: img("photo-1590874103328-eac38a683ce7"), craft: "Embroidery" },
];

export const initialSettlements: Settlement[] = [
  { id: "s1", item: "Chanderi Silk Stole", usd: 72.0, inr: 5990, maker: "Sunita Koli", share: 0.8, status: "Settled", hash: "UPI-0x9f3a…b21c" },
  { id: "s2", item: "Kantha Stitched Throw (prev.)", usd: 85.0, inr: 7072, maker: "Rina Das", share: 0.8, status: "Settled", hash: "UPI-0x41de…77a0" },
];
