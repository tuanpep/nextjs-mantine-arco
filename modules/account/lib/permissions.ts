import { env } from "@/app/env";

import { apiFetch } from "./api-client";
import type { AuthorityMap } from "./session";
import { isAuthorized } from "./session";

function isAuthorityMap(value: unknown): value is AuthorityMap {
  if (!value || typeof value !== "object") return false;
  return Object.values(value).every(
    (resource) =>
      resource !== null &&
      typeof resource === "object" &&
      !Array.isArray(resource) &&
      Object.values(resource).every((actions) => Array.isArray(actions)),
  );
}

export async function fetchPermissions(): Promise<AuthorityMap> {
  const data = await apiFetch<unknown>(env.NEXT_PUBLIC_PERMISSION_URI);
  if (data && typeof data === "object" && "authority" in data) {
    const authority = (data as { authority: unknown }).authority;
    return isAuthorityMap(authority) ? authority : {};
  }
  return isAuthorityMap(data) ? data : {};
}

export { isAuthorized };
