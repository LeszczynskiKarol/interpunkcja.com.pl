// frontend/src/pages/DocumentsPage.tsx
// Korekta całego dokumentu .docx: wycena, płatność, postęp i pobranie wyniku.
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  Loader2,
  MessageSquare,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  downloadDocument,
  getDocumentPackages,
  listDocuments,
  requestDocumentPreview,
  startDocumentCheckout,
  uploadDocument,
  verifyDocumentPayment,
  type CorrectionDocument,
} from "../lib/api";
import { trackEvent } from "../lib/analytics";
import { DocumentPreviewView } from "../components/DocumentPreviewView";

const pln = (grosze: number) => `${(grosze / 100).toFixed(0)} zł`;

function correctionsLabel(n: number): string {
  const lastTwo = n % 100;
  const last = n % 10;
  if (n === 1) return "1 poprawka";
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${n} poprawki`;
  return `${n} poprawek`;
}

const STATUS_LABEL: Record<CorrectionDocument["status"], string> = {
  AWAITING_PAYMENT: "Czeka na płatność",
  PAID: "W kolejce",
  PROCESSING: "Sprawdzanie",
  DONE: "Gotowe",
  FAILED: "Błąd",
};

export function DocumentsPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [uploading, setUploading] = useState(false);
  const [paying, setPaying] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [consent, setConsent] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const { data: pricing } = useQuery({ queryKey: ["documentPackages"], queryFn: getDocumentPackages });
  const { data: documents = [] } = useQuery({
    queryKey: ["documents"],
    queryFn: listDocuments,
    // Odświeżanie postępu, dopóki coś się przetwarza
    refetchInterval: (query) =>
      (query.state.data || []).some((d) => d.status === "PAID" || d.status === "PROCESSING") ? 3000 : false,
  });

  // Powrót ze Stripe
  useEffect(() => {
    const docId = searchParams.get("doc");
    const sessionId = searchParams.get("session_id");
    if (!docId || !sessionId) return;
    setSearchParams({}, { replace: true });
    verifyDocumentPayment(docId, sessionId)
      .then((doc) => {
        trackEvent("purchase", {
          transaction_id: sessionId,
          currency: "PLN",
          value: doc.amount / 100,
          item_id: doc.packageId,
        });
        toast.success("Płatność przyjęta. Zaczynamy sprawdzać dokument.");
        queryClient.invalidateQueries({ queryKey: ["documents"] });
      })
      .catch(() => toast.error("Nie udało się potwierdzić płatności. Odśwież stronę za chwilę."));
  }, [searchParams, setSearchParams, queryClient]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    // Format sprawdza backend, nie przeglądarka - każda próba (także .pdf czy .odt)
    // trafia wtedy do analityki z rozszerzeniem i powodem odrzucenia
    const ext = /\.([a-z0-9]{1,8})$/i.exec(file.name)?.[1].toLowerCase() || "";
    setUploading(true);
    try {
      const doc = await uploadDocument(file);
      trackEvent("document_quote", { pages: doc.pages, value: doc.amount / 100, ext });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success(`Dokument ma ${doc.pages} str. - cena ${pln(doc.amount)}`);
    } catch (error: any) {
      trackEvent(
        "document_upload_rejected",
        { ext, reason: error.response?.data?.error || "NETWORK" },
        { gaOnly: true },
      );
      toast.error(error.response?.data?.message || "Nie udało się wgrać pliku");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const preview = async (doc: CorrectionDocument) => {
    setPreviewing(doc.id);
    try {
      await requestDocumentPreview(doc.id);
      trackEvent("document_preview", { pages: doc.pages });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Nie udało się przygotować próbki");
    } finally {
      setPreviewing(null);
    }
  };

  const pay = async (doc: CorrectionDocument) => {
    setPaying(doc.id);
    try {
      trackEvent("begin_checkout", { currency: "PLN", value: doc.amount / 100, item_id: doc.packageId });
      window.location.href = await startDocumentCheckout(doc.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Nie udało się rozpocząć płatności");
      setPaying(null);
    }
  };

  const download = async (doc: CorrectionDocument) => {
    try {
      await downloadDocument(doc);
    } catch {
      toast.error("Nie udało się pobrać pliku");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Korekta całego dokumentu</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Wgraj pracę dyplomową, artykuł albo raport w formacie .docx. Odeślemy ten sam plik z
          poprawkami w trybie śledzenia zmian Worda, a przy każdej poprawce dodamy komentarz z regułą.
          Sprawdzamy też przypisy. Formatowanie i bibliografia zostają nietknięte. Przed zapłatą możesz
          zobaczyć bezpłatną próbkę poprawek na 2 stronach.
        </p>

        {/* Cennik */}
        {pricing && (
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {pricing.packages.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 text-center"
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{pln(p.amount)}</div>
                <div className="text-gray-600 dark:text-gray-400">{p.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  do {(p.maxPages * pricing.charsPerPage).toLocaleString("pl-PL")} znaków
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wgranie pliku */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          className={`rounded-2xl border-2 border-dashed p-10 text-center transition-colors mb-3 ${
            dragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          }`}
        >
          <Upload className="w-10 h-10 mx-auto text-blue-600 mb-3" />
          <p className="text-gray-800 dark:text-gray-200 mb-4">
            Przeciągnij tutaj plik .docx albo wybierz go z dysku
          </p>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
            {uploading ? "Liczymy strony…" : "Wybierz plik"}
          </button>
          <input
            ref={fileInput}
            type="file"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
          Strona to 1800 znaków ze spacjami. Najpierw pokażemy cenę - płacisz dopiero po wycenie, kartą
          albo BLIK-iem. Plik przechowujemy 30 dni.
        </p>

        {/* Lista dokumentów */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Twoje dokumenty</h2>
            {documents.some((d) => d.status === "AWAITING_PAYMENT") && (
              <label className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 flex-shrink-0"
                />
                <span>
                  Akceptuję{" "}
                  <a href="/regulamin" target="_blank" className="text-blue-600 hover:underline">
                    Regulamin
                  </a>
                  . Zgadzam się na rozpoczęcie korekty od razu po zapłacie, przed upływem 14 dni na
                  odstąpienie od umowy, i przyjmuję do wiadomości, że po wykonaniu korekty utracę prawo
                  odstąpienia.
                </span>
              </label>
            )}
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">{doc.fileName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {doc.pages} str. · {pln(doc.amount)} · {STATUS_LABEL[doc.status]}
                      {doc.status === "DONE" && doc.corrections !== null && ` · ${correctionsLabel(doc.corrections)}`}
                    </div>
                  </div>

                  {doc.status === "AWAITING_PAYMENT" && (
                    <button
                      type="button"
                      onClick={() => pay(doc)}
                      disabled={paying === doc.id || !consent}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                    >
                      {paying === doc.id && <Loader2 className="w-4 h-4 animate-spin" />}
                      Zapłać {pln(doc.amount)}
                    </button>
                  )}
                  {doc.downloadable && (
                    <button
                      type="button"
                      onClick={() => download(doc)}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
                    >
                      <Download className="w-4 h-4" />
                      Pobierz poprawiony plik
                    </button>
                  )}
                  {doc.status === "DONE" && !doc.downloadable && (
                    <span className="text-sm text-gray-500">Plik usunięty po 30 dniach</span>
                  )}
                </div>

                {(doc.status === "PAID" || doc.status === "PROCESSING") && (
                  <div className="mt-3">
                    <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-2 bg-blue-600 transition-all"
                        style={{
                          width: `${doc.progressTotal ? Math.round((doc.progressDone / doc.progressTotal) * 100) : 3}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Sprawdzamy dokument - zwykle kilka minut. Wyślemy też e-mail, gdy skończymy.
                    </p>
                  </div>
                )}
                {doc.status === "DONE" && doc.downloadable && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    W Wordzie poprawki zaakceptujesz na karcie Recenzja - pojedynczo albo wszystkie naraz.
                  </p>
                )}
                {doc.canPreview && !doc.preview && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => preview(doc)}
                      disabled={previewing === doc.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-green-600 text-green-700 dark:text-green-400 font-semibold hover:bg-green-50 dark:hover:bg-green-950/30 disabled:opacity-60"
                    >
                      {previewing === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {previewing === doc.id ? "Sprawdzamy 2 strony…" : "Zobacz bezpłatną próbkę (2 strony)"}
                    </button>
                    <span className="text-xs text-gray-500">Jedna próbka na konto · bez płacenia</span>
                  </div>
                )}
                {doc.preview && doc.status === "AWAITING_PAYMENT" && <DocumentPreviewView preview={doc.preview} />}
                {doc.status === "FAILED" && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Coś poszło nie tak. Już o tym wiemy - ponowimy korektę albo zwrócimy pieniądze.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <p className="flex gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            Poprawiamy interpunkcję, ortografię, pisownię łączną i rozdzielną oraz gramatykę. Styl i
            słownictwo zostawiamy autorowi.
          </p>
          <p className="flex gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            Nie zmieniamy cytatów z innych autorów, terminologii, nazw własnych ani bibliografii.
          </p>
          <p className="flex gap-2">
            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            Każdą poprawkę możesz odrzucić - w pliku nic nie zmienia się bez Twojej zgody.
          </p>
        </div>
      </main>
    </div>
  );
}
