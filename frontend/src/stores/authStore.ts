// frontend/src/stores/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string | null;
  plan: "FREE" | "PREMIUM" | "LIFETIME";
  role?: "USER" | "ADMIN";
  emailVerified?: boolean;
  createdAt?: string;
  avatarUrl?: string | null;
  authProvider?: "LOCAL" | "GOOGLE";
  hasPassword?: boolean;
  hasGoogle?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isRefreshing: boolean;

  setUser: (user: User) => void;
  setTokens: (tokens: { token: string; refreshToken: string }) => void;
  setAuth: (data: { user: User; token: string; refreshToken: string }) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// API URL - musi być taki sam jak w api.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isRefreshing: false,

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      setTokens: (tokens) => {
        set({
          token: tokens.token,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
      },

      setAuth: (data) => {
        set({
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("interpunkcja-auth");
      },

      // Odśwież dane użytkownika z serwera
      refreshUser: async () => {
        const { token, isRefreshing } = get();

        // Nie odświeżaj jeśli nie ma tokena lub już trwa odświeżanie
        if (!token || isRefreshing) return;

        set({ isRefreshing: true });

        try {
          const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            set({
              user: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                plan: userData.plan,
                role: userData.role,
                emailVerified: userData.emailVerified,
                createdAt: userData.createdAt,
                avatarUrl: userData.avatarUrl,
                authProvider: userData.authProvider,
                hasPassword: userData.hasPassword,
                hasGoogle: userData.hasGoogle,
              },
            });
          } else if (response.status === 401) {
            // Token wygasł - wyloguj
            get().logout();
          }
        } catch (error) {
          console.error("Failed to refresh user data:", error);
        } finally {
          set({ isRefreshing: false });
        }
      },
    }),
    {
      name: "interpunkcja-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
