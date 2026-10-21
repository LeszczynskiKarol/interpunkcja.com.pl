// frontend/src/pages/TermsOfServicePage.tsx
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { LanguageToggle } from "./LanguageToggle";

const content = {
  pl: {
    title: "Regulamin Serwisu",
    meta: "Regulamin serwisu Interpunkcja.com.pl",
    lastUpdate: "Ostatnia aktualizacja",
    sections: [
      {
        title: "§1. Postanowienia ogólne",
        content: `1. Niniejszy Regulamin określa zasady korzystania z serwisu internetowego Interpunkcja.com.pl (dalej: "Serwis").

2. Właścicielem i operatorem Serwisu jest Karol Leszczyński, prowadzący działalność gospodarczą pod firmą eCopywriting.pl Karol Leszczyński, z siedzibą w 86-221 Papowo Biskupie 119/18, NIP: 9562203948, REGON: 340627879 (dalej: "Usługodawca").

3. Kontakt z Usługodawcą:
   • Email: kontakt@ecopywriting.pl
   • Strona: https://www.interpunkcja.com.pl

4. Korzystanie z Serwisu oznacza akceptację niniejszego Regulaminu oraz Polityki Prywatności.

5. Regulamin jest dostępny nieodpłatnie na stronie internetowej Serwisu w formie umożliwiającej jego pobranie, utrwalenie i wydrukowanie.`,
      },
      {
        title: "§2. Definicje",
        content: `Użyte w Regulaminie pojęcia oznaczają:

**Serwis** – strona internetowa dostępna pod adresem interpunkcja.com.pl wraz ze wszystkimi podstronami.

**Usługodawca** – Karol Leszczyński, prowadzący działalność gospodarczą pod firmą eCopywriting.pl Karol Leszczyński z siedzibą w 86-221 Papowo Biskupie 119/18, NIP: 9562203948, REGON: 340627879.

**Użytkownik** – osoba fizyczna posiadająca pełną zdolność do czynności prawnych, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, korzystająca z Serwisu.

**Konto** – indywidualne konto Użytkownika w Serwisie, utworzone po rejestracji (przez email lub Google).

**Usługa** – usługa sprawdzania i korekty tekstu (interpunkcja, ortografia, pisownia, gramatyka) świadczona drogą elektroniczną przez Usługodawcę.

**Plan Free** – bezpłatny wariant Usługi dostępny po założeniu Konta.

**Doładowanie** – odpłatny pakiet dodatkowych sprawdzeń tekstu.

**Korekta Dokumentu** – odpłatna, jednorazowa usługa korekty całego pliku .docx opisana w §3 ust. 5.

**Strona** – 1800 znaków tekstu ze spacjami.

**Umowa** – umowa o świadczenie usług drogą elektroniczną zawierana między Użytkownikiem a Usługodawcą.

**Google OAuth** – usługa uwierzytelniania Google umożliwiająca rejestrację i logowanie za pomocą konta Google.`,
      },
      {
        title: "§3. Rodzaje i zakres usług",
        content: `1. Serwis świadczy usługę sprawdzania i korekty tekstów w języku polskim przy wykorzystaniu technologii sztucznej inteligencji (AI) oraz słownika ortograficznego.

2. Usługa polega na:
   a) Analizie tekstu pod kątem błędów interpunkcyjnych, ortograficznych, pisowni łącznej i rozdzielnej oraz gramatycznych
   b) Wskazaniu miejsc wymagających korekty
   c) Zaproponowaniu poprawnej wersji tekstu
   d) Wyjaśnieniu zastosowanych reguł

3. Bez zakładania Konta Użytkownik może:
   a) Sprawdzić pisownię tekstu słownikiem (do 5000 znaków na raz)
   b) Raz na dobę sprawdzić z użyciem AI tekst do 300 znaków, w ramach dziennej puli dostępnej dla wszystkich Użytkowników bez Konta

4. Plan Free (bezpłatny, po założeniu Konta):
- Do 2 sprawdzeń AI dziennie i 20 miesięcznie
- Maksymalnie 500 znaków na sprawdzenie i 1000 znaków dziennie
- Wyjaśnienie reguły przy każdej poprawce
- Limity obowiązują również w ujęciu IP – z jednego adresu sieciowego można wykonać maksymalnie 3 darmowe sprawdzenia dziennie i 30 miesięcznie
- Doładowania: 10 sprawdzeń za 5 zł, 25 za 10 zł, 60 za 20 zł; dokupione sprawdzenia obejmują tekst do 10 000 znaków i nie wygasają

5. Korekta Dokumentu:
   a) Użytkownik posiadający Konto przesyła plik w formacie .docx
   b) Przed złożeniem zamówienia Serwis wylicza liczbę Stron i cenę: 39 zł za dokument do 20 Stron, 79 zł do 60 Stron, 149 zł do 150 Stron; dokumenty dłuższe wyceniane są indywidualnie
   c) Po zapłacie Usługodawca przekazuje plik do automatycznej korekty i udostępnia w Koncie ten sam plik z poprawkami w trybie śledzenia zmian oraz komentarzem przy każdej poprawce, zwykle w ciągu kilkunastu minut
   d) Korekta obejmuje interpunkcję, ortografię, pisownię łączną i rozdzielną oraz gramatykę; nie obejmuje zmian stylu, cytatów z innych źródeł, terminologii, nazw własnych ani bibliografii
   e) Użytkownik decyduje, które poprawki przyjmuje; poprawki nie są nanoszone na tekst bez jego akceptacji w edytorze
   f) Pliki są przechowywane przez 30 dni od przesłania, a następnie trwale usuwane
   g) Jeżeli korekta nie zostanie wykonana z przyczyn technicznych, Usługodawca ponawia ją albo zwraca całą zapłaconą kwotę

6. Usługodawca zastrzega sobie prawo do modyfikacji limitów i funkcji Usługi; zmiana nie dotyczy zamówień już opłaconych.`,
      },
      {
        title: "§4. Rejestracja i konto użytkownika",
        content: `1. Korzystanie z Usługi wymaga utworzenia Konta w Serwisie.

2. Dostępne są dwa sposoby rejestracji:

   **a) Rejestracja przez email:**
   - Wymaga podania adresu email i hasła spełniającego wymogi bezpieczeństwa
   - Po rejestracji Użytkownik otrzymuje email z kodem weryfikacyjnym
   - Konto jest aktywowane po wprowadzeniu kodu weryfikacyjnego

   **b) Rejestracja przez Google (OAuth 2.0):**
   - Wymaga posiadania konta Google z zweryfikowanym adresem email
   - Użytkownik jest przekierowywany na stronę Google w celu autoryzacji
   - Konto jest tworzone automatycznie po wyrażeniu zgody na udostępnienie danych
   - Pobierane dane: adres email, imię, zdjęcie profilowe
   - Nie jest wymagana dodatkowa weryfikacja email

3. Użytkownik zarejestrowany przez Google może w każdej chwili ustawić hasło, aby móc logować się również przez email.

4. Użytkownik zobowiązany jest do:
   a) Podania prawdziwych danych
   b) Zachowania poufności danych logowania
   c) Niezwłocznego informowania o nieautoryzowanym dostępie do Konta
   d) Korzystania z Serwisu zgodnie z prawem i dobrymi obyczajami

5. Zabrania się:
   a) Udostępniania Konta osobom trzecim
   b) Posiadania więcej niż jednego Konta (niezależnie od metody rejestracji)
   c) Korzystania z Serwisu w sposób zakłócający jego działanie
   d) Próby obchodzenia limitów i zabezpieczeń
   e) Zakładania kont w celu obchodzenia limitów (w tym z różnych adresów email czy IP)
   f) Korzystania z VPN, proxy lub innych narzędzi w celu obejścia limitów per adres sieciowy
   6. W przypadku wykrycia naruszenia ust. 5, Usługodawca zastrzega sobie prawo do:
   a) Czasowego zablokowania dostępu do Konta lub adresu IP
   b) Trwałego usunięcia Konta bez zwrotu wniesionych opłat
   c) Anulowania niewykorzystanych dokupionych sprawdzeń

7. Użytkownik może w każdej chwili:
   a) Usunąć swoje Konto poprzez kontakt z Usługodawcą
   b) Odłączyć konto Google od Serwisu w ustawieniach konta
   c) Cofnąć uprawnienia aplikacji w ustawieniach konta Google`,
      },
      {
        title: "§5. Logowanie przez Google",
        content: `1. Serwis umożliwia rejestrację i logowanie za pomocą konta Google (Google Sign-In / OAuth 2.0).

2. Korzystając z logowania przez Google, Użytkownik:
   a) Wyraża zgodę na przekazanie danych z konta Google do Serwisu
   b) Akceptuje Politykę Prywatności Google oraz niniejszy Regulamin
   c) Potwierdza, że jest właścicielem konta Google

3. Dane pobierane z konta Google:
   a) Adres email (do identyfikacji konta)
   b) Imię i nazwisko (do personalizacji)
   c) Zdjęcie profilowe (do wyświetlania w Serwisie)
   d) Unikalny identyfikator Google (do powiązania kont)

4. Usługodawca NIE pobiera:
   a) Hasła do konta Google
   b) Kontaktów z konta Google
   c) Plików z Google Drive
   d) Żadnych innych danych z usług Google

5. Użytkownik może w każdej chwili:
   a) Odłączyć konto Google w ustawieniach Serwisu
   b) Cofnąć uprawnienia aplikacji: https://myaccount.google.com/permissions
   c) Ustawić hasło do logowania przez email

6. W przypadku problemów z logowaniem przez Google, Użytkownik powinien:
   a) Sprawdzić, czy konto Google jest aktywne
   b) Sprawdzić, czy email w koncie Google jest zweryfikowany
   c) Skontaktować się z Usługodawcą`,
      },
      {
        title: "§6. Płatności",
        content: `1. Płatności za Doładowania i Korektę Dokumentu są jednorazowe i realizowane za pośrednictwem operatora płatności Stripe. Serwis nie prowadzi płatności cyklicznych (abonamentów).

2. Dostępne metody płatności:
   a) Karta płatnicza (Visa, Mastercard)
   b) BLIK

3. Umowa o Korektę Dokumentu zostaje zawarta z chwilą zaksięgowania płatności.

4. Ceny podane w Serwisie są cenami brutto (zawierają VAT).

5. Usługodawca wystawia faktury na życzenie Użytkownika.

6. Metoda rejestracji (email lub Google) nie wpływa na dostępne metody płatności ani ceny.`,
      },
      {
        title: "§7. Prawa własności intelektualnej",
        content: `1. Serwis, jego nazwa, logo, szata graficzna, kod źródłowy oraz wszystkie treści (z wyłączeniem treści Użytkowników) są własnością Usługodawcy i podlegają ochronie prawnej.

2. Użytkownik zachowuje pełne prawa autorskie do tekstów wprowadzanych do Serwisu w celu sprawdzenia.

3. Usługodawca nie nabywa żadnych praw do tekstów Użytkowników.

4. Teksty wprowadzone przez Użytkowników:
   a) Są przetwarzane wyłącznie w celu świadczenia Usługi
   b) Nie są wykorzystywane do trenowania modeli AI
   c) Są przechowywane przez 90 dni (sprawdzane teksty) albo 30 dni (pliki Korekty Dokumentu), zgodnie z Polityką Prywatności
   d) Nie są udostępniane osobom trzecim

5. Zabrania się kopiowania, modyfikowania, rozpowszechniania lub wykorzystywania materiałów z Serwisu bez zgody Usługodawcy.`,
      },
      {
        title: "§8. Prawo odstąpienia od umowy",
        content: `1. Konsument ma prawo odstąpić od umowy zawartej na odległość w terminie 14 dni bez podania przyczyny.

2. Termin do odstąpienia wygasa po upływie 14 dni od dnia zawarcia umowy.

3. Aby skorzystać z prawa odstąpienia, należy poinformować Usługodawcę o swojej decyzji w drodze jednoznacznego oświadczenia (np. email na adres kontakt@ecopywriting.pl).

4. W przypadku odstąpienia Usługodawca zwraca wszystkie otrzymane płatności niezwłocznie, nie później niż w terminie 14 dni.

5. Prawo odstąpienia nie przysługuje, jeśli:
   a) Usługodawca wykonał w pełni usługę za wyraźną zgodą Konsumenta
   b) Konsument został poinformowany przed rozpoczęciem świadczenia, że po spełnieniu świadczenia utraci prawo odstąpienia
   c) Konsument wyraził zgodę na rozpoczęcie świadczenia przed upływem terminu do odstąpienia

6. Korekta Dokumentu rozpoczyna się niezwłocznie po zapłacie. Składając zamówienie, Konsument wyraża zgodę na rozpoczęcie świadczenia przed upływem terminu do odstąpienia i przyjmuje do wiadomości, że po wykonaniu korekty utraci prawo odstąpienia od umowy. Bez tej zgody zamówienia nie można złożyć.`,
      },
      {
        title: "§9. Odpowiedzialność",
        content: `1. Usługodawca dokłada wszelkich starań, aby Usługa działała prawidłowo i nieprzerwanie.

2. Usługodawca nie gwarantuje:
   a) 100% poprawności wyników sprawdzania (technologia AI może popełniać błędy)
   b) Nieprzerwanej dostępności Serwisu
   c) Braku błędów technicznych
   d) Nieprzerwanej dostępności logowania przez Google (zależnej od Google)

3. Usługodawca nie ponosi odpowiedzialności za:
   a) Szkody wynikłe z użycia lub niemożności użycia Serwisu
   b) Szkody wynikłe z błędów w wynikach sprawdzania
   c) Utratę danych Użytkownika spowodowaną działaniem osób trzecich
   d) Przerwy w działaniu Serwisu wynikające z przyczyn niezależnych od Usługodawcy
   e) Problemy z logowaniem przez Google wynikające z działania Google
   f) Zmiany w usługach Google wpływające na funkcjonalność logowania

4. Odpowiedzialność Usługodawcy wobec Użytkowników niebędących Konsumentami jest ograniczona do wysokości opłat uiszczonych przez Użytkownika w okresie ostatnich 12 miesięcy.

5. Użytkownik ponosi odpowiedzialność za:
   a) Treść wprowadzanych tekstów
   b) Sposób wykorzystania wyników sprawdzania
   c) Naruszenie praw osób trzecich
   d) Naruszenie postanowień Regulaminu
   e) Bezpieczeństwo swojego konta Google (jeśli używa logowania przez Google)`,
      },
      {
        title: "§10. Reklamacje",
        content: `1. Użytkownik może złożyć reklamację dotyczącą działania Serwisu lub świadczonych Usług.

2. Reklamację należy złożyć:
   a) Drogą elektroniczną na adres: kontakt@ecopywriting.pl
   b) Pisemnie na adres Usługodawcy

3. Reklamacja powinna zawierać:
   a) Dane kontaktowe składającego reklamację
   b) Opis problemu
   c) Oczekiwany sposób rozpatrzenia

4. Usługodawca rozpatruje reklamację w terminie 14 dni od dnia jej otrzymania.

5. Odpowiedź na reklamację jest wysyłana na adres email podany w reklamacji lub adres email przypisany do Konta.`,
      },
      {
        title: "§11. Pozasądowe rozwiązywanie sporów",
        content: `1. Konsument ma możliwość skorzystania z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń.

2. Szczegółowe informacje dotyczące możliwości skorzystania przez Konsumenta z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń oraz zasady dostępu do tych procedur dostępne są:
   a) W siedzibach oraz na stronach internetowych powiatowych (miejskich) rzeczników konsumentów
   b) Na stronie internetowej Urzędu Ochrony Konkurencji i Konsumentów (www.uokik.gov.pl)

3. Konsument może również skorzystać z platformy ODR (Online Dispute Resolution) dostępnej pod adresem: https://ec.europa.eu/consumers/odr/`,
      },
      {
        title: "§12. Zmiana Regulaminu",
        content: `1. Usługodawca zastrzega sobie prawo do zmiany Regulaminu z ważnych przyczyn, w szczególności:
   a) Zmiany przepisów prawa
   b) Zmiany zakresu świadczonych usług
   c) Zmiany funkcjonalności Serwisu
   d) Zmiany warunków technicznych
   e) Zmiany w usługach zewnętrznych (np. Google OAuth)

2. O zmianie Regulaminu Użytkownicy zostaną poinformowani:
   a) Poprzez komunikat w Serwisie
   b) Poprzez email (dla Użytkowników posiadających Konto)

3. Zmiany wchodzą w życie w terminie wskazanym przez Usługodawcę, nie krótszym niż 14 dni od dnia ogłoszenia.

4. Użytkownik, który nie akceptuje zmian, ma prawo wypowiedzieć umowę przed wejściem zmian w życie.`,
      },
      {
        title: "§13. Postanowienia końcowe",
        content: `1. Prawem właściwym dla umów zawieranych na podstawie niniejszego Regulaminu jest prawo polskie.

2. W sprawach nieuregulowanych Regulaminem zastosowanie mają odpowiednie przepisy prawa polskiego, w szczególności:
   a) Kodeks cywilny
   b) Ustawa o prawach konsumenta
   c) Ustawa o świadczeniu usług drogą elektroniczną
   d) RODO i przepisy o ochronie danych osobowych

3. Ewentualne spory będą rozstrzygane przez właściwe sądy polskie. W przypadku Konsumentów właściwy jest sąd miejsca zamieszkania Konsumenta.

4. Nieważność któregokolwiek postanowienia Regulaminu nie wpływa na ważność pozostałych postanowień.

5. Regulamin wchodzi w życie z dniem publikacji na stronie Serwisu.`,
      },
    ],
  },
  en: {
    title: "Terms of Service",
    meta: "Terms of Service for Interpunkcja.com.pl",
    lastUpdate: "Last updated",
    sections: [
      {
        title: "§1. General Provisions",
        content: `1. These Terms of Service (hereinafter: "Terms") govern the use of the website Interpunkcja.com.pl (hereinafter: "Service").

2. The owner and operator of the Service is Karol Leszczyński, conducting business under the name eCopywriting.pl, based in Poland (hereinafter: "Provider").

3. Contact with the Provider:
   • Email: kontakt@ecopywriting.pl
   • Website: https://www.interpunkcja.com.pl

4. Use of the Service constitutes acceptance of these Terms and the Privacy Policy.

5. These Terms are available free of charge on the Service website in a form that allows downloading, saving, and printing.`,
      },
      {
        title: "§2. Definitions",
        content: `Terms used in these Terms of Service mean:

**Service** – the website available at interpunkcja.com.pl including all subpages.

**Provider** – Karol Leszczyński, conducting business under the name eCopywriting.pl.

**User** – a natural person with full legal capacity, a legal person, or an organizational unit without legal personality using the Service.

**Account** – the User's individual account in the Service, created after registration (via email or Google).

**Service/Services** – the punctuation checking service provided electronically by the Provider.

**Free Plan** – the free variant of the Service available after creating an Account.

**Top-up** – a paid package of additional text checks.

**Document Proofreading** – a paid, one-time proofreading service for an entire .docx file described in §3(5).

**Page** – 1,800 characters of text including spaces.

**Agreement** – the agreement for the provision of electronic services concluded between the User and the Provider.

**Google OAuth** – Google's authentication service enabling registration and login using a Google account.`,
      },
      {
        title: "§3. Types and Scope of Services",
        content: `1. The Service provides checking and proofreading of Polish texts using artificial intelligence (AI) and a spelling dictionary.

2. The Service consists of:
   a) Analysing the text for punctuation, spelling, word-separation and grammar errors
   b) Indicating places that require correction
   c) Proposing the correct version of the text
   d) Explaining the applied rules

3. Without creating an Account, the User may:
   a) Check the spelling of a text with a dictionary (up to 5,000 characters at a time)
   b) Once a day, check a text of up to 300 characters with AI, within a daily pool available to all Users without an Account

4. Free Plan (free of charge, after creating an Account):
- Up to 2 AI checks per day and 20 per month
- Up to 500 characters per check and 1,000 characters per day
- An explanation of the rule for every correction
- Limits also apply per IP address – a maximum of 3 free checks per day and 30 per month from one network address
- Top-ups: 10 checks for PLN 5, 25 for PLN 10, 60 for PLN 20; purchased checks cover texts of up to 10,000 characters and do not expire

5. Document Proofreading:
   a) A User with an Account uploads a file in .docx format
   b) Before placing the order, the Service calculates the number of Pages and the price: PLN 39 for a document of up to 20 Pages, PLN 79 for up to 60 Pages, PLN 149 for up to 150 Pages; longer documents are priced individually
   c) After payment, the Service Provider proofreads the file automatically and makes the same file available in the Account with corrections as tracked changes and a comment on each correction, usually within several minutes
   d) Proofreading covers punctuation, spelling, word separation and grammar; it does not include changes of style, quotations from other sources, terminology, proper names or bibliography
   e) The User decides which corrections to accept; corrections are not applied to the text without the User's acceptance in the editor
   f) Files are stored for 30 days from upload and then permanently deleted
   g) If proofreading cannot be completed for technical reasons, the Service Provider repeats it or refunds the full amount paid

6. The Service Provider reserves the right to modify the limits and features of the Service; changes do not apply to orders already paid for.`,
      },
      {
        title: "§4. Registration and User Account",
        content: `1. Using the Service requires creating an Account in the Service.

2. Two registration methods are available:

   **a) Email registration:**
   - Requires providing an email address and password meeting security requirements
   - After registration, the User receives an email with a verification code
   - The Account is activated after entering the verification code

   **b) Google registration (OAuth 2.0):**
   - Requires having a Google account with a verified email address
   - The User is redirected to Google's page for authorization
   - The Account is created automatically after consenting to data sharing
   - Data collected: email address, name, profile picture
   - No additional email verification required

3. A User registered via Google can set up a password at any time to also log in via email.

4. The User is obligated to:
   a) Provide accurate data
   b) Maintain confidentiality of login credentials
   c) Immediately report unauthorized access to the Account
   d) Use the Service in accordance with the law and good practices

5. It is prohibited to:
   a) Share the Account with third parties
   b) Have more than one Account (regardless of registration method)
   c) Use the Service in a way that disrupts its operation
   d) Attempt to circumvent limits and security measures

6. The User may at any time:
   a) Delete their Account by contacting the Provider
   b) Disconnect their Google account from the Service in account settings
   c) Revoke app permissions in Google account settings`,
      },
      {
        title: "§5. Google Sign-In",
        content: `1. The Service allows registration and login using a Google account (Google Sign-In / OAuth 2.0).

2. By using Google Sign-In, the User:
   a) Consents to transferring data from their Google account to the Service
   b) Accepts Google's Privacy Policy and these Terms
   c) Confirms they are the owner of the Google account

3. Data collected from Google account:
   a) Email address (for account identification)
   b) Name (for personalization)
   c) Profile picture (for display in the Service)
   d) Unique Google identifier (for account linking)

4. The Provider does NOT collect:
   a) Google account password
   b) Contacts from Google account
   c) Files from Google Drive
   d) Any other data from Google services

5. The User may at any time:
   a) Disconnect their Google account in Service settings
   b) Revoke app permissions: https://myaccount.google.com/permissions
   c) Set up a password for email login

6. In case of problems with Google Sign-In, the User should:
   a) Check if the Google account is active
   b) Check if the email in the Google account is verified
   c) Contact the Provider`,
      },
      {
        title: "§6. Payments",
        content: `1. Payments for Top-ups and Document Proofreading are one-time payments processed by the payment operator Stripe. The Service does not offer recurring payments (subscriptions).

2. Available payment methods:
   a) Credit/debit card (Visa, Mastercard)
   b) BLIK

3. The Document Proofreading agreement is concluded when the payment is received.

4. Prices shown in the Service are gross prices (including VAT).

5. The Service Provider issues invoices at the User's request.

6. The registration method (email or Google) does not affect available payment methods or prices.`,
      },
      {
        title: "§7. Intellectual Property Rights",
        content: `1. The Service, its name, logo, graphic design, source code, and all content (excluding User content) are the property of the Provider and are legally protected.

2. The User retains full copyright to texts entered into the Service for checking.

3. The Provider does not acquire any rights to User texts.

4. Texts entered by Users:
   a) Are processed solely for the purpose of providing the Service
   b) Are not used to train AI models
   c) Are stored for 90 days (checked texts) or 30 days (Document Proofreading files), as described in the Privacy Policy
   d) Are not shared with third parties

5. Copying, modifying, distributing, or using materials from the Service without the Provider's consent is prohibited.`,
      },
      {
        title: "§8. Right of Withdrawal",
        content: `1. Consumers have the right to withdraw from a distance contract within 14 days without giving any reason.

2. The withdrawal period expires 14 days from the day of the conclusion of the contract.

3. To exercise the right of withdrawal, you must inform the Provider of your decision by an unequivocal statement (e.g., email to kontakt@ecopywriting.pl).

4. In case of withdrawal, the Provider will refund all payments received without undue delay, no later than 14 days.

5. The right of withdrawal does not apply if:
   a) The Provider has fully performed the service with the Consumer's express consent
   b) The Consumer was informed before the start of provision that they would lose the right of withdrawal after full performance
   c) The Consumer agreed to the commencement of provision before the withdrawal period

6. Document Proofreading starts immediately after payment. By placing the order, the Consumer consents to the performance starting before the withdrawal period expires and acknowledges that they will lose the right of withdrawal once the proofreading is completed. The order cannot be placed without this consent.`,
      },
      {
        title: "§9. Liability",
        content: `1. The Provider makes every effort to ensure the Service operates correctly and continuously.

2. The Provider does not guarantee:
   a) 100% accuracy of checking results (AI technology may make errors)
   b) Uninterrupted availability of the Service
   c) Absence of technical errors
   d) Uninterrupted availability of Google Sign-In (dependent on Google)

3. The Provider is not liable for:
   a) Damages resulting from the use or inability to use the Service
   b) Damages resulting from errors in checking results
   c) Loss of User data caused by third parties
   d) Service interruptions resulting from causes beyond the Provider's control
   e) Problems with Google Sign-In resulting from Google's operations
   f) Changes in Google services affecting login functionality

4. The Provider's liability to Users who are not Consumers is limited to the amount of fees paid by the User in the last 12 months.

5. The User is responsible for:
   a) The content of entered texts
   b) How checking results are used
   c) Violation of third-party rights
   d) Violation of these Terms
   e) Security of their Google account (if using Google Sign-In)`,
      },
      {
        title: "§10. Complaints",
        content: `1. Users may file complaints regarding the operation of the Service or provided Services.

2. Complaints should be submitted:
   a) Electronically to: kontakt@ecopywriting.pl
   b) In writing to the Provider's address

3. A complaint should include:
   a) Contact details of the complainant
   b) Description of the problem
   c) Expected resolution

4. The Provider processes complaints within 14 days of receipt.

5. The response to the complaint is sent to the email address provided in the complaint or the email address assigned to the Account.`,
      },
      {
        title: "§11. Out-of-Court Dispute Resolution",
        content: `1. Consumers have the option to use out-of-court complaint handling and redress mechanisms.

2. Detailed information on Consumer access to out-of-court complaint and redress procedures is available:
   a) At the offices and websites of district (municipal) consumer ombudsmen
   b) On the website of the Office of Competition and Consumer Protection (www.uokik.gov.pl)

3. Consumers may also use the ODR (Online Dispute Resolution) platform available at: https://ec.europa.eu/consumers/odr/`,
      },
      {
        title: "§12. Changes to Terms",
        content: `1. The Provider reserves the right to change these Terms for important reasons, in particular:
   a) Changes in legislation
   b) Changes in the scope of services provided
   c) Changes in Service functionality
   d) Changes in technical conditions
   e) Changes in external services (e.g., Google OAuth)

2. Users will be notified of changes to the Terms:
   a) Through a notice in the Service
   b) Via email (for Users with an Account)

3. Changes take effect on the date specified by the Provider, no less than 14 days from the announcement date.

4. A User who does not accept the changes has the right to terminate the agreement before the changes take effect.`,
      },
      {
        title: "§13. Final Provisions",
        content: `1. The applicable law for agreements concluded under these Terms is Polish law.

2. Matters not regulated by these Terms are governed by applicable Polish law, in particular:
   a) Civil Code
   b) Consumer Rights Act
   c) Act on Provision of Electronic Services
   d) GDPR and personal data protection regulations

3. Any disputes will be resolved by competent Polish courts. For Consumers, the court competent is the court of the Consumer's place of residence.

4. The invalidity of any provision of these Terms does not affect the validity of the remaining provisions.

5. These Terms come into force on the date of publication on the Service website.`,
      },
    ],
  },
};

export function TermsOfServicePage() {
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
          {language === "pl" ? "21 października 2026" : "October 21, 2026"}
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
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
                  )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
