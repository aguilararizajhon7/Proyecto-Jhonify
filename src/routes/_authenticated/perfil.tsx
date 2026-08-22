import { createFileRoute } from "@tanstack/react-router";
import { PantallaPerfil } from "@/pantallas/perfil/PantallaPerfil";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Jhonify" },
      { name: "description", content: "Tu perfil en Jhonify." },
      { property: "og:title", content: "Perfil — Jhonify" },
      { property: "og:description", content: "Tu perfil en Jhonify." },
    ],
  }),
  component: PantallaPerfil,
});
