import { env, isE2eAuthBypass } from "@/app/env";

import { ensureFreshToken, loginRequired } from "./keycloak";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Only send the bearer token to the configured API origin. */
export function resolveApiUrl(path: string): string {
  if (!path.startsWith("http")) {
    return `${env.NEXT_PUBLIC_API_PREFIX}${path}`;
  }

  const allowed = new URL(env.NEXT_PUBLIC_API_PREFIX);
  let target: URL;
  try {
    target = new URL(path);
  } catch {
    throw new ApiError("Invalid API URL", 400);
  }

  if (target.origin !== allowed.origin) {
    throw new ApiError("Refusing to send credentials to an untrusted host", 400);
  }

  return path;
}

export async function getAccessToken(): Promise<string | null> {
  if (isE2eAuthBypass()) {
    return "e2e-bypass-token";
  }

  const token = await ensureFreshToken();
  if (token) return token;

  void loginRequired();
  return null;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await getAccessToken();
  if (!token) {
    throw new ApiError("Not authenticated", 401);
  }

  const url = resolveApiUrl(path);
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
    // Cross-origin API auth is bearer-only; do not attach cookies.
    credentials: "omit",
  });

  if (response.status === 401 && !isE2eAuthBypass()) {
    void loginRequired();
    throw new ApiError("Session expired", 401);
  }

  if (!response.ok) {
    throw new ApiError(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
