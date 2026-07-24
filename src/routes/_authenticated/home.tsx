import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Play, Heart } from "lucide-react";
import { searchYoutube, type YtResult } from "@/lib/youtube.functions";
import { BlueButton, Input } from "@/components/AppShell";
import { usePlayer } from "@/lib/player";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Inicio — Jhonify" },
      { name: "description", content: "Busca canciones en YouTube y reprodúcelas al instante." },
      { property: "og:title", content: "Inicio — Jhonify" },
      { property: "og:description", content: "Busca y reproduce canciones." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<YtResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { play } = usePlayer();
  const router = useRouter();

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await searchYoutube({ data: { q } });
      setResults(res.results);
      if (res.error) setError(res.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar");
    } finally {
      setLoading(false);
    }
  }

  async function playAndSave(r: YtResult) {
    play({ video_id: r.video_id, title: r.title, channel: r.channel, thumbnail: r.thumbnail });
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from("library").upsert(
      {
        user_id: data.user.id,
        video_id: r.video_id,
        title: r.title,
        channel: r.channel,
        thumbnail: r.thumbnail,
        added_at: new Date().toISOString(),
      },
      { onConflict: "user_id,video_id" },
    );
    router.invalidate();
  }

  async function favorite(r: YtResult) {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from("favorites").upsert(
      {
        user_id: data.user.id,
        video_id: r.video_id,
        title: r.title,
        channel: r.channel,
        thumbnail: r.thumbnail,
      },
      { onConflict: "user_id,video_id" },
    );
    router.invalidate();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Buscar música</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Encuentra canciones en YouTube y reprodúcelas.
        </p>
      </div>
      <form onSubmit={onSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Ej. Bad Bunny, rock en español..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <BlueButton type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </BlueButton>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <ul className="space-y-2">
        {results.map((r) => (
          <li
            key={r.video_id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <img src={r.thumbnail} alt="" className="h-16 w-16 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{r.title}</div>
              <div className="truncate text-xs text-muted-foreground">{r.channel}</div>
            </div>
            <button
              onClick={() => favorite(r)}
              aria-label="Agregar a favoritos"
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button
              onClick={() => playAndSave(r)}
              aria-label="Reproducir"
              className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"
            >
              <Play className="h-5 w-5" fill="currentColor" />
            </button>
          </li>
        ))}
        {!loading && results.length === 0 && !error && (
          <li className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Escribe algo y presiona Buscar para empezar.
          </li>
        )}
      </ul>
    </div>
  );
}
