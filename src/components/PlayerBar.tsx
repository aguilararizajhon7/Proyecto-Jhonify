import { X } from "lucide-react";
import { usePlayer } from "@/lib/player";

export function PlayerBar() {
  const { current, stop } = usePlayer();
  if (!current) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface-elevated/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 p-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 sm:w-64">
          {current.thumbnail && (
            <img src={current.thumbnail} alt="" className="h-12 w-12 rounded object-cover" />
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{current.title}</div>
            <div className="truncate text-xs text-muted-foreground">{current.channel}</div>
          </div>
          <button
            onClick={stop}
            aria-label="Cerrar reproductor"
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden rounded-lg">
          <iframe
            key={current.video_id}
            title={current.title}
            width="100%"
            height="80"
            src={`https://www.youtube.com/embed/${current.video_id}?autoplay=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="block w-full"
          />
        </div>
      </div>
    </div>
  );
}
