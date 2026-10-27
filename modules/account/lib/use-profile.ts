"use client";

import { useAuth } from "../components/auth-provider";
import { initialsFromDisplayName, type CurrentUser } from "./session";

export type ProfileView = {
  profile: CurrentUser | null;
  displayName: string;
  userName: string;
  email: string;
  avatarSrc: string | undefined;
  initials: string;
  locale: string | null;
  timezone: string | null;
  phone: string | null;
  birthDate: string | null;
  status: number | null;
  preferences: Record<string, unknown>;
  agentId: number | null;
  branchId: number | null;
  merchantId: number | null;
  isImpersonating: boolean;
  impersonator: CurrentUser["impersonator"];
  authenticated: boolean;
  initialized: boolean;
  hasPermission: (module: string, resource: string, action: string) => boolean;
};

/**
 * Common signed-in profile view for UI (avatar, menu, intake attribution).
 * Reads the AuthProvider identity that was loaded from `/kernel/v1/users/current`.
 */
export function useProfile(): ProfileView {
  const { user, authenticated, initialized, hasPermission } = useAuth();
  const displayName =
    user?.displayName?.trim() ||
    user?.userName?.trim() ||
    user?.email?.trim() ||
    "";
  const avatarSrc = user?.avatar?.trim() || undefined;

  return {
    profile: user,
    displayName,
    userName: user?.userName ?? "",
    email: user?.email ?? "",
    avatarSrc,
    initials: initialsFromDisplayName(displayName || "?"),
    locale: user?.locale ?? null,
    timezone: user?.timezone ?? null,
    phone: user?.phone ?? null,
    birthDate: user?.birthDate ?? null,
    status: user?.status ?? null,
    preferences: user?.preferences ?? {},
    agentId: user?.agentId ?? null,
    branchId: user?.branchId ?? null,
    merchantId: user?.merchantId ?? null,
    isImpersonating: Boolean(user?.impersonator),
    impersonator: user?.impersonator ?? null,
    authenticated,
    initialized,
    hasPermission,
  };
}
