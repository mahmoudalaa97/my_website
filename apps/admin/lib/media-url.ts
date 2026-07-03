const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(
  /\/api\/?$/,
  ""
);

/** Turn API storage paths into absolute URLs for img src. */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/storage/")) return `${API_ORIGIN}${url}`;
  return url;
}
