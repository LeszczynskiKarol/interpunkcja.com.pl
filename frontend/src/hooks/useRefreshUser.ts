// frontend/src/hooks/useRefreshUser.ts
import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

/**
 * Hook który odświeża dane użytkownika z serwera
 * Wywołuj w komponentach gdzie potrzebujesz aktualnych danych (np. Panel, Konto)
 */
export function useRefreshUser() {
  const { isAuthenticated, refreshUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [isAuthenticated, refreshUser]);
}

/**
 * Hook który odświeża dane użytkownika z określonym interwałem
 * @param intervalMs - interwał w milisekundach (domyślnie 60 sekund)
 */
export function useRefreshUserInterval(intervalMs: number = 60000) {
  const { isAuthenticated, refreshUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Odśwież od razu
    refreshUser();

    // Ustaw interwał
    const interval = setInterval(() => {
      refreshUser();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshUser, intervalMs]);
}
