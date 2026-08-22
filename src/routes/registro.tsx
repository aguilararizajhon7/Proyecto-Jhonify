import { createFileRoute } from "@tanstack/react-router";
import { PantallaRegistro } from "@/pantallas/registro/PantallaRegistro";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Crear cuenta — Jhonify" },
      { name: "description", content: "Regístrate en Jhonify con tu correo o número." },
      { property: "og:title", content: "Crear cuenta — Jhonify" },
      { property: "og:description", content: "Únete a Jhonify." },
    ],
  }),
  component: PantallaRegistro,
});
