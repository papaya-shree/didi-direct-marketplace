import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/paypal/create-invoice")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const b = (await request.json()) as { email: string; productId: string; quantity: number; notes?: string; unit: number };
        await new Promise((r) => setTimeout(r, 700));
        return Response.json({ id: `INV2-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now() % 10000}`, status: "SENT", recipient: b.email, total: { currency_code: "USD", value: (b.unit * b.quantity).toFixed(2) } });
      },
    },
  },
});
