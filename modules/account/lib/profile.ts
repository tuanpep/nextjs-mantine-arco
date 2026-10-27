import { env } from "@/app/env";

import { apiFetch } from "./api-client";
import type { AuthorityMap, CurrentUser, Impersonator } from "./session";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

function asNullableString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = asString(value).trim();
  return text.length > 0 ? text : null;
}

function asNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

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

function normalizePreferences(
  value: unknown,
): Record<string, unknown> | undefined {
  const record = asRecord(value);
  if (!record) return undefined;

  const preferences: Record<string, unknown> = {};
  for (const [key, raw] of Object.entries(record)) {
    if (typeof raw !== "string") {
      preferences[key] = raw;
      continue;
    }
    try {
      preferences[key] = JSON.parse(raw) as unknown;
    } catch {
      preferences[key] = raw;
    }
  }
  return preferences;
}

function normalizeImpersonator(value: unknown): Impersonator | null {
  const record = asRecord(value);
  if (!record) return null;

  const id = asNullableString(record.id ?? record.userId);
  if (!id) return null;

  return {
    id,
    userName: asString(record.userName ?? record.username),
    email: asString(record.email ?? record.emailAddress),
    companyId: asNullableNumber(record.companyId),
    branchId: asNullableNumber(record.branchId),
    merchantId: asNullableNumber(record.merchantId),
    agentId: asNullableNumber(record.agentId),
  };
}

/** Map a kernel `/users/current` payload into the app CurrentUser shape. */
export function normalizeCurrentUser(raw: unknown): CurrentUser {
  const record = asRecord(raw) ?? {};
  const id = asNullableString(record.id ?? record.userId) ?? "unknown";
  const userName = asString(record.userName ?? record.username);
  const displayName =
    asNullableString(record.displayName ?? record.name) ??
    (userName || "Signed-in user");
  const email = asString(record.email ?? record.emailAddress);
  const authority = isAuthorityMap(record.authority) ? record.authority : null;

  return {
    id,
    userName,
    displayName,
    email,
    avatar: asNullableString(record.avatar ?? record.avatarUrl),
    birthDate: asNullableString(record.birthDate),
    phone: asNullableString(record.phone ?? record.phoneNumber),
    locale: asNullableString(record.locale),
    timezone: asNullableString(record.timezone),
    status: asNullableNumber(record.status),
    authority,
    preferences: normalizePreferences(record.preferences) ?? {},
    agentId: asNullableNumber(record.agentId),
    branchId: asNullableNumber(record.branchId),
    merchantId: asNullableNumber(record.merchantId),
    impersonator: normalizeImpersonator(record.impersonator),
  };
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const payload = await apiFetch<unknown>(env.NEXT_PUBLIC_PROFILE_URI);
  return normalizeCurrentUser(payload);
}
