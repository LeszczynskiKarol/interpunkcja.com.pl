// frontend/src/pages/CheckEmailPage.tsx
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

export function CheckEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <Mail className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Sprawdź swoją skrzynkę!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Wysłaliśmy 6-cyfrowy kod weryfikacyjny na adres:
        </p>
        <p className="font-medium text-gray-900 dark:text-white mb-6 break-all">
          {email}
        </p>

        <button
          onClick={() => navigate(`/weryfikacja?email=${email}`)}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 mb-4"
        >
          Wprowadź kod weryfikacyjny
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Skopiuj 6-cyfrowy kod z emaila i wklej go na następnej stronie.
          </p>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nie dostałeś emaila?{" "}
          <Link
            to={`/wyslij-ponownie?email=${email}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Wyślij ponownie
          </Link>
        </p>

        <Link
          to="/logowanie"
          className="block mt-6 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          Wróć do logowania
        </Link>
      </div>
    </div>
  );
}
