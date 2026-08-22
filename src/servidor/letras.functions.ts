import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ title: z.string().min(1).max(200), channel: z.string().max(200).optional() });

// Parse "Artist - Title (feat. X)" style YouTube titles.
function parseArtistTitle(rawTitle: string, channel?: string): { artist: string; title: string } {
  const clean = rawTitle
    .replace(/\[[^\]]*\]/g, "")
    .replace(/\([^)]*(official|video|audio|lyrics|hd|mv|4k|remix)[^)]*\)/gi, "")
    .replace(/\s+ft\.?\s+.*/i, "")
    .replace(/\s+feat\.?\s+.*/i, "")
    .trim();
  const parts = clean.split(/\s+[-–—]\s+/);
  if (parts.length >= 2) return { artist: parts[0].trim(), title: parts.slice(1).join(" - ").trim() };
  if (channel) return { artist: channel.replace(/\s*-\s*Topic$/i, "").trim(), title: clean };
  return { artist: "", title: clean };
}

export const getLyrics = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }): Promise<{ lyrics: string | null; artist: string; title: string }> => {
    const { artist, title } = parseArtistTitle(data.title, data.channel);
    if (!artist || !title) return { lyrics: null, artist, title };
    try {
      const res = await fetch(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`,
      );
      if (!res.ok) return { lyrics: null, artist, title };
      const json = (await res.json()) as { lyrics?: string };
      return { lyrics: json.lyrics?.trim() || null, artist, title };
    } catch {
      return { lyrics: null, artist, title };
    }
  });
