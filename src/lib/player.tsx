import { createContext, useContext, useState, type ReactNode } from "react";

export type Track = {
  video_id: string;
  title: string;
  channel?: string | null;
  thumbnail?: string | null;
};

const PlayerCtx = createContext<{
  current: Track | null;
  play: (t: Track) => void;
  stop: () => void;
}>({ current: null, play: () => {}, stop: () => {} });

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Track | null>(null);
  return (
    <PlayerCtx.Provider value={{ current, play: setCurrent, stop: () => setCurrent(null) }}>
      {children}
    </PlayerCtx.Provider>
  );
}

export const usePlayer = () => useContext(PlayerCtx);
