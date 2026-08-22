import {Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/diseno/Logo";
import { BlueButton, Input } from "@/diseno/LayoutApp";


export function PantallaRegistro() {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      const isEmail = identifier.includes("@");
      const { error } = isEmail
        ? await supabase.auth.signUp({
            email: identifier.trim(),
            password,
            options: {
              emailRedirectTo: window.location.origin,
              data: { display_name: name.trim() },
            },
          })
        : await supabase.auth.signUp({
            phone: identifier.trim(),
            password,
            options: { data: { display_name: name.trim() } },
          });
      if (error) throw error;
      navigate({ to: "/inicio" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-3">
          <Logo size="lg" />
          <p className="text-sm text-muted-foreground">Crea tu cuenta</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label className="text-sm font-medium">Nombre</label>
          <Input required placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="text-sm font-medium">Correo o número</label>
          <Input
            required
            placeholder="tucorreo@ejemplo.com o +5215512345678"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <label className="text-sm font-medium">Contraseña</label>
          <Input
            required
            type="password"
            placeholder="mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <BlueButton type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </BlueButton>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link to="/iniciar-sesion" className="font-semibold text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
