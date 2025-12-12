// frontend/src/pages/PrivacyPolicyPage.tsx
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { LanguageToggle } from "../components/LanguageToggle";

const content = {
  pl: {
    title: "Polityka Prywatności",
    meta: "Polityka prywatności serwisu Interpunkcja.com.pl",
    lastUpdate: "Ostatnia aktualizacja",
    sections: [
      {
        title: "1. Administrator danych",
        content: `Administratorem Twoich danych osobowych jest Karol Leszczyński, prowadzący działalność gospodarczą pod firmą eCopywriting.pl Karol Leszczyński, z siedzibą w 86-221 Papowo Biskupie 119/18, NIP: 9562203948, REGON: 340627879 (dalej: "Administrator", "my").

Kontakt w sprawach ochrony danych osobowych:
- Email: kontakt@ecopywriting.pl
- Adres: Polska

Administrator nie wyznaczył Inspektora Ochrony Danych. W sprawach związanych z przetwarzaniem danych osobowych możesz kontaktować się bezpośrednio z Administratorem.`,
      },
      {
        title: "2. Zakres zbieranych danych",
        content: `Zbieramy i przetwarzamy następujące kategorie danych osobowych:

**Dane rejestracyjne (rejestracja przez email):**
- Adres email (wymagany do utworzenia konta)
- Hasło (przechowywane w formie zaszyfrowanej - hash bcrypt)
- Imię/nazwa użytkownika (opcjonalnie)

**Dane z logowania przez Google (OAuth 2.0):**
Jeśli zdecydujesz się na rejestrację lub logowanie przez Google, pobieramy następujące dane z Twojego konta Google:
- Identyfikator użytkownika Google (Google ID) - unikalny identyfikator konta
- Adres email powiązany z kontem Google
- Imię i nazwisko z profilu Google
- Zdjęcie profilowe (avatar) z konta Google
- Informacja o metodzie rejestracji (email/Google)

Dane te są pobierane jednorazowo podczas pierwszego logowania przez Google i przechowywane w naszej bazie danych. Nie mamy dostępu do Twojego hasła Google ani innych danych z konta Google.

**Dane transakcyjne:**
- Historia płatności (dla użytkowników Premium)
- Identyfikator klienta Stripe
- Informacje o wybranym planie subskrypcji

**Dane o użytkowaniu serwisu:**
- Historia sprawdzonych tekstów (tylko dla użytkowników Premium/Lifetime)
- Statystyki użycia (liczba sprawdzeń, liczba znaków)
- Data i czas korzystania z usługi

**Dane techniczne:**
- Adres IP
- Typ i wersja przeglądarki
- System operacyjny
- Identyfikatory plików cookies (zgodnie z Polityką Cookies)

**Dane analityczne (za zgodą):**
- Dane zbierane przez Google Analytics 4
- Informacje o sposobie korzystania ze strony`,
      },
      {
        title: "3. Cele i podstawy prawne przetwarzania",
        content: `Przetwarzamy Twoje dane osobowe w następujących celach:

**Na podstawie umowy (art. 6 ust. 1 lit. b RODO):**
- Świadczenie usługi sprawdzania interpunkcji
- Zarządzanie kontem użytkownika
- Uwierzytelnianie użytkownika (w tym przez Google OAuth)
- Realizacja płatności i obsługa subskrypcji
- Obsługa reklamacji i zapytań

**Na podstawie zgody (art. 6 ust. 1 lit. a RODO):**
- Wykorzystanie analitycznych plików cookies (Google Analytics)
- Wykorzystanie marketingowych plików cookies
- Wysyłanie informacji marketingowych (newsletter)

**Na podstawie prawnie uzasadnionego interesu (art. 6 ust. 1 lit. f RODO):**
- Zapewnienie bezpieczeństwa serwisu
- Wykrywanie i zapobieganie nadużyciom
- Dochodzenie lub obrona przed roszczeniami
- Tworzenie statystyk i analiz wewnętrznych

**Na podstawie obowiązku prawnego (art. 6 ust. 1 lit. c RODO):**
- Prowadzenie dokumentacji księgowej
- Wystawianie faktur
- Odpowiadanie na żądania organów państwowych`,
      },
      {
        title: "4. Odbiorcy danych",
        content: `Twoje dane osobowe mogą być przekazywane następującym kategoriom odbiorców:

**Dostawcy usług IT:**
- Amazon Web Services (AWS) - hosting serwerów w UE (Frankfurt, Sztokholm)
- Anthropic - dostawca technologii AI do sprawdzania tekstów (teksty są przetwarzane w celu świadczenia usługi, nie są przechowywane przez Anthropic)

**Dostawcy usług uwierzytelniania:**
- Google LLC - usługa uwierzytelniania OAuth 2.0 (logowanie przez Google). Gdy logujesz się przez Google, Twoje dane (email, imię, zdjęcie profilowe) są pobierane z serwerów Google.

**Dostawcy usług płatniczych:**
- Stripe - obsługa płatności kartami, BLIK, Przelewy24

**Dostawcy usług analitycznych (za zgodą):**
- Google LLC - Google Analytics, Google Tag Manager

**Organy państwowe:**
- Uprawnione organy państwowe na podstawie przepisów prawa (np. urząd skarbowy, sądy)

Nie sprzedajemy Twoich danych osobowych podmiotom trzecim.`,
      },
      {
        title: "5. Przekazywanie danych poza EOG",
        content: `Niektórzy z naszych dostawców usług mają siedzibę poza Europejskim Obszarem Gospodarczym:

**Anthropic (USA):**
- Przekazywanie na podstawie standardowych klauzul umownych (SCC) zatwierdzonych przez Komisję Europejską
- Dane tekstowe są przetwarzane wyłącznie w celu świadczenia usługi sprawdzania interpunkcji

**Google LLC (USA) - OAuth i Analytics:**
- Przekazywanie na podstawie programu Data Privacy Framework (DPF)
- W przypadku logowania przez Google: dane niezbędne do uwierzytelnienia (email, imię, zdjęcie profilowe, Google ID) są pobierane jednorazowo i przechowywane w naszej bazie danych
- W przypadku Google Analytics: dotyczy tylko danych analitycznych zbieranych za zgodą użytkownika

**Stripe (USA):**
- Przekazywanie na podstawie standardowych klauzul umownych (SCC)
- Certyfikat PCI DSS Level 1

W każdym przypadku zapewniamy odpowiedni poziom ochrony danych zgodny z wymogami RODO.`,
      },
      {
        title: "6. Okres przechowywania danych",
        content: `Przechowujemy Twoje dane osobowe przez następujące okresy:

**Dane konta użytkownika (w tym dane z Google OAuth):**
- Do momentu usunięcia konta przez użytkownika
- Po usunięciu konta dane są usuwane w ciągu 30 dni
- Google ID i powiązane dane są usuwane wraz z kontem

**Historia sprawdzeń (Premium/Lifetime):**
- 90 dni od daty sprawdzenia
- Użytkownik może usunąć historię wcześniej

**Dane transakcyjne i rozliczeniowe:**
- 5 lat od końca roku podatkowego (wymóg prawny)

**Dane analityczne (Google Analytics):**
- 14 miesięcy od ostatniej aktywności

**Logi serwerowe:**
- 30 dni

**Dane do celów marketingowych:**
- Do momentu wycofania zgody`,
      },
      {
        title: "7. Twoje prawa",
        content: `Zgodnie z RODO przysługują Ci następujące prawa:

**Prawo dostępu (art. 15 RODO):**
Masz prawo uzyskać potwierdzenie, czy przetwarzamy Twoje dane osobowe, oraz uzyskać ich kopię.

**Prawo do sprostowania (art. 16 RODO):**
Masz prawo żądać poprawienia nieprawidłowych lub uzupełnienia niekompletnych danych.

**Prawo do usunięcia (art. 17 RODO):**
Masz prawo żądać usunięcia swoich danych ("prawo do bycia zapomnianym") w określonych przypadkach. Dotyczy to również danych pobranych z Google.

**Prawo do ograniczenia przetwarzania (art. 18 RODO):**
Masz prawo żądać ograniczenia przetwarzania danych w określonych przypadkach.

**Prawo do przenoszenia danych (art. 20 RODO):**
Masz prawo otrzymać swoje dane w ustrukturyzowanym formacie i przenieść je do innego administratora.

**Prawo do sprzeciwu (art. 21 RODO):**
Masz prawo sprzeciwić się przetwarzaniu danych opartemu na prawnie uzasadnionym interesie.

**Prawo do wycofania zgody:**
Jeśli przetwarzanie odbywa się na podstawie zgody, masz prawo ją wycofać w dowolnym momencie.

**Prawo do odłączenia konta Google:**
Możesz w każdej chwili odłączyć swoje konto Google od naszego serwisu i ustawić hasło do logowania przez email.

**Prawo do skargi:**
Masz prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).

Aby skorzystać z powyższych praw, skontaktuj się z nami: kontakt@ecopywriting.pl`,
      },
      {
        title: "8. Bezpieczeństwo danych",
        content: `Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony Twoich danych osobowych:

**Środki techniczne:**
- Szyfrowanie połączeń SSL/TLS (HTTPS)
- Hashowanie haseł algorytmem bcrypt
- Bezpieczna komunikacja z Google OAuth przez protokół HTTPS
- Regularne kopie zapasowe danych
- Firewall i systemy wykrywania włamań
- Automatyczne aktualizacje bezpieczeństwa

**Środki organizacyjne:**
- Ograniczony dostęp do danych osobowych
- Szkolenia z zakresu ochrony danych
- Procedury reagowania na incydenty bezpieczeństwa
- Regularne przeglądy zabezpieczeń`,
      },
      {
        title: "9. Profilowanie i automatyczne podejmowanie decyzji",
        content: `Nie stosujemy profilowania ani automatycznego podejmowania decyzji, które wywoływałyby wobec Ciebie skutki prawne lub w podobny sposób istotnie na Ciebie wpływały.

Jedyne automatyczne przetwarzanie dotyczy:
- Weryfikacji limitów użycia (liczba sprawdzeń, liczba znaków)
- Sprawdzania ważności subskrypcji
- Uwierzytelniania przez Google OAuth

Decyzje te mają charakter techniczny i nie wpływają istotnie na Twoje prawa.`,
      },
      {
        title: "10. Logowanie przez Google",
        content: `Oferujemy możliwość rejestracji i logowania przez konto Google (Google Sign-In / OAuth 2.0).

**Jak to działa:**
1. Klikasz przycisk "Kontynuuj z Google"
2. Jesteś przekierowywany na stronę Google, gdzie wyrażasz zgodę na udostępnienie danych
3. Google przekazuje nam Twoje podstawowe dane profilowe
4. Tworzymy konto lub logujemy Cię do istniejącego konta

**Jakie dane pobieramy z Google:**
- Adres email (do identyfikacji konta)
- Imię i nazwisko (do personalizacji)
- Zdjęcie profilowe (do wyświetlania w serwisie)
- Unikalny identyfikator Google (do powiązania kont)

**Czego NIE pobieramy:**
- Hasła do konta Google
- Kontaktów z konta Google
- Plików z Google Drive
- Żadnych innych danych z usług Google

**Twoje możliwości:**
- Możesz w każdej chwili odłączyć konto Google i ustawić hasło
- Możesz usunąć dostęp naszej aplikacji w ustawieniach konta Google: https://myaccount.google.com/permissions
- Usunięcie konta w naszym serwisie usuwa wszystkie dane, w tym dane pobrane z Google`,
      },
      {
        title: "11. Zmiany polityki prywatności",
        content: `Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności.

O istotnych zmianach poinformujemy Cię:
- Poprzez komunikat na stronie internetowej
- Poprzez email (jeśli posiadasz konto)

Zmiany wchodzą w życie w terminie wskazanym w komunikacie, nie wcześniej niż 14 dni od daty publikacji.

Dalsze korzystanie z serwisu po wprowadzeniu zmian oznacza akceptację zaktualizowanej Polityki Prywatności.`,
      },
      {
        title: "12. Kontakt",
        content: `W sprawach związanych z ochroną danych osobowych możesz skontaktować się z nami:

**Email:** kontakt@ecopywriting.pl

Odpowiadamy na zapytania w terminie 30 dni. W przypadku skomplikowanych spraw termin może zostać przedłużony o kolejne 60 dni, o czym zostaniesz poinformowany.`,
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    meta: "Privacy Policy for Interpunkcja.com.pl",
    lastUpdate: "Last updated",
    sections: [
      {
        title: "1. Data Controller",
        content: `The controller of your personal data is Karol Leszczyński, conducting business under the name eCopywriting.pl Karol Leszczyński, based in 86-221 Papowo Biskupie 119/18, NIP: 9562203948, REGON: 340627879 (hereinafter: "Controller", "we", "us").

Contact for data protection matters:
- Email: kontakt@ecopywriting.pl
- Address: Poland

The Controller has not appointed a Data Protection Officer. For matters related to personal data processing, you may contact the Controller directly.`,
      },
      {
        title: "2. Scope of Collected Data",
        content: `We collect and process the following categories of personal data:

**Registration Data (email registration):**
- Email address (required to create an account)
- Password (stored in encrypted form - bcrypt hash)
- Name/username (optional)

**Data from Google Sign-In (OAuth 2.0):**
If you choose to register or sign in with Google, we collect the following data from your Google account:
- Google user identifier (Google ID) - unique account identifier
- Email address associated with your Google account
- Name from your Google profile
- Profile picture (avatar) from your Google account
- Information about registration method (email/Google)

This data is fetched once during your first Google sign-in and stored in our database. We do not have access to your Google password or any other data from your Google account.

**Transaction Data:**
- Payment history (for Premium users)
- Stripe customer identifier
- Subscription plan information

**Service Usage Data:**
- History of checked texts (Premium/Lifetime users only)
- Usage statistics (number of checks, character count)
- Date and time of service usage

**Technical Data:**
- IP address
- Browser type and version
- Operating system
- Cookie identifiers (in accordance with Cookie Policy)

**Analytics Data (with consent):**
- Data collected by Google Analytics 4
- Information about how you use the website`,
      },
      {
        title: "3. Purposes and Legal Bases for Processing",
        content: `We process your personal data for the following purposes:

**Based on contract (Art. 6(1)(b) GDPR):**
- Providing punctuation checking services
- Managing your user account
- User authentication (including via Google OAuth)
- Processing payments and managing subscriptions
- Handling complaints and inquiries

**Based on consent (Art. 6(1)(a) GDPR):**
- Using analytical cookies (Google Analytics)
- Using marketing cookies
- Sending marketing information (newsletter)

**Based on legitimate interest (Art. 6(1)(f) GDPR):**
- Ensuring service security
- Detecting and preventing abuse
- Pursuing or defending against claims
- Creating statistics and internal analyses

**Based on legal obligation (Art. 6(1)(c) GDPR):**
- Maintaining accounting documentation
- Issuing invoices
- Responding to requests from government authorities`,
      },
      {
        title: "4. Data Recipients",
        content: `Your personal data may be transferred to the following categories of recipients:

**IT Service Providers:**
- Amazon Web Services (AWS) - server hosting in EU (Frankfurt, Stockholm)
- Anthropic - AI technology provider for text checking (texts are processed to provide the service, not stored by Anthropic)

**Authentication Service Providers:**
- Google LLC - OAuth 2.0 authentication service (Sign in with Google). When you sign in with Google, your data (email, name, profile picture) is fetched from Google servers.

**Payment Service Providers:**
- Stripe - card payments, BLIK, Przelewy24

**Analytics Service Providers (with consent):**
- Google LLC - Google Analytics, Google Tag Manager

**Government Authorities:**
- Authorized government bodies under applicable law (e.g., tax office, courts)

We do not sell your personal data to third parties.`,
      },
      {
        title: "5. Data Transfers Outside the EEA",
        content: `Some of our service providers are based outside the European Economic Area:

**Anthropic (USA):**
- Transfer based on Standard Contractual Clauses (SCC) approved by the European Commission
- Text data is processed solely to provide the punctuation checking service

**Google LLC (USA) - OAuth and Analytics:**
- Transfer based on the Data Privacy Framework (DPF)
- For Google Sign-In: data necessary for authentication (email, name, profile picture, Google ID) is fetched once and stored in our database
- For Google Analytics: applies only to analytics data collected with user consent

**Stripe (USA):**
- Transfer based on Standard Contractual Clauses (SCC)
- PCI DSS Level 1 certified

In all cases, we ensure an adequate level of data protection in accordance with GDPR requirements.`,
      },
      {
        title: "6. Data Retention Periods",
        content: `We retain your personal data for the following periods:

**User Account Data (including Google OAuth data):**
- Until account deletion by the user
- After deletion, data is removed within 30 days
- Google ID and associated data are deleted along with the account

**Check History (Premium/Lifetime):**
- 90 days from the check date
- User may delete history earlier

**Transaction and Billing Data:**
- 5 years from the end of the tax year (legal requirement)

**Analytics Data (Google Analytics):**
- 14 months from last activity

**Server Logs:**
- 30 days

**Marketing Data:**
- Until consent withdrawal`,
      },
      {
        title: "7. Your Rights",
        content: `Under the GDPR, you have the following rights:

**Right of Access (Art. 15 GDPR):**
You have the right to obtain confirmation of whether we process your personal data and to receive a copy thereof.

**Right to Rectification (Art. 16 GDPR):**
You have the right to request correction of inaccurate or completion of incomplete data.

**Right to Erasure (Art. 17 GDPR):**
You have the right to request deletion of your data ("right to be forgotten") in certain cases. This also applies to data obtained from Google.

**Right to Restriction of Processing (Art. 18 GDPR):**
You have the right to request restriction of data processing in certain cases.

**Right to Data Portability (Art. 20 GDPR):**
You have the right to receive your data in a structured format and transfer it to another controller.

**Right to Object (Art. 21 GDPR):**
You have the right to object to processing based on legitimate interest.

**Right to Withdraw Consent:**
If processing is based on consent, you have the right to withdraw it at any time.

**Right to Disconnect Google Account:**
You can disconnect your Google account from our service at any time and set up a password for email login.

**Right to Lodge a Complaint:**
You have the right to lodge a complaint with the President of the Personal Data Protection Office (UODO) in Poland or your local supervisory authority.

To exercise these rights, contact us at: kontakt@ecopywriting.pl`,
      },
      {
        title: "8. Data Security",
        content: `We implement appropriate technical and organizational measures to protect your personal data:

**Technical Measures:**
- SSL/TLS encryption (HTTPS)
- Password hashing using bcrypt algorithm
- Secure communication with Google OAuth via HTTPS protocol
- Regular data backups
- Firewall and intrusion detection systems
- Automatic security updates

**Organizational Measures:**
- Restricted access to personal data
- Data protection training
- Security incident response procedures
- Regular security reviews`,
      },
      {
        title: "9. Profiling and Automated Decision-Making",
        content: `We do not use profiling or automated decision-making that would produce legal effects concerning you or similarly significantly affect you.

The only automated processing concerns:
- Verification of usage limits (number of checks, character count)
- Subscription validity checking
- Authentication via Google OAuth

These decisions are technical in nature and do not significantly affect your rights.`,
      },
      {
        title: "10. Google Sign-In",
        content: `We offer the option to register and sign in using your Google account (Google Sign-In / OAuth 2.0).

**How it works:**
1. You click the "Continue with Google" button
2. You are redirected to Google's page where you consent to share data
3. Google sends us your basic profile data
4. We create an account or log you into an existing account

**What data we collect from Google:**
- Email address (for account identification)
- Name (for personalization)
- Profile picture (for display in the service)
- Unique Google identifier (for account linking)

**What we do NOT collect:**
- Your Google account password
- Contacts from your Google account
- Files from Google Drive
- Any other data from Google services

**Your options:**
- You can disconnect your Google account and set up a password at any time
- You can remove our app's access in your Google account settings: https://myaccount.google.com/permissions
- Deleting your account in our service removes all data, including data obtained from Google`,
      },
      {
        title: "11. Changes to Privacy Policy",
        content: `We reserve the right to make changes to this Privacy Policy.

We will inform you of significant changes:
- Through a notice on the website
- Via email (if you have an account)

Changes take effect on the date specified in the notice, no earlier than 14 days from publication.

Continued use of the service after changes constitutes acceptance of the updated Privacy Policy.`,
      },
      {
        title: "12. Contact",
        content: `For matters related to personal data protection, you may contact us:

**Email:** kontakt@ecopywriting.pl

We respond to inquiries within 30 days. For complex matters, the deadline may be extended by an additional 60 days, of which you will be informed.`,
      },
    ],
  },
};

export function PrivacyPolicyPage() {
  const [language, setLanguage] = useState<"pl" | "en">("pl");
  const t = content[language];

  return (
    <>
      <Helmet>
        <title>{t.title} - Interpunkcja.com.pl</title>
        <meta name="description" content={t.meta} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <LanguageToggle language={language} onChange={setLanguage} />

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {t.title}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t.lastUpdate}:{" "}
          {new Date().toLocaleDateString(language === "pl" ? "pl-PL" : "en-US")}
        </p>

        <div className="space-y-8">
          {t.sections.map((section, index) => (
            <section key={index} className="prose dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>
              <div className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {section.content
                  .split("**")
                  .map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
