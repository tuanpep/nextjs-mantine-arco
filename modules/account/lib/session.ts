/** module -> resource -> actions */
export type AuthorityMap = Record<string, Record<string, string[]>>;

/** Present when the signed-in session is impersonating another user. */
export type Impersonator = {
  id: string;
  userName: string;
  email: string;
  companyId?: number | null;
  branchId?: number | null;
  merchantId?: number | null;
  agentId?: number | null;
};

/**
 * Kernel current-user profile (`GET /kernel/v1/users/current`).
 */
export type CurrentUser = {
  id: string;
  userName: string;
  displayName: string;
  email: string;
  avatar?: string | null;
  birthDate?: string | null;
  phone?: string | null;
  locale?: string | null;
  timezone?: string | null;
  status?: number | null;
  authority?: AuthorityMap | null;
  preferences?: Record<string, unknown>;
  agentId?: number | null;
  branchId?: number | null;
  merchantId?: number | null;
  impersonator?: Impersonator | null;
};

export type AccountSession = {
  token: string | null;
  user: CurrentUser | null;
  permissions: AuthorityMap | null;
  cacheExpiresAt: number | null;
};

export const bypassUser: CurrentUser = {
  id: "e2e-user",
  userName: "e2e.user",
  displayName: "E2E User",
  email: "e2e.user@example.com",
  locale: "en",
  timezone: "UTC",
  preferences: {},
};

export function initialsFromDisplayName(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function isCacheFresh(expiresAt: number | null, now = Date.now()) {
  return expiresAt !== null && expiresAt > now;
}

export function isAuthorized(
  authority: AuthorityMap | null | undefined,
  module: string,
  resource: string,
  action: string,
): boolean {
  return authority?.[module]?.[resource]?.includes(action) ?? false;
}
