import { createFileRoute } from "@tanstack/react-router";
import { PantallaInicio } from "@/pantallas/inicio/PantallaInicio";

export const Route = createFileRoute("/_authenticated/inicio")({
  head: () => ({
    meta: [
      { title: "Inicio — Jhonify" },
      { name: "description", content: "Busca canciones en YouTube y reprodúcelas al instante." },
      { property: "og:title", content: "Inicio — Jhonify" },
      { property: "og:description", content: "Busca y reproduce canciones." },
    ],
  }),
  component: PantallaInicio,
});
