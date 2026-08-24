// Shim react-router-dom dla komponentów skopiowanych z SPA.
// Publiczny front jest wielostronicowy, więc Link to zwykły <a href>.
import type { AnchorHTMLAttributes, ReactNode } from "react";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children?: ReactNode;
}

export function Link({ to, children, ...rest }: LinkProps) {
  return (
    <a href={to} {...rest}>
      {children}
    </a>
  );
}

export function useNavigate() {
  return (to: string) => {
    if (typeof window !== "undefined") {
      window.location.href = to;
    }
  };
}

export function useParams(): Record<string, string | undefined> {
  return {};
}
