import Keycloak, {
  type KeycloakInitOptions,
  type KeycloakLoginOptions,
} from "keycloak-js";

import { env, isE2eAuthBypass } from "@/app/env";

let keycloak: Keycloak | null = null;
let initPromise: Promise<boolean> | null = null;

/** Proactive refresh window used by API calls (seconds). */
export const ACCESS_TOKEN_MIN_VALIDITY_SEC = 30;

/** Refresh window used by the onTokenExpired handler (seconds). */
export const EXPIRED_TOKEN_MIN_VALIDITY_SEC = 5;

export const SILENT_CHECK_SSO_PATH = "/silent-check-sso.html";

const FRESH_LOGIN_FLAG = "dx-fresh-login";

/**
 * Force a blank Keycloak login form (no SSO reuse, no remembered username).
 * `maxAge: 0` ignores an existing SSO session; `prompt: "login"` requires credentials.
 */
export const freshLoginOptions = {
  prompt: "login",
  maxAge: 0,
} as const satisfies KeycloakLoginOptions;

/**
 * Silent SSO check: restores an existing Keycloak session in a hidden iframe
 * so a normal page reload does not bounce through the full login redirect.
 * If there is no SSO session, callers should prompt login explicitly.
 */
export const keycloakInitOptions: KeycloakInitOptions = {
  onLoad: "check-sso",
  checkLoginIframe: false,
  silentCheckSsoFallback: true,
  pkceMethod: "S256",
  flow: "standard",
  responseMode: "fragment",
  useNonce: true,
};

export function getKeycloak() {
  keycloak ??= new Keycloak({
    url: env.NEXT_PUBLIC_KEYCLOAK_URL,
    realm: env.NEXT_PUBLIC_KEYCLOAK_REALM,
    clientId: env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  });
  return keycloak;
}

/** Keep the current path after interactive login (same-origin only). */
export function appRedirectUri() {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}${window.location.pathname}${window.location.search}`;
}

/** After logout, land on the app origin (then open a fresh login form). */
export function logoutRedirectUri() {
  if (typeof window === "undefined") return undefined;
  return window.location.origin;
}

export function silentCheckSsoRedirectUri() {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}${SILENT_CHECK_SSO_PATH}`;
}

/**
 * Reject open redirects: only same-origin absolute URLs (or relative paths) are allowed.
 */
export function sameOriginRedirectUri(
  candidate: string | undefined,
  fallback: () => string | undefined,
): string | undefined {
  const safeFallback = fallback();
  if (!candidate || typeof window === "undefined") return safeFallback;

  try {
    const url = new URL(candidate, window.location.origin);
    if (url.origin !== window.location.origin) {
      return safeFallback;
    }
    return `${url.origin}${url.pathname}${url.search}`;
  } catch {
    return safeFallback;
  }
}

export function markFreshLoginRequired() {
  try {
    sessionStorage.setItem(FRESH_LOGIN_FLAG, "1");
  } catch {
    // Private mode / blocked storage — login still uses freshLoginOptions.
  }
}

export function isFreshLoginRequired() {
  try {
    return sessionStorage.getItem(FRESH_LOGIN_FLAG) === "1";
  } catch {
    return false;
  }
}

export function clearFreshLoginRequired() {
  try {
    sessionStorage.removeItem(FRESH_LOGIN_FLAG);
  } catch {
    // ignore
  }
}

/**
 * Keycloak allows init() once per instance; share the promise across Strict Mode remounts.
 * Uses silent check-sso when possible; falls back to interactive login when no session exists.
 */
export function initKeycloak() {
  if (isE2eAuthBypass()) {
    return Promise.resolve(true);
  }

  const instance = getKeycloak();
  initPromise ??= (async () => {
    const wantFreshLogin = isFreshLoginRequired();

    const authenticated = await instance.init({
      ...keycloakInitOptions,
      silentCheckSsoRedirectUri: silentCheckSsoRedirectUri(),
    });

    if (wantFreshLogin) {
      clearFreshLoginRequired();
      clearLocalTokens();
      // Blank login form after IdP logout cleared remember-me / username cookies.
      await instance.login({
        ...freshLoginOptions,
        redirectUri: appRedirectUri(),
      });
      return false;
    }

    if (authenticated) {
      return true;
    }

    await instance.login({
      redirectUri: appRedirectUri(),
    });
    return false;
  })();

  return initPromise;
}

export function isKeycloakAuthenticated(instance = getKeycloak()) {
  return Boolean(instance.token && instance.idToken);
}

/** Drop in-memory tokens without contacting Keycloak (local sign-out / failed refresh). */
export function clearLocalTokens() {
  if (isE2eAuthBypass() || !keycloak) return;
  try {
    keycloak.clearToken();
  } catch {
    // Instance may not be fully initialized yet.
  }
}

/**
 * Refresh the access token when it is about to expire.
 * Returns null when the session cannot be refreshed (caller should re-login).
 */
export async function ensureFreshToken(
  minValiditySec = ACCESS_TOKEN_MIN_VALIDITY_SEC,
): Promise<string | null> {
  if (isE2eAuthBypass()) {
    return "e2e-bypass-token";
  }

  const instance = getKeycloak();
  if (!instance.authenticated || !instance.token) {
    return null;
  }

  try {
    await instance.updateToken(minValiditySec);
    return instance.token ?? null;
  } catch {
    clearLocalTokens();
    return null;
  }
}

export async function loginRequired(options?: KeycloakLoginOptions) {
  if (isE2eAuthBypass()) return;
  const instance = getKeycloak();
  await instance.login({
    ...options,
    redirectUri: sameOriginRedirectUri(options?.redirectUri, appRedirectUri),
  });
}

/**
 * End the Keycloak SSO session (clears remembered username), return to the app,
 * then open a fresh login form with no prefilled user.
 */
export async function logoutSession(options?: { redirectUri?: string }) {
  if (isE2eAuthBypass()) return;

  const instance = getKeycloak();
  const redirectUri = sameOriginRedirectUri(
    options?.redirectUri,
    logoutRedirectUri,
  );

  markFreshLoginRequired();

  const logoutUrl = instance.createLogoutUrl({ redirectUri });
  clearLocalTokens();
  initPromise = null;
  window.location.assign(logoutUrl);
}
