// frontend/src/components/LimitsUpdateBanner.tsx
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Info } from "lucide-react";
import { Link } from "./HardLink";
import { useAuthStore } from "../stores/authStore";

const STORAGE_KEY = "interpunkcja-banner-limits-2026-05";

export function LimitsUpdateBanner() {
  const { user, isAuthenticated } = useAuthStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (user.plan !== "FREE") return;

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed === "1") return;

    setVisible(true);
  }, [isAuthenticated, user]);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p className="flex-1 text-sm">
            <strong>Od 15.05.2026 zmiany w planie Free:</strong> 2 sprawdzenia
            dziennie i 20 miesięcznie.{" "}
            <Link
              to="/regulamin"
              className="underline font-medium hover:text-blue-100"
            >
              Zobacz regulamin
            </Link>{" "}
            lub{" "}
            <Link
              to="/cennik"
              className="underline font-medium hover:text-blue-100"
            >
              przejdź na Premium
            </Link>
            .
          </p>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded hover:bg-white/20 transition-colors"
            aria-label="Zamknij baner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
