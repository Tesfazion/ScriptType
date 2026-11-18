"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, firebaseConfigured } from "@/lib/firebase";
import { syncPendingPractice } from "@/lib/progress-service";
import { syncAccountPreferences } from "@/lib/account-preferences";

type AuthState = {
  user: User | null;
  loading: boolean;
  firebaseConfigured: boolean;
  isOnline: boolean;
  offlineSupportReady: boolean;
  offlineSupportError: string;
  syncError: string;
};

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  firebaseConfigured: false,
  isOnline: true,
  offlineSupportReady: false,
  offlineSupportError: "",
  syncError: "",
});

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(firebaseConfigured);
  const [isOnline, setIsOnline] = useState(() =>
    typeof window === "undefined" ? true : window.navigator.onLine,
  );
  const [offlineSupportReady, setOfflineSupportReady] = useState(() =>
    typeof window !== "undefined" && "serviceWorker" in window.navigator,
  );
  const [offlineSupportError, setOfflineSupportError] = useState(() =>
    typeof window !== "undefined" && !("serviceWorker" in window.navigator)
      ? "This browser does not support offline app storage."
      : "",
  );
  const [syncError, setSyncError] = useState("");

  useEffect(() => {
    if (!firebaseAuth) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    return onAuthStateChanged(
      firebaseAuth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      () => {
        setUser(null);
        setLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if ("serviceWorker" in window.navigator) {
      window.navigator.serviceWorker
        .register("/sw.js")
        .then(() => setOfflineSupportReady(true))
        .catch(() =>
          setOfflineSupportError(
            "Offline support could not start. Check your connection and reload ScriptType.",
          ),
        );
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!user || !isOnline) return;
    let active = true;

    const sync = () => {
      void Promise.all([syncPendingPractice(), syncAccountPreferences()])
        .then(() => {
          if (active) setSyncError("");
        })
        .catch((error: unknown) => {
          if (active) {
            setSyncError(
              error instanceof Error
                ? error.message
                : "Saved changes could not be synced.",
            );
          }
        });
    };

    sync();
    window.addEventListener("online", sync);
    return () => {
      active = false;
      window.removeEventListener("online", sync);
    };
  }, [user, isOnline]);

  const value = useMemo(
    () => ({
      user,
      loading,
      firebaseConfigured,
      isOnline,
      offlineSupportReady,
      offlineSupportError,
      syncError,
    }),
    [user, loading, isOnline, offlineSupportReady, offlineSupportError, syncError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
