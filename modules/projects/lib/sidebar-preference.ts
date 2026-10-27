export const sidebarCollapsedCookie = "DX_SIDEBAR_COLLAPSED";

const maxAgeSeconds = 60 * 60 * 24 * 365;

export function parseSidebarCollapsed(
  value: string | undefined | null,
): boolean {
  return value === "1";
}

export function readSidebarCollapsedCookie(): boolean {
  if (typeof document === "undefined") return false;
  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${sidebarCollapsedCookie}=`));
  return parseSidebarCollapsed(match?.split("=")[1]);
}

export function writeSidebarCollapsedCookie(collapsed: boolean): void {
  if (typeof document === "undefined") return;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${sidebarCollapsedCookie}=${collapsed ? "1" : "0"}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}
