// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { CheckEmailPage } from "./pages/auth/CheckEmailPage";
import { VerifyEmailPage } from "./pages/auth/VerifyEmailPage";
import { ResendVerificationPage } from "./pages/auth/ResendVerificationPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { AccountPage } from "./pages/AccountPage";
import { HistoryPage } from "./pages/HistoryPage";
import { PricingPage } from "./pages/PricingPage";
import { PaymentPage } from "./pages/PaymentPage";
import { PaymentSuccessPage } from "./pages/PaymentSuccessPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

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

          {/* Public pages with layout */}
          <Route
            path="/cennik"
            element={
              <Layout>
                <PricingPage />
              </Layout>
            }
          />
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
          <Route path="/wyslij-ponownie" element={<ResendVerificationPage />} />
          <Route path="/przypomnij-haslo" element={<ForgotPasswordPage />} />
          <Route path="/resetuj-haslo" element={<ResetPasswordPage />} />
        </Routes>
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
  );
}

export default App;
