import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ledger/settle")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { ids } = (await request.json()) as { ids: string[] };
        await new Promise((r) => setTimeout(r, 800));
        const hex = () => Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
        return Response.json({ rail: "UPI", settled: ids.map((id) => ({ id, hash: `UPI-0x${hex()}…${hex().slice(0, 4)}`, at: new Date().toISOString() })) });
      },
    },
  },
});
