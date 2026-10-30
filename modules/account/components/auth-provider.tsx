"use client";

import { Center, Loader, Stack, Text } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { env, isE2eAuthBypass } from "@/app/env";

import {
  EXPIRED_TOKEN_MIN_VALIDITY_SEC,
  clearLocalTokens,
  getKeycloak,
  initKeycloak,
  isKeycloakAuthenticated,
  loginRequired,
  logoutSession,
} from "../lib/keycloak";
import { fetchPermissions } from "../lib/permissions";
import { fetchCurrentUser } from "../lib/profile";
import {
  bypassUser,
  isCacheFresh,
  type AuthorityMap,
  type CurrentUser,
} from "../lib/session";
import {
  userFromTokenClaims,
  type KeycloakTokenClaims,
} from "../lib/token-claims";

type AuthContextValue = {
  initialized: boolean;
  authenticated: boolean;
  user: CurrentUser | null;
  permissions: AuthorityMap | null;
  logIn: () => Promise<void>;
  logOut: () => Promise<void>;
  refreshIdentity: () => Promise<void>;
  hasPermission: (module: string, resource: string, action: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthLoading() {
  return (
    <Center mih="100vh">
      <Stack align="center" gap="sm" role="status" aria-label="Đang tải">
        <Loader size="sm" />
        <Text size="sm" c="dimmed">
          Đang tải…
        </Text>
      </Stack>
    </Center>
  );
}

function clearSessionState(
  setUser: (user: CurrentUser | null) => void,
  setPermissions: (permissions: AuthorityMap | null) => void,
  setAuthenticated: (value: boolean) => void,
  cacheExpiresAt: { current: number | null },
) {
  cacheExpiresAt.current = null;
  clearLocalTokens();
  setUser(null);
  setPermissions(null);
  setAuthenticated(false);
}

const e2eBypass = isE2eAuthBypass();

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const cacheExpiresAt = useRef<number | null>(null);
  const identityRequestId = useRef(0);
  const [initialized, setInitialized] = useState(e2eBypass);
  const [authenticated, setAuthenticated] = useState(e2eBypass);
  const [user, setUser] = useState<CurrentUser | null>(
    e2eBypass ? bypassUser : null,
  );
  const [permissions, setPermissions] = useState<AuthorityMap | null>(
    e2eBypass ? {} : null,
  );
  const [ready, setReady] = useState(e2eBypass);

  const applyTokenFallback = useCallback(() => {
    const keycloak = getKeycloak();
    setUser(
      userFromTokenClaims(
        keycloak.tokenParsed as KeycloakTokenClaims | undefined,
        keycloak.subject,
      ),
    );
    setPermissions({});
  }, []);

  const loadIdentity = useCallback(
    async (options?: { force?: boolean }) => {
      if (!options?.force && isCacheFresh(cacheExpiresAt.current)) {
        return;
      }

      const requestId = ++identityRequestId.current;

      try {
        const [nextUser, nextPermissions] = await Promise.all([
          fetchCurrentUser(),
          fetchPermissions().catch(() => null),
        ]);
        if (requestId !== identityRequestId.current) return;

        const authority =
          nextPermissions ?? nextUser.authority ?? ({} as AuthorityMap);
        setUser(nextUser);
        setPermissions(authority);
        cacheExpiresAt.current =
          Date.now() + env.NEXT_PUBLIC_DISPLAY_CACHE_TIME;
      } catch (error) {
        console.error("Failed to load profile/permissions", error);
        if (requestId !== identityRequestId.current) return;
        applyTokenFallback();
      }
    },
    [applyTokenFallback],
  );

  const refreshIdentity = useCallback(async () => {
    if (isE2eAuthBypass()) {
      setUser(bypassUser);
      setPermissions({});
      return;
    }
    if (!getKeycloak().token) return;
    await loadIdentity({ force: true });
  }, [loadIdentity]);

  useEffect(() => {
    let cancelled = false;

    if (e2eBypass) {
      return;
    }

    const keycloak = getKeycloak();

    const markReady = () => {
      if (!cancelled) setReady(true);
    };

    const syncAuthenticated = (event: string) => {
      if (cancelled) return;

      const isAuthenticated = isKeycloakAuthenticated(keycloak);
      setInitialized(true);
      setAuthenticated(isAuthenticated);

      if (!isAuthenticated) {
        if (event === "onAuthLogout") {
          clearSessionState(
            setUser,
            setPermissions,
            setAuthenticated,
            cacheExpiresAt,
          );
          queryClient.clear();
        }
        // Stay on the loading shell while interactive login navigates away.
        return;
      }

      if (!keycloak.token) {
        return;
      }

      const shouldLoadProfile =
        event === "onReady" ||
        event === "onAuthSuccess" ||
        event === "onAuthRefreshSuccess" ||
        event === "onInit";

      if (shouldLoadProfile) {
        void loadIdentity().finally(markReady);
        return;
      }

      markReady();
    };

    const onError = (event: string) => {
      console.error(`Keycloak ${event}`);
      if (cancelled) return;
      clearLocalTokens();
      setInitialized(true);
      setAuthenticated(false);
      void loginRequired();
    };

    keycloak.onReady = () => syncAuthenticated("onReady");
    keycloak.onAuthSuccess = () => syncAuthenticated("onAuthSuccess");
    keycloak.onAuthRefreshSuccess = () =>
      syncAuthenticated("onAuthRefreshSuccess");
    keycloak.onAuthLogout = () => syncAuthenticated("onAuthLogout");
    keycloak.onAuthError = () => onError("onAuthError");
    keycloak.onAuthRefreshError = () => onError("onAuthRefreshError");
    keycloak.onTokenExpired = () => {
      void keycloak.updateToken(EXPIRED_TOKEN_MIN_VALIDITY_SEC).catch(() => {
        clearLocalTokens();
        void loginRequired();
      });
    };

    void initKeycloak()
      .then((ok) => {
        if (cancelled) return;
        if (ok) {
          syncAuthenticated("onInit");
          return;
        }
        // Interactive login is in progress (page will navigate).
        setInitialized(true);
        setAuthenticated(false);
      })
      .catch((error: unknown) => {
        console.error("Keycloak init error:", error);
        if (cancelled) return;
        setInitialized(true);
        setAuthenticated(false);
        void loginRequired();
      });

    return () => {
      cancelled = true;
    };
  }, [loadIdentity, queryClient]);

  const logIn = useCallback(async () => {
    if (isE2eAuthBypass()) return;
    await loginRequired();
  }, []);

  const logOut = useCallback(async () => {
    queryClient.clear();

    if (isE2eAuthBypass()) {
      clearSessionState(
        setUser,
        setPermissions,
        setAuthenticated,
        cacheExpiresAt,
      );
      return;
    }

    // Navigates the browser to the Keycloak login page.
    await logoutSession();
  }, [queryClient]);

  const hasPermission = useCallback(
    (module: string, resource: string, action: string) =>
      permissions?.[module]?.[resource]?.includes(action) ?? false,
    [permissions],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      initialized,
      authenticated,
      user,
      permissions,
      logIn,
      logOut,
      refreshIdentity,
      hasPermission,
    }),
    [
      initialized,
      authenticated,
      user,
      permissions,
      logIn,
      logOut,
      refreshIdentity,
      hasPermission,
    ],
  );

  if (!ready || !initialized || !authenticated) {
    return <AuthLoading />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
