// Deterministic artisan pricing. All inputs in INR except fx (USD per 1 INR).
export const WAGE_FLOOR_INR = 120; // per hour
export const DEFAULT_MARGIN = 0.25;
export const FX_USD_PER_INR = 0.012;
export const FX_INR_PER_USD = 83.2;

export function priceUSD(materials: number, hours: number, wageFloor = WAGE_FLOOR_INR, margin = DEFAULT_MARGIN, fx = FX_USD_PER_INR) {
  if (margin >= 1 || margin < 0) throw new Error("Margin must be in [0,1)");
  const inr = (materials + hours * wageFloor) / (1 - margin);
  return Math.round(inr * fx * 100) / 100;
}

export function makerShareINR(usd: number, share: number) {
  return Math.round(usd * FX_INR_PER_USD * share);
}
