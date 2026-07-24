import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/lib/theme";
import { Logo } from "@/components/Logo";
import { BlueButton, Input } from "@/components/AppShell";
import { Moon, Sun } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Jhonify" },
      { name: "description", content: "Accede a tu cuenta Jhonify con correo o número." },
      { property: "og:title", content: "Iniciar sesión — Jhonify" },
      { property: "og:description", content: "Accede a tu cuenta Jhonify." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const isEmail = identifier.includes("@");
      const { error } = isEmail
        ? await supabase.auth.signInWithPassword({ email: identifier.trim(), password })
        : await supabase.auth.signInWithPassword({ phone: identifier.trim(), password });
      if (error) throw error;
      navigate({ to: "/home" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <button
        onClick={toggle}
        aria-label="Cambiar tema"
        className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-3">
          <Logo size="lg" />
          <p className="text-sm text-muted-foreground">Inicia sesión para escuchar música</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="text-sm font-medium">Correo o número</label>
          <Input
            required
            autoComplete="username"
            placeholder="tucorreo@ejemplo.com  o  +5215512345678"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <label className="text-sm font-medium">Contraseña</label>
          <Input
            required
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <BlueButton type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Iniciar sesión"}
          </BlueButton>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
