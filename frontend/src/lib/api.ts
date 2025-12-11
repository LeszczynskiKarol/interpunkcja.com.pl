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
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
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

export interface CheckResponse {
  correctedText: string;
  corrections: Correction[];
  errorCount: number;
  usage: {
    remainingChecks: number;
    remainingChars: number;
    plan: string;
  };
}

export interface CheckStatusResponse {
  canCheck: boolean;
  reason?: string;
  remainingChecks: number;
  remainingChars: number;
  plan: string;
}

// API Functions
export const checkPunctuation = async (
  text: string,
  visitorId?: string
): Promise<CheckResponse> => {
  const response = await api.post("/api/check", { text, visitorId });
  return response.data;
};

export const getCheckStatus = async (
  visitorId?: string
): Promise<CheckStatusResponse> => {
  const response = await api.get("/api/check/status", {
    params: { visitorId },
  });
  return response.data;
};

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

export const getMe = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};
