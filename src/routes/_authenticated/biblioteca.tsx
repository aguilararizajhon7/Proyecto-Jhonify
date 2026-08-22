import { createFileRoute } from "@tanstack/react-router";
import { PantallaBiblioteca } from "@/pantallas/biblioteca/PantallaBiblioteca";

export const Route = createFileRoute("/_authenticated/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca — Jhonify" },
      { name: "description", content: "Tu biblioteca de canciones reproducidas en Jhonify." },
      { property: "og:title", content: "Biblioteca — Jhonify" },
      { property: "og:description", content: "Tu biblioteca musical." },
    ],
  }),
  component: PantallaBiblioteca,
});
