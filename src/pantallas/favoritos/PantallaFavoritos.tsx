import {useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePlayer } from "@/lib/player";


export function PantallaFavoritos() {
  const { play } = usePlayer();
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function remove(id: string) {
    await supabase.from("favorites").delete().eq("id", id);
    router.invalidate();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Favoritos</h1>
      {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}
      {!isLoading && (!data || data.length === 0) && (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Aún no tienes favoritos. Toca el corazón en cualquier canción.
        </p>
      )}
      <ul className="space-y-2">
        {data?.map((f) => (
          <li key={f.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
            {f.thumbnail && <img src={f.thumbnail} alt="" className="h-16 w-16 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{f.title}</div>
              <div className="truncate text-xs text-muted-foreground">{f.channel}</div>
            </div>
            <button
              onClick={() => remove(f.id)}
              aria-label="Quitar"
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={() =>
                play({ video_id: f.video_id, title: f.title, channel: f.channel, thumbnail: f.thumbnail })
              }
              aria-label="Reproducir"
              className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              <Play className="h-5 w-5" fill="currentColor" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
