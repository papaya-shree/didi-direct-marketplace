import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/paypal/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { productId, amount } = (await request.json()) as { productId: string; amount: number };
        await new Promise((r) => setTimeout(r, 700));
        return Response.json({ id: `PAYPAL-ORDER-${Math.random().toString(36).slice(2, 10).toUpperCase()}`, status: "COMPLETED", productId, amount: { currency_code: "USD", value: amount.toFixed(2) } });
      },
    },
  },
});
