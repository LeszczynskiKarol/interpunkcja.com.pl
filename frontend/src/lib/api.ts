// frontend/src/lib/api.ts
import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor dodający token JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor obsługujący błędy 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jeśli 401 i nie próbowaliśmy jeszcze refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/auth/refresh`, {
            refreshToken,
          });
          const { token, refreshToken: newRefreshToken } = response.data;

          useAuthStore
            .getState()
            .setTokens({ token, refreshToken: newRefreshToken });
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

// API Types
export interface Correction {
  original: string;
  corrected: string;
  position: { start: number; end: number };
  rule: string;
  explanation: string;
}

export interface TopUpPackage {
  id: string;
  amount: number;
  credits: number;
  label: string;
  priceLabel: string;
  bonus?: number;
}

export interface CheckStatusResponse {
  canCheck: boolean;
  reason?: string;
  remainingChecks: number;
  remainingChars: number;
  bonusChecks: number;
  canUseBonusCheck: boolean;
  plan: string;
  topUpPackages: TopUpPackage[];
  limits: {
    maxCharsPerCheck: number;
    maxChecksPerDay: number;
    maxCharsPerDay: number;
    showExplanations: boolean;
    saveHistory: boolean;
  };
}

export interface CheckResponse {
  correctedText: string;
  corrections: Correction[];
  errorCount: number;
  usedBonusCheck?: boolean;
  usage: {
    remainingChecks: number;
    remainingChars: number;
    bonusChecks: number;
    plan: string;
  };
}

export interface Correction {
  original: string;
  corrected: string;
  position: { start: number; end: number };
  rule: string;
  explanation: string;
}

export interface CheckStatusResponse {
  canCheck: boolean;
  reason?: string;
  remainingChecks: number;
  remainingChars: number;
  plan: string;
}

export async function checkPunctuation(text: string): Promise<CheckResponse> {
  const res = await api.post("/api/check", { text });
  return res.data;
}

export async function getCheckStatus(): Promise<CheckStatusResponse> {
  const res = await api.get("/api/check/status");
  return res.data;
}

export async function createTopUpCheckout(
  packageId: string
): Promise<{ url: string }> {
  const res = await api.post("/api/payments/create-topup-checkout", {
    packageId,
  });
  return res.data;
}

export async function verifyTopUpPayment(sessionId: string): Promise<{
  success: boolean;
  creditsAdded: number;
  totalBonusChecks: number;
  alreadyProcessed?: boolean;
}> {
  const res = await api.post("/api/payments/verify-topup", { sessionId });
  return res.data;
}

export async function getTopUpPackages(): Promise<{
  packages: TopUpPackage[];
}> {
  const res = await api.get("/api/payments/topup-packages");
  return res.data;
}

export async function getTopUpHistory(): Promise<{
  purchases: Array<{
    id: string;
    amount: number;
    creditsGranted: number;
    createdAt: string;
    completedAt: string;
  }>;
}> {
  const res = await api.get("/api/payments/topup-history");
  return res.data;
}

// Auth API Functions
export const login = async (email: string, password: string) => {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  name?: string
) => {
  const response = await api.post("/api/auth/register", {
    email,
    password,
    name,
  });
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await api.post("/api/auth/verify-email", { token });
  return response.data;
};

export const resendVerification = async (email: string) => {
  const response = await api.post("/api/auth/resend-verification", { email });
  return response.data;
};

export const requestPasswordReset = async (email: string) => {
  const response = await api.post("/api/auth/request-password-reset", {
    email,
  });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await api.post("/api/auth/reset-password", {
    token,
    password,
  });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};
