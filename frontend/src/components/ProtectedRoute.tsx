// frontend/src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Przekieruj do logowania, zapamiętaj gdzie chciał iść
    return <Navigate to="/logowanie" state={{ from: location }} replace />;
  }

  // Sprawdź czy email zweryfikowany
  if (!user.emailVerified) {
    return <Navigate to={`/sprawdz-email?email=${user.email}`} replace />;
  }

  return <>{children}</>;
}
