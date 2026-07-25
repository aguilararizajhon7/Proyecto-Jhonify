import { X, Maximize2, SkipForward } from "lucide-react";
import { usePlayer } from "@/lib/player";

export function PlayerBar() {
  const { current, stop, openFullscreen, next, queue } = usePlayer();
  if (!current) return null;

  return (
    <button
      type="button"
      onClick={openFullscreen}
      className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-surface-elevated/95 text-left backdrop-blur"
      aria-label="Abrir reproductor a pantalla completa"
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 p-3">
        {current.thumbnail && (
          <img src={current.thumbnail} alt="" className="h-12 w-12 rounded object-cover" />
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{current.title}</div>
          <div className="truncate text-xs text-muted-foreground">
            {current.channel}
            {queue.length > 0 ? ` · +${queue.length} en cola` : ""}
          </div>
        </div>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              next();
            }
          }}
          aria-label="Siguiente"
          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <SkipForward className="h-5 w-5" />
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            openFullscreen();
          }}
          aria-label="Pantalla completa"
          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Maximize2 className="h-5 w-5" />
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            stop();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              stop();
            }
          }}
          aria-label="Cerrar reproductor"
          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </span>
      </div>
    </button>
  );
}
