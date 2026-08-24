// frontend/src/components/HardLink.tsx
// Zamiennik react-routerowego <Link> dla stron publicznych, które po migracji
// na Astro żyją POZA SPA (strona główna, cennik, blog, strony prawne, landingi).
// Renderuje zwykły <a href>, więc przeglądarka robi pełne przejście i nginx
// kieruje żądanie do serwera Astro zamiast do routera SPA.
import { AnchorHTMLAttributes, ReactNode } from "react";

interface HardLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children?: ReactNode;
}

export function Link({ to, children, ...rest }: HardLinkProps) {
  return (
    <a href={to} {...rest}>
      {children}
    </a>
  );
}
