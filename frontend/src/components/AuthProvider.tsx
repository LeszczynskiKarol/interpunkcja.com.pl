// frontend/src/components/AuthProvider.tsx
import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - wrapper który automatycznie odświeża dane użytkownika
 * Dodaj go w App.tsx owijając całą aplikację
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, refreshUser } = useAuthStore();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    // Odśwież dane użytkownika przy pierwszym renderze (jeśli zalogowany)
    if (isAuthenticated && !hasRefreshed.current) {
      hasRefreshed.current = true;
      refreshUser();
    }
  }, [isAuthenticated, refreshUser]);

  // Odśwież dane przy powrocie do okna/tabu
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isAuthenticated) {
        refreshUser();
      }
    };

    const handleFocus = () => {
      if (isAuthenticated) {
        refreshUser();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated, refreshUser]);

  return <>{children}</>;
}
