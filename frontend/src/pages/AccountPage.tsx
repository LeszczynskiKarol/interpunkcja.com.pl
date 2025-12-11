// frontend/src/pages/AccountPage.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  User,
  Lock,
  Crown,
  Calendar,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";
import { api } from "../lib/api";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UpdateProfileForm {
  name: string;
}

export function AccountPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "plan">(
    "profile"
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back link */}
        <Link
          to="/panel"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Ustawienia konta
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "profile"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Profil
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "password"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <Lock className="w-4 h-4 inline mr-2" />
            Hasło
          </button>
          <button
            onClick={() => setActiveTab("plan")}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === "plan"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <Crown className="w-4 h-4 inline mr-2" />
            Plan
          </button>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "password" && <PasswordTab />}
          {activeTab === "plan" && <PlanTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileForm>({
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onSubmit = async (data: UpdateProfileForm) => {
    setLoading(true);
    try {
      const response = await api.patch("/api/auth/profile", {
        name: data.name,
      });
      setUser(response.data);
      toast.success("Profil zaktualizowany!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Błąd aktualizacji profilu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Dane profilu
        </h2>

        {/* Email - readonly */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900 dark:text-white">{user?.email}</span>
            {user?.emailVerified && (
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <CheckCircle className="w-3 h-3" />
                Zweryfikowany
              </span>
            )}
          </div>
        </div>

        {/* Name - editable */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Imię
            </label>
            <input
              {...register("name", {
                required: "Imię jest wymagane",
                minLength: { value: 2, message: "Minimum 2 znaki" },
              })}
              className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Zapisz zmiany
          </button>
        </form>
      </div>

      {/* Account info */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Informacje o koncie
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4" />
          Konto utworzone:{" "}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString("pl-PL")
            : "—"}
        </div>
      </div>
    </div>
  );
}

function PasswordTab() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>();

  const onSubmit = async (data: ChangePasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Nowe hasła nie są identyczne");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Hasło zostało zmienione!");
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Błąd zmiany hasła");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Zmiana hasła
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Obecne hasło
          </label>
          <input
            {...register("currentPassword", { required: "Podaj obecne hasło" })}
            type="password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nowe hasło
          </label>
          <input
            {...register("newPassword", {
              required: "Podaj nowe hasło",
              minLength: { value: 8, message: "Minimum 8 znaków" },
            })}
            type="password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Potwierdź nowe hasło
          </label>
          <input
            {...register("confirmPassword", {
              required: "Potwierdź nowe hasło",
            })}
            type="password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Zmień hasło
        </button>
      </form>
    </div>
  );
}

function PlanTab() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    hasSubscription: boolean;
    cancelAtPeriodEnd?: boolean;
    currentPeriodEndFormatted?: string;
  } | null>(null);

  const plans = {
    FREE: {
      name: "Free",
      price: "0 zł",
      features: [
        "5 sprawdzeń dziennie",
        "Do 500 znaków",
        "Podstawowe poprawki",
      ],
    },
    PREMIUM: {
      name: "Premium",
      price: "29 zł/mies",
      features: [
        "100 sprawdzeń dziennie",
        "Do 10 000 znaków",
        "Pełne wyjaśnienia",
        "Historia sprawdzeń",
      ],
    },
    LIFETIME: {
      name: "Lifetime",
      price: "299 zł jednorazowo",
      features: [
        "Bez limitów",
        "Do 50 000 znaków",
        "Pełne wyjaśnienia",
        "Historia sprawdzeń",
        "Priorytetowe wsparcie",
      ],
    },
  };

  const currentPlan = plans[user?.plan || "FREE"];

  // Pobierz status subskrypcji
  useEffect(() => {
    if (user?.plan === "PREMIUM") {
      setLoadingStatus(true);
      api
        .get("/api/payments/subscription-status")
        .then((res) => setSubscriptionStatus(res.data))
        .catch((err) => {
          console.error("Error fetching subscription status:", err);
          setSubscriptionStatus({ hasSubscription: false });
        })
        .finally(() => setLoadingStatus(false));
    }
  }, [user?.plan]);

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Czy na pewno chcesz anulować subskrypcję? Będzie aktywna do końca opłaconego okresu."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/payments/cancel-subscription");
      toast.success(response.data.message);
      setSubscriptionStatus((prev) =>
        prev ? { ...prev, cancelAtPeriodEnd: true } : null
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Błąd anulowania subskrypcji"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    setLoading(true);
    try {
      await api.post("/api/payments/resume-subscription");
      toast.success("Subskrypcja została wznowiona!");
      setSubscriptionStatus((prev) =>
        prev ? { ...prev, cancelAtPeriodEnd: false } : null
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Błąd wznawiania subskrypcji"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Twój plan
      </h2>

      {/* Current plan */}
      <div
        className={`p-6 rounded-xl mb-6 ${
          user?.plan === "FREE"
            ? "bg-gray-100 dark:bg-gray-700"
            : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {user?.plan !== "FREE" && <Crown className="w-5 h-5" />}
          <span className="text-lg font-bold">{currentPlan.name}</span>
          {subscriptionStatus?.cancelAtPeriodEnd && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              Anulowana
            </span>
          )}
        </div>
        <p
          className={`text-2xl font-bold mb-4 ${
            user?.plan === "FREE" ? "text-gray-900 dark:text-white" : ""
          }`}
        >
          {currentPlan.price}
        </p>
        <ul className="space-y-1">
          {currentPlan.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Upgrade CTA */}
      {user?.plan === "FREE" && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Potrzebujesz więcej?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Przejdź na Premium i korzystaj bez ograniczeń!
          </p>
          <a
            href="/cennik"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zobacz plany →
          </a>
        </div>
      )}

      {/* Manage subscription - PREMIUM */}
      {user?.plan === "PREMIUM" && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Zarządzaj subskrypcją
          </h3>

          {loadingStatus ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Ładowanie...
            </div>
          ) : subscriptionStatus?.cancelAtPeriodEnd ? (
            <>
              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-4">
                <p className="text-amber-800 dark:text-amber-200">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Subskrypcja została anulowana i wygaśnie{" "}
                  <strong>
                    {subscriptionStatus.currentPeriodEndFormatted}
                  </strong>
                  . Do tego czasu masz pełny dostęp do wszystkich funkcji.
                </p>
              </div>
              <button
                onClick={handleResumeSubscription}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Wznów subskrypcję
              </button>
            </>
          ) : subscriptionStatus?.hasSubscription ? (
            <>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Następna płatność:{" "}
                <strong>{subscriptionStatus.currentPeriodEndFormatted}</strong>
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                Subskrypcja odnawia się automatycznie co miesiąc.
              </p>
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Anuluj subskrypcję
              </button>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              Plan Premium aktywny. Brak aktywnej subskrypcji do zarządzania.
            </p>
          )}
        </div>
      )}

      {/* Lifetime info */}
      {user?.plan === "LIFETIME" && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Plan Lifetime 🎉
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Masz dożywotni dostęp do wszystkich funkcji. Dziękujemy za wsparcie!
          </p>
        </div>
      )}
    </div>
  );
}
