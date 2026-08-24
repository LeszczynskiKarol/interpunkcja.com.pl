// Shim react-helmet-async: meta tagi stron publicznych są ustawiane
// w <head> przez BaseLayout.astro, więc Helmet nic nie renderuje.
import type { ReactNode } from "react";

export function Helmet(_props: { children?: ReactNode }) {
  return null;
}

export function HelmetProvider({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
