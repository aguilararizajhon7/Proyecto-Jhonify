import { createFileRoute } from "@tanstack/react-router";
import { PantallaIniciarSesion } from "@/pantallas/iniciar-sesion/PantallaIniciarSesion";

export const Route = createFileRoute("/iniciar-sesion")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Jhonify" },
      { name: "description", content: "Accede a tu cuenta Jhonify con correo o número." },
      { property: "og:title", content: "Iniciar sesión — Jhonify" },
      { property: "og:description", content: "Accede a tu cuenta Jhonify." },
    ],
  }),
  component: PantallaIniciarSesion,
});
