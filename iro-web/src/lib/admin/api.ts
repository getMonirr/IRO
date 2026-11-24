const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

// the access token lives only in memory; the refresh token is an httpOnly cookie set by the API
let accessToken: string | null = null;
export const setToken = (t: string | null) => {
  accessToken = t;
};

let refreshing: Promise<string | null> | null = null;
/** One shared in-flight refresh, so parallel calls never replay (and burn) the same refresh token. */
export function refreshAccessToken(): Promise<string | null> {
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await fetch(`${BASE}/api/v1/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          accessToken = null;
          return null;
        }
        accessToken = (await res.json()).data.accessToken as string;
        return accessToken;
      } catch {
        return null;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

type Query = Record<string, string | number | boolean | undefined>;
type Opts = { method?: string; body?: unknown; query?: Query };

async function send(path: string, o: Opts) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(o.query ?? {}))
    if (v !== undefined && v !== "") params.set(k, String(v));
  const qs = params.toString() ? `?${params}` : "";
  try {
    const formData =
      typeof FormData !== "undefined" && o.body instanceof FormData;
    return await fetch(`${BASE}/api/v1${path}${qs}`, {
      method: o.method ?? "GET",
      credentials: "include",
      headers: {
        ...(formData ? {} : { "Content-Type": "application/json" }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body:
        o.body !== undefined
          ? formData
            ? (o.body as FormData)
            : JSON.stringify(o.body)
          : undefined,
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Check that the API is running and NEXT_PUBLIC_API_URL is correct.",
      0,
    );
  }
}

export async function apiUpload<T = unknown>(
  path: string,
  formData: FormData,
): Promise<{ data: T; meta?: Meta; message?: string }> {
  let res = await send(path, { method: "POST", body: formData });
  if (res.status === 401) {
    if (await refreshAccessToken())
      res = await send(path, { method: "POST", body: formData });
  }
  const json = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(
      json?.errorMessage ?? json?.message ?? `Upload failed (${res.status})`,
      res.status,
    );
  return json;
}

export async function api<T = unknown>(
  path: string,
  o: Opts = {},
): Promise<{ data: T; meta?: Meta; message?: string }> {
  let res = await send(path, o);
  if (res.status === 401 && !path.startsWith("/auth/")) {
    if (await refreshAccessToken()) res = await send(path, o);
  }
  const json = await res.json().catch(() => null);
  if (!res.ok)
    throw new ApiError(
      json?.errorMessage ?? json?.message ?? `Request failed (${res.status})`,
      res.status,
    );
  return json;
}
