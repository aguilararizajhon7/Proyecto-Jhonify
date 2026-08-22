import { createFileRoute } from "@tanstack/react-router";
import { PantallaFavoritos } from "@/pantallas/favoritos/PantallaFavoritos";

export const Route = createFileRoute("/_authenticated/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — Jhonify" },
      { name: "description", content: "Tus canciones favoritas guardadas en Jhonify." },
      { property: "og:title", content: "Favoritos — Jhonify" },
      { property: "og:description", content: "Tus canciones favoritas." },
    ],
  }),
  component: PantallaFavoritos,
});
