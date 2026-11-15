import { useEffect, useState } from "react";

export type View = "home" | "practice" | "bank" | "stats";

export interface RouteInfo {
  view: View;
  params: URLSearchParams;
}

const BASE: Record<View, string> = {
  home: "/",
  practice: "/calis",
  bank: "/sorular",
  stats: "/istatistik",
};

type ParamValue = string | number | undefined | null;

export function pathFor(view: View, params?: Record<string, ParamValue>): string {
  const search = new URLSearchParams();
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return `#${BASE[view]}${query ? `?${query}` : ""}`;
}

export function navigate(view: View, params?: Record<string, ParamValue>): void {
  const next = pathFor(view, params);
  if (window.location.hash === next) return;
  window.location.hash = next;
}

/** Sayfa yenilenmeden URL'yi günceller (geri tuşuna kayıt eklemez). */
export function replaceParams(view: View, params?: Record<string, ParamValue>): void {
  const next = pathFor(view, params);
  if (window.location.hash === next) return;
  window.history.replaceState(null, "", next);
}

function parse(hash: string): RouteInfo {
  const cleaned = hash.replace(/^#/, "") || "/";
  const [path, query = ""] = cleaned.split("?");
  const params = new URLSearchParams(query);
  let view: View = "home";
  if (path.startsWith("/calis")) view = "practice";
  else if (path.startsWith("/sorular")) view = "bank";
  else if (path.startsWith("/istatistik")) view = "stats";
  return { view, params };
}

export function useRoute(): RouteInfo {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return parse(hash);
}
