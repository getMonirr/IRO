"use client";
import { useEffect, useState } from "react";
import { api, type Meta } from "./api";

type Query = Record<string, string | number | boolean | undefined>;

/** GET helper: pass path = null to skip. Re-fetches when the query changes or reload() is called. */
export function useFetch<T>(path: string | null, query?: Query) {
  const [state, setState] = useState<{ data?: T; meta?: Meta; error?: string; loading: boolean }>({ loading: path !== null });
  const [tick, setTick] = useState(0);
  const key = `${path}|${JSON.stringify(query ?? {})}|${tick}`;

  useEffect(() => {
    if (path === null) return;
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: undefined }));
    api<T>(path, { query })
      .then((r) => alive && setState({ data: r.data, meta: r.meta, loading: false }))
      .catch((e: Error) => alive && setState({ loading: false, error: e.message }));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { ...state, reload: () => setTick((t) => t + 1) };
}
