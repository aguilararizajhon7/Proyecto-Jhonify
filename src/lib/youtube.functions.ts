import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type YtResult = {
  video_id: string;
  title: string;
  channel: string;
  thumbnail: string;
};

const schema = z.object({ q: z.string().trim().min(1).max(100) });

export const searchYoutube = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }): Promise<{ results: YtResult[]; error?: string }> => {
    const key = process.env.YOUTUBE_API_KEY;
    if (!key) {
      return {
        results: [],
        error:
          "Falta configurar YOUTUBE_API_KEY. Pídele al administrador que agregue la clave de YouTube Data API v3.",
      };
    }
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("type", "video");
    url.searchParams.set("videoCategoryId", "10"); // Music
    url.searchParams.set("maxResults", "20");
    url.searchParams.set("q", data.q);
    url.searchParams.set("key", key);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const body = await res.text();
      console.error("YouTube search failed", res.status, body);
      return { results: [], error: `YouTube error ${res.status}` };
    }
    const json = (await res.json()) as {
      items?: Array<{
        id?: { videoId?: string };
        snippet?: {
          title?: string;
          channelTitle?: string;
          thumbnails?: { medium?: { url?: string }; default?: { url?: string } };
        };
      }>;
    };
    const results: YtResult[] = (json.items ?? [])
      .filter((i) => i.id?.videoId)
      .map((i) => ({
        video_id: i.id!.videoId!,
        title: i.snippet?.title ?? "",
        channel: i.snippet?.channelTitle ?? "",
        thumbnail:
          i.snippet?.thumbnails?.medium?.url ?? i.snippet?.thumbnails?.default?.url ?? "",
      }));
    return { results };
  });

const relSchema = z.object({ q: z.string().trim().min(1).max(200), exclude: z.string().optional() });

export const getRelated = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => relSchema.parse(d))
  .handler(async ({ data }): Promise<{ results: YtResult[] }> => {
    const key = process.env.YOUTUBE_API_KEY;
    if (!key) return { results: [] };
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("type", "video");
    url.searchParams.set("videoCategoryId", "10");
    url.searchParams.set("maxResults", "15");
    url.searchParams.set("q", data.q);
    url.searchParams.set("key", key);
    const res = await fetch(url.toString());
    if (!res.ok) return { results: [] };
    const json = (await res.json()) as {
      items?: Array<{
        id?: { videoId?: string };
        snippet?: {
          title?: string;
          channelTitle?: string;
          thumbnails?: { medium?: { url?: string }; default?: { url?: string } };
        };
      }>;
    };
    const results: YtResult[] = (json.items ?? [])
      .filter((i) => i.id?.videoId && i.id.videoId !== data.exclude)
      .map((i) => ({
        video_id: i.id!.videoId!,
        title: i.snippet?.title ?? "",
        channel: i.snippet?.channelTitle ?? "",
        thumbnail:
          i.snippet?.thumbnails?.medium?.url ?? i.snippet?.thumbnails?.default?.url ?? "",
      }));
    return { results };
  });
