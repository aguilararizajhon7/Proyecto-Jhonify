import {useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BlueButton, Input } from "@/diseno/LayoutApp";


export function PantallaPerfil() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("No user");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (error) throw error;
      return { user: userData.user, profile: data };
    },
  });

  useEffect(() => {
    if (data?.profile?.display_name) setDisplayName(data.profile.display_name);
  }, [data]);

  async function save() {
    if (!data?.user) return;
    setSaving(true);
    await supabase
      .from("profiles")
      .upsert({ id: data.user.id, display_name: displayName, updated_at: new Date().toISOString() });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/iniciar-sesion" });
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando...</p>;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-bold">Perfil</h1>
      <div className="flex items-center gap-4">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
          {(displayName || data?.user?.email || "?")[0]?.toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="truncate font-semibold">{displayName || "Sin nombre"}</div>
          <div className="truncate text-sm text-muted-foreground">
            {data?.user?.email || data?.user?.phone}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Nombre</label>
        <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <BlueButton onClick={save} disabled={saving} className="w-full">
          {saving ? "Guardando..." : saved ? "¡Guardado!" : "Guardar"}
        </BlueButton>
      </div>

      <BlueButton onClick={signOut} className="w-full">
        Cerrar sesión
      </BlueButton>
    </div>
  );
}
