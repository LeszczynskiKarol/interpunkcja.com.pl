// frontend/src/App.tsx
// Po migracji frontu publicznego na Astro (frontend-astro/) SPA obsługuje
// wyłącznie część aplikacyjną: auth, panel, konto, historię, płatności i admin.
// Strona główna, landingi SEO, cennik, blog i strony prawne żyją w Astro —
// nginx kieruje je do serwera Astro, a linki do nich w SPA to zwykłe <a href>.
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { AuthCallbackPage } from "./pages/auth/AuthCallbackPage";
import { LimitsUpdateBanner } from "./components/LimitsUpdateBanner";
import { CookieBanner } from "./components/CookieBanner";
import { Toaster } from "react-hot-toast";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { CheckEmailPage } from "./pages/auth/CheckEmailPage";
import { AuthProvider } from "./components/AuthProvider";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { ResendVerificationPage } from "./pages/auth/ResendVerificationPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { AccountPage } from "./pages/AccountPage";
import { HistoryPage } from "./pages/HistoryPage";
import { PaymentPage } from "./pages/PaymentPage";
import { PaymentSuccessPage } from "./pages/PaymentSuccessPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminChecks } from "./pages/admin/AdminChecks";
import { AdminStats } from "./pages/admin/AdminStats";
import { AdminArticles } from "./pages/admin/AdminArticles";
import { AdminPurchases } from "./pages/admin/AdminPurchases";
import { AdminCorrectionDebug } from "./pages/admin/AdminCorrectionDebug";
import { AdminAPIAnalytics } from "./pages/admin/AdminAPIAnalytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

// Prefiksy tras obsługiwanych przez SPA (musi odpowiadać konfiguracji nginx)
const SPA_PREFIXES = [
  "/panel",
  "/konto",
  "/historia",
  "/logowanie",
  "/rejestracja",
  "/sprawdz-email",
  "/weryfikacja",
  "/wyslij-ponownie",
  "/przypomnij-haslo",
  "/resetuj-haslo",
  "/platnosc",
  "/admin",
  "/auth",
];

// Trasa nieznana routerowi = strona publiczna (Astro) albo literówka.
// Pełne przejście przeglądarki — nginx skieruje żądanie we właściwe miejsce.
function FullPageRedirect() {
  useEffect(() => {
    const path = window.location.pathname;
    const isSpaPath = SPA_PREFIXES.some(
      (p) => path === p || path.startsWith(p + "/"),
    );
    if (isSpaPath) {
      // Nieistniejąca podstrona aplikacji — wróć do panelu (bez pętli przeładowań)
      window.location.replace("/panel");
    } else {
      window.location.replace(path + window.location.search);
    }
  }, []);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <LimitsUpdateBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth/callback" element={<AuthCallbackPage />} />

              {/* Protected routes - wymagają logowania */}
              <Route
                path="/panel"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/konto"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AccountPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/historia"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <HistoryPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Płatności */}
              <Route
                path="/platnosc/:plan"
                element={
                  <Layout>
                    <PaymentPage />
                  </Layout>
                }
              />
              <Route
                path="/platnosc/sukces"
                element={
                  <Layout>
                    <PaymentSuccessPage />
                  </Layout>
                }
              />

              {/* Auth routes - bez layoutu */}
              <Route path="/logowanie" element={<LoginPage />} />
              <Route path="/rejestracja" element={<RegisterPage />} />
              <Route path="/sprawdz-email" element={<CheckEmailPage />} />
              <Route path="/weryfikacja" element={<VerifyEmailPage />} />
              <Route
                path="/wyslij-ponownie"
                element={<ResendVerificationPage />}
              />
              <Route
                path="/przypomnij-haslo"
                element={<ForgotPasswordPage />}
              />
              <Route path="/resetuj-haslo" element={<ResetPasswordPage />} />

              {/* Admin routes - własny layout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="uzytkownicy" element={<AdminUsers />} />
                <Route path="sprawdzenia" element={<AdminChecks />} />
                <Route path="zakupy" element={<AdminPurchases />} />
                <Route path="statystyki" element={<AdminStats />} />
                <Route path="analityka-api" element={<AdminAPIAnalytics />} />
                <Route path="artykuly" element={<AdminArticles />} />
                <Route path="debug" element={<AdminCorrectionDebug />} />
              </Route>

              {/* Strony publiczne żyją w Astro — pełne przejście */}
              <Route path="*" element={<FullPageRedirect />} />
            </Routes>
            <CookieBanner />
          </AuthProvider>
        </BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
