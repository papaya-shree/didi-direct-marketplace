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


export const initialProducts: Product[] = [];

export const initialSettlements: Settlement[] = [];
