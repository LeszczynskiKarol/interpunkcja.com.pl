--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Category" VALUES ('e1d65c0c-2a31-445a-b7d3-508c5e06bbe2', 'Ogolne Zasady Interpunkcji', 'ogolne-zasady-interpunkcji', NULL, '2025-12-11 18:12:00.894', '2025-12-11 18:12:00.894');
INSERT INTO public."Category" VALUES ('434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Interpunkcyjny Slownik Wyrazow', 'interpunkcyjny-slownik-wyrazow', NULL, '2025-12-11 18:12:00.903', '2025-12-11 18:12:00.903');
INSERT INTO public."Category" VALUES ('cad45763-2945-4eda-bc1f-6dda56bbe2cb', 'Znaki Interpunkcyjne', 'znaki-interpunkcyjne', NULL, '2025-12-11 18:12:00.948', '2025-12-11 18:12:00.948');


--
-- Data for Name: Article; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Article" VALUES ('641a5f75-bb89-4d39-91c2-3d2eacba1896', 'Interpunkcja w wyliczeniach – jak stosować przecinki, myślniki i średniki?', 'interpunkcja-w-wyliczeniach-jak-stosowac-przecinki-myslniki-i-sredniki', '<!-- wp:paragraph -->
<p>Wyliczenia w tekście to duże wyzwanie dla autora – również pod kątem interpunkcji. W takim razie jakie znaki stosować, wymieniając w zdaniu wyrazy jeden po drugim? Czy zasady języka polskiego jasno określają kwestię wypunktowań? Poszukajmy odpowiedzi na to pytanie.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Wyliczenia w zdaniu ciągłym – kiedy przecinek, kiedy średnik?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Analizując wypunktowania w tekście pod kątem interpunkcji, należy wziąć pod uwagę dwie kwestie: sposób zapisu wyliczanych wyrazów bądź zdań oraz ich długość. Jeżeli mamy do czynienia z krótkimi wyliczeniami w zdaniu ciągłym, z reguły rozdziela się je przecinkami.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Jutro jedziemy w góry, nad jezioro, do apartamentu, do restauracji.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Jeśli jednak wyliczenia dotyczą nie pojedynczych wyrazów czy kilku słów, lecz zdań – szczególnie złożonych – czytelniejszym rozwiązaniem jest zastosowanie średników.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>Jutro jedziemy w góry, gdzie będziemy przechadzać się pieszo; nad jezioro, aby popływać kajakiem i się poopalać; do apartamentu, w którym się meldujemy i zostawiamy bagaże; do restauracji, żeby zakończyć długi dzień smaczną kolacją.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Interpunkcja w liście wypunktowanej</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Inaczej sytuacja wygląda przy zapisie wypunktowań jedno pod drugim w formie listy. W przypadku wyliczenia pojedynczych wyrazów lub krótkich zdań dopuszczalne jest nawet niestosowanie żadnego znaku interpunkcyjnego poza kropką po ostatnim wyliczeniu.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Jutro jedziemy:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>w góry</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>nad jezioro</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>do apartamentu</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>do restauracji.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Nie jest to idealne rozwiązanie pod względem językowym, ale dopuszczalne. Za w stu procentach poprawny można natomiast uznać zapis zarówno z przecinkami, jak i średnikami – pod warunkiem że wypunktowanie dotyczy pojedynczych wyrazów bądź krótkich zdań.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Jutro jedziemy:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>w góry,</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>nad jezioro,</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>do apartamentu,</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>do restauracji.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Jutro jedziemy:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>w góry;</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>nad jezioro;</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>do apartamentu;</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>do restauracji.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Jeśli jednak wyliczenie obejmuje dłuższe zdania lub kilka zdań, zalecam kończenie wypunktowań średnikiem, który jasno daje do zrozumienia o zakończeniu danej myśli.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Jutro jedziemy:</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>w góry, gdzie będziemy przechadzać się pieszo;</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>nad jezioro, aby popływać kajakiem i się poopalać;</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>do apartamentu, w którym się meldujemy i zostawiamy bagaże;</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>do restauracji, żeby zakończyć długi dzień smaczną kolacją.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Warto zwrócić uwagę, że w każdym z przykładów, w których wypunktowanie następuje „z góry na dół”, akapit pod akapitem, a nie w zdaniu ciągłym, wyliczenie zostaje poprzedzone dwukropkiem.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Jutro jedziemy<strong>:</strong></p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Interpunkcja w wypunktowaniach w tekstach marketingowych</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Odrębnym przypadkiem są teksty marketingowe i reklamowe, w których stosuje się przeważnie wypunktowania bez żadnych znaków interpunkcyjnych. Taki „czysty” zapis można co prawda uznać za nieprawidłowy pod względem językowym, jednak z punktu widzenia funkcji marketingowej jest lepszy. Brak znaków interpunkcyjnych pozwala bowiem odbiorcy w pełni skupić się na przekazywanej treści.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Przyjedź do nas i podziwiaj<br>jeziora<br>góry<br>łąki<br>lasy</p>
<!-- /wp:paragraph -->', 'Wyliczenia w tekście to duże wyzwanie dla autora – również pod kątem interpunkcji. W takim razie jakie znaki stosować, wymieniając w zdaniu wyrazy jeden po drugim? Czy zasady języka polskiego...', 'e1d65c0c-2a31-445a-b7d3-508c5e06bbe2', 'Interpunkcja w wyliczeniach – jak stosować przecinki, myślniki i średniki?', 'Wyliczenia w tekście to duże wyzwanie dla autora – również pod kątem interpunkcji. W takim razie jakie znaki stosować, wymieniając w zdaniu wyrazy jeden po drugim? Czy zasady języka polskiego...', true, '2023-06-09 14:35:14', '2025-12-11 18:12:00.898', '2025-12-11 18:12:00.898');
INSERT INTO public."Article" VALUES ('c1c9dc53-a757-41ad-9123-780079684d4e', 'Przecinek przed "gdyby"', 'przecinek-przed-gdyby', '<strong>„Gdyby”, które funkcjonuje w zdaniu jako spójnik, wprowadza do niego wypowiedzenie podrzędne warunkowe. Umieszcza się przed nim przecinek. Jeżeli część podrzędna zdania znajduje się na jego początku, to oba człony konstrukcji złożonej oddziela się przecinkiem lub myślnikiem:</strong>
<!--more-->
<ul>
	<li>- Zdałabym egzamin, gdybym się lepiej uczyła.</li>
	<li>- Zdążyłby na czas, gdyby wyjechał z domu wcześniej.</li>
	<li>- Gdybyś chciała, to zabiorę Cię na gorącą czekoladę.</li>
</ul>
W pewnych sytuacjach „gdyby” łączy się z innymi wyrazami w spójnik zestawiony, np. „na wypadek gdyby”, „w razie gdyby”, „w wypadku gdyby”. Przecinek w takiej sytuacji stawia się przed całym połączeniem:
<ul>
	<li>- W razie gdybyście mieli się spóźnić, to przyślijcie mi jakąś wiadomość.</li>
	<li>- Załatwiłem jeszcze jeden dzień do wykonania projektu, na wypadek gdyby zabrakło nam czasu na zrealizowanie całości.</li>
</ul>
„Gdyby” może też rozpoczynać zdanie pojedyncze, które oznacza głębokie pożądanie czegoś. Na końcu takiego zdania umieszcza się odpowiedni znak interpunkcyjny kończący zdanie:
<ul>
	<li>- Gdyby można było cofnąć czas!</li>
	<li>- Gdybyś zechciała do mnie napisać...</li>
</ul>', '„Gdyby”, które funkcjonuje w zdaniu jako spójnik, wprowadza do niego wypowiedzenie podrzędne warunkowe. Umieszcza się przed nim przecinek. Jeżeli część podrzędna zdania znajduje się na jego początku, to oba człony...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "gdyby"', '„Gdyby”, które funkcjonuje w zdaniu jako spójnik, wprowadza do niego wypowiedzenie podrzędne warunkowe. Umieszcza się przed nim przecinek. Jeżeli część podrzędna zdania znajduje się na jego początku, to oba człony...', true, '2011-07-20 14:59:05', '2025-12-11 18:12:00.905', '2025-12-11 18:12:00.905');
INSERT INTO public."Article" VALUES ('e7dcd45b-67fa-43d8-8049-85f13a6d4dfa', 'Przecinek przed "gdy"', 'przecinek-przed-gdy', 'Zadaniem spójnika „gdy” jest wprowadzanie do zdania wypowiedzenia podrzędnego. Umieszcza się przed nim przecinek. W momencie, gdy część podrzędna zdania znajduje się na jego początku lub w jego środku, to oba człony tego zdania oddziela się przecinkiem lub przecinkami:
<!--more-->
<ul>
	<li>- Gdy jechałam autobusem, ktoś spotkałem znajomego.</li>
	<li>- Zgasiliśmy ognisko, gdy zrobiło się ciemno.</li>
	<li>- Gdy masz ochotę na lody, przyjdź do lodziarni na starówce.</li>
	<li>- Kiedyś, gdy się spotkamy, pożyczę Ci tę książkę.</li>
</ul>
<strong>Czasami spójnik „gdy” tworzy z zaimkiem lub przysłówkiem rodzaj spójnika zestawionego</strong>, takiego jak: „dopiero gdy”, „z chwilą gdy”, „teraz gdy”, „wiem gdy”, „potem gdy”, „wtedy gdy”, „właśnie gdy”. Przecinek w zdaniach z takimi zestawieniami umieszcza się przed całym połączeniem:
<ul>
	<li>- Zdała sobie sprawę z tego, co zrobiła, dopiero gdy wytrzeźwiała.</li>
	<li>- Andrzej poczuł się bardzo źle, z chwilą gdy dowiedział się, że jako jedyny nie zdał egzaminu.</li>
</ul>', 'Zadaniem spójnika „gdy” jest wprowadzanie do zdania wypowiedzenia podrzędnego. Umieszcza się przed nim przecinek. W momencie, gdy część podrzędna zdania znajduje się na jego początku lub w jego środku, to...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "gdy"', 'Zadaniem spójnika „gdy” jest wprowadzanie do zdania wypowiedzenia podrzędnego. Umieszcza się przed nim przecinek. W momencie, gdy część podrzędna zdania znajduje się na jego początku lub w jego środku, to...', true, '2011-07-20 14:57:28', '2025-12-11 18:12:00.907', '2025-12-11 18:12:00.907');
INSERT INTO public."Article" VALUES ('6dae144c-2b3f-45e5-adb5-048f695d6917', 'Przecinek przed "dlatego"', 'przecinek-przed-dlatego', 'Popularny w polskiej interpunkcji spójnik „dlatego” łączy wypowiedzenia współrzędne o charakterze wynikowym. Umieszcza się przed nim przecinek lub dwukropek:
<!--more-->
<ul>
	<li>- Musze sprzedać swoje stare wazony, dlatego wezmę je jutro na rynek.</li>
	<li>- Przystąpisz jutro do egzaminu na prawo jazdy, dlatego przypomnij sobie wszystkie przepisy związane z ruchem ulicznym.</li>
</ul>
<strong>„Dlatego” w funkcji zaimka zapowiada wypowiedzenie podrzędne przyczynowe</strong>. Przecinek umieszcza się w zdaniu po „dlatego”, a przed spójnikiem podrzędnym:
<ul>
	<li>- Nie zdała egzaminu dlatego, że była nienauczona.</li>
	<li>- Ubrał się w piżamę  dlatego, że szedł spać.</li>
</ul>', 'Popularny w polskiej interpunkcji spójnik „dlatego” łączy wypowiedzenia współrzędne o charakterze wynikowym. Umieszcza się przed nim przecinek lub dwukropek: - Musze sprzedać swoje stare wazony, dlatego wezmę je jutro na...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "dlatego"', 'Popularny w polskiej interpunkcji spójnik „dlatego” łączy wypowiedzenia współrzędne o charakterze wynikowym. Umieszcza się przed nim przecinek lub dwukropek: - Musze sprzedać swoje stare wazony, dlatego wezmę je jutro na...', true, '2011-07-20 14:55:33', '2025-12-11 18:12:00.909', '2025-12-11 18:12:00.909');
INSERT INTO public."Article" VALUES ('a9cef092-04fa-4c89-8096-bdeeb472e881', 'Przecinek przed "dlaczego"', 'przecinek-przed-dlaczego', 'Zaimek „dlaczego” wprowadza wypowiedzenia podrzędne. Umieszcza się przed nim przecinek. W sytuacji, gdy spójnik ten znajduje się na początku zdania złożonego, to przecinek umieszcza się po części nadrzędnej, a na końcu tego zdania stawia się pytajnik, lecz tylko wtedy, gdy zdanie nadrzędne ma charakter pytania:
<ul>
	<li>- Nie wiem, dlaczego tak postąpiłem.</li>
	<li>- Dlaczego tak postąpił, nigdy się nie dowiedział.</li>
	<li>- Czy wiesz, dlaczego Karolina była dzisiaj smutna?</li>
	<li>- Słyszałeś może, dlaczego Łukasz nakrzyczał na Ewelinę?</li>
</ul>
<strong>Jeżeli „dlaczego” znajduje się na końcu zdania, nie stawia się przed nim przecinka:</strong>
<ul>
	<li>- Zapomniałam zrobić zakupy i nie wiem dlaczego.</li>
	<li>- Nie zdałam egzaminu i nie mam pojęcia dlaczego.</li>
	<li>- Konserwatyści potępiają wszelkie nowe idee małżeństw innych niż te, w które wstępują mężczyzna i kobieta. Łatwo się domyślić dlaczego.</li>
</ul>
<strong>Zaimek „dlaczego” rozpoczyna też czasami pytania samoistne i zdania ekspresywne</strong>:
<ul>
	<li>- Dlaczego spotkało to właśnie mnie?</li>
	<li>- Dlaczego płaczesz?</li>
	<li>- Dlaczego nie zdałaś egzaminu?</li>
</ul>
', 'Zaimek „dlaczego” wprowadza wypowiedzenia podrzędne. Umieszcza się przed nim przecinek. W sytuacji, gdy spójnik ten znajduje się na początku zdania złożonego, to przecinek umieszcza się po części nadrzędnej, a na...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "dlaczego"', 'Zaimek „dlaczego” wprowadza wypowiedzenia podrzędne. Umieszcza się przed nim przecinek. W sytuacji, gdy spójnik ten znajduje się na początku zdania złożonego, to przecinek umieszcza się po części nadrzędnej, a na...', true, '2011-07-20 14:54:08', '2025-12-11 18:12:00.911', '2025-12-11 18:12:00.911');
INSERT INTO public."Article" VALUES ('1de55222-e3e6-4e7a-920d-1d3ac65f2629', 'Przecinek przed "czemu"', 'przecinek-przed-czemu', '<strong>Zaimek ten wprowadza różne wypowiedzenia podrzędne i jest synonimiczny wyrazu „czego”. Umieszcza się przed nim przecinek.</strong> Jeżeli jednak część podrzędna występuje na początku zdania złożonego, to oddziela się przecinkiem oba człony:
<ul>
	<li>- Napisz mi smsa, czemu się spóźniasz.</li>
	<li>- Już wiem, czemu Andrzej nie odbierał telefonów.</li>
	<li>- Nie rozumiem, czemu się złościsz?</li>
</ul>
Zaimek „czemu” rozpoczyna też pytania samoistne:
<ul>
	<li>- Czemu nie przyjechałaś na czas?</li>
	<li>- Czemu tak źle się czuję?</li>
</ul>', 'Zaimek ten wprowadza różne wypowiedzenia podrzędne i jest synonimiczny wyrazu „czego”. Umieszcza się przed nim przecinek. Jeżeli jednak część podrzędna występuje na początku zdania złożonego, to oddziela się przecinkiem oba...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "czemu"', 'Zaimek ten wprowadza różne wypowiedzenia podrzędne i jest synonimiczny wyrazu „czego”. Umieszcza się przed nim przecinek. Jeżeli jednak część podrzędna występuje na początku zdania złożonego, to oddziela się przecinkiem oba...', true, '2011-07-20 14:49:25', '2025-12-11 18:12:00.916', '2025-12-11 18:12:00.916');
INSERT INTO public."Article" VALUES ('51b6ff53-34da-4d0a-84ce-6f7d697791b3', 'Przecinek przed "co"', 'przecinek-przed-co', '<strong>Zaimek „co” może wprowadzać różne wypowiedzenia podrzędne</strong>. Stawia się w takiej sytuacji przed nim przecinek. Jednak w momencie, gdy część podrzędna występuje na początku zdania złożonego lub w środku zdania nadrzędnego, to oba człony oddziela się przecinkiem lub przecinkami:
<ul>
	<li>- Nie widziałem tego, co było wcześniej.</li>
	<li>- Nie lubię tego, co jest smutne.</li>
</ul>
<strong>Jeżeli zaimek „co” pojawi się w konstrukcjach z dwoma czasownikami</strong>, takimi jak: „robić”, „jeść” itd., to nie stawia się przecinka przed nim
<ul>
	<li>- Pada deszcz i nie mam co robić.</li>
	<li>- Kupiłem trochę jedzenia i mam w końcu co jeść.</li>
	<li>- Wróciłam do domu wcześniej, bo u Gosi nie miałam co robić.</li>
</ul>
Zaimek „co” łączy się w przytoczonych zdaniach z bezokolicznikiem, a całość tworzy jeden układ predykatywny.
<strong>„Co” może wystąpić w zdaniu też jako spójnik, który wprowadza wypowiedzenie podrzędne</strong>. Pojawia się on wtedy zazwyczaj na początku wypowiedzenia złożonego. Oba składniki zdania oddziela się tu przecinkiem lub myślnikiem:
<ul>
	<li>- Co rzucił, nie trafił.</li>
	<li>- Co zajrzę – pusto.</li>
	<li>- Co losowanie, to stracone pieniądze.</li>
</ul>
<strong>W sytuacji, gdy „co” w zdaniu będzie pełnić funkcję partykuły wzmacniającej</strong>, to nie oddziela się tego wyrazu od pozostałych wyrazów znajdujących się w zdaniu:
<ul>
	<li>- Pani z opieki odwiedzać was będzie co najmniej raz na tydzień.</li>
	<li>- Nie lubię czytać, dlatego opuszczam co drugą stronę.</li>
	<li>- Zmieniam studnia regularnie co rok.</li>
	<li>- Mało co zarobiłem w tym tygodniu.</li>
</ul>
<strong>Wyraz „co” może w połączeniu z określonymi przymiotnikami lub przysłówkami</strong> o stopniu wyższym i najwyższym tworzyć wtrącenia, które wydziela się przecinkami lub myślnikami:
<ul>
	<li>- Wszystko mi przeszkadzało i, co najważniejsze, nawet ja sam sobie zacząłem przeszkadzać.</li>
	<li>- Chciałam wpaść z wizytą do Londynu – co ciekawe – zakupiłam już bilet.</li>
</ul>
<strong>Jeżeli "co" występuje przed orzeczeniem (czasownikiem), należy wówczas postawić przecinek, tak jak w poniższych przykładach:</strong>
<ul>
	<li>- Mój dom jest wszystkim, co kocham.</li>
	<li>- Coś, co lubię najbardziej, to pączki.</li>
	<li>- Zobacz, co zrobiłeś!</li>
</ul>
', 'Zaimek „co” może wprowadzać różne wypowiedzenia podrzędne. Stawia się w takiej sytuacji przed nim przecinek. Jednak w momencie, gdy część podrzędna występuje na początku zdania złożonego lub w środku zdania...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "co"', 'Zaimek „co” może wprowadzać różne wypowiedzenia podrzędne. Stawia się w takiej sytuacji przed nim przecinek. Jednak w momencie, gdy część podrzędna występuje na początku zdania złożonego lub w środku zdania...', true, '2011-07-20 14:46:54', '2025-12-11 18:12:00.918', '2025-12-11 18:12:00.918');
INSERT INTO public."Article" VALUES ('5b679a0b-d92b-476c-b1ff-1b8429a373f8', 'Przecinek przed "chyba"', 'przecinek-przed-chyba', '<strong>Spójnik „chyba” wprowadza zdanie lub jego część, oznaczającą wyjątek, ograniczenie lub przeciwstawienie. Stawia się przed nim przecinek, kropkę lub średnik.</strong> Jeżeli spójnik „chyba” występuje w funkcji zestawionej, to umieszcza się znak interpunkcyjny przed całym zestawieniem, a nie przed „że” lub „żeby”:<!--more-->
<ul>
	<li>- Nie przyjdę do ciebie, chyba że mnie zaprosisz.</li>
	<li>- Wpadnę o 14, chyba że będą korki, to się trochę spóźnię.</li>
</ul>
<strong>„Chyba”, które pojawi się w zdaniu jako partykuła, osłabia treść zdania lub jego części</strong>. Nie oddziela się w takim wypadku tej partykuły od innych wyrazów:
<ul>
	<li>- Chyba dam radę.</li>
	<li>- On chyba zgłupiał.</li>
	<li>- Ona ma chyba dużą nadwagę.</li>
</ul>', 'Spójnik „chyba” wprowadza zdanie lub jego część, oznaczającą wyjątek, ograniczenie lub przeciwstawienie. Stawia się przed nim przecinek, kropkę lub średnik. Jeżeli spójnik „chyba” występuje w funkcji zestawionej, to umieszcza się...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "chyba"', 'Spójnik „chyba” wprowadza zdanie lub jego część, oznaczającą wyjątek, ograniczenie lub przeciwstawienie. Stawia się przed nim przecinek, kropkę lub średnik. Jeżeli spójnik „chyba” występuje w funkcji zestawionej, to umieszcza się...', true, '2011-07-20 14:44:34', '2025-12-11 18:12:00.919', '2025-12-11 18:12:00.919');
INSERT INTO public."Article" VALUES ('eaf8e5cf-0ed0-4a27-aecf-9d47109b07da', 'Przecinek przed "choć"', 'przecinek-przed-choc', '<strong>„Choć” jest spójnikiem wprowadzającym wypowiedzenia podrzędne lub części zdania, przed którym stawia się przecinek.</strong> Zdanie podrzędne zbudowane z „choć” może również poprzedzać część nadrzędną lub występować w jej środku. Oba człony oddziela się wtedy przecinkiem lub nawet dwoma:
<!--more-->
<ul>
	<li>- Łukasz ma dobre oceny, choć wcale dużo się nie uczy.</li>
	<li>- Zrobił pracę już na dzisiaj, choć nikt go oto nie prosił.</li>
	<li>- Choć kandydatów nie było wielu, to i tak nie wszystkich zakwalifikowano.</li>
</ul>
<strong>„Choć” może pojawić się w zdaniu wraz z osobnym składnikiem</strong> – „to (jednak)”. Oba te człony tworzą w zdaniu spójnik skorelowany, przed którego drugim członem stawia się przecinek:
<ul>
	<li>- Choć tak dużo zdobyłem, to nie czuję się szczęśliwy.</li>
	<li>- Choć muchy wydają się nam obrzydliwe, to żaby je spożywają chętnie.</li>
	<li>- Choć wszyscy byliśmy bardzo zmęczeni, to żaden z nas nie powiedział słowa w obawie przed reakcją lidera.</li>
</ul>
<strong>Wyraz „choć” może też pełnić w zdaniu funkcję partykuły</strong>. Uwydatnia on wtedy treść synonimów: „bodaj, „przynajmniej”. Nie oddziela się go w takiej sytuacji od innych wyrazów:
<ul>
	<li>- Powiedz choć słowo, a się zdenerwuję!</li>
	<li>- Daj mi czas choć do jutra.</li>
</ul>
', '„Choć” jest spójnikiem wprowadzającym wypowiedzenia podrzędne lub części zdania, przed którym stawia się przecinek. Zdanie podrzędne zbudowane z „choć” może również poprzedzać część nadrzędną lub występować w jej środku. Oba...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "choć"', '„Choć” jest spójnikiem wprowadzającym wypowiedzenia podrzędne lub części zdania, przed którym stawia się przecinek. Zdanie podrzędne zbudowane z „choć” może również poprzedzać część nadrzędną lub występować w jej środku. Oba...', true, '2011-07-20 14:42:45', '2025-12-11 18:12:00.922', '2025-12-11 18:12:00.922');
INSERT INTO public."Article" VALUES ('800a72d5-73cf-450b-81e8-ad785250ce06', 'Przecinek przed "chociaż"', 'przecinek-przed-chociaz', '<strong>Spójnik „chociaż” pełni funkcję wprowadzającą wobec wypowiedzeń podrzędnych lub części zdania. Umieszcza się przed nim przecinek</strong>, a w momencie gdy rozpoczyna on zdanie złożone, oddziela się przecinkiem część nadrzędną zdania:
<!--more-->
<ul>
	<li>- Pojedziemy do babci, chociaż nie wiem, czy jest w domu.</li>
	<li>- Chociaż jestem zmęczony, to pracuję nadal.</li>
	<li>- On jest bardzo inteligentny, chociaż uczy się słabo.</li>
	<li>- Koleje państwowe, chociaż są, jakie są, to jednak nie ma często innej alternatywy transportu.</li>
</ul>
<strong>Wraz ze spójnikiem „chociaż” może wystąpić składnik „to (jednak)” </strong>i razem stworzą spójnik skorelowany. Przed drugim członem korelacji stawia się przecinek:
<ul>
	<li>- Chociaż był jeszcze młody, to często dokuczały mu plecy.</li>
	<li>- Chociaż był jeszcze młody, to jednak często dokuczały mu plecy.</li>
	<li>- Chociaż pracował bardzo ciężko, jednak nie zdał prawa jazdy.</li>
</ul>
<strong>Spójnik „chociaż” może przybrać funkcję partykuły uwydatniającej różne treści:</strong> synonim „bodaj” lub „przynajmniej”. Nie oddziela się jej przecinkiem od innych wyrazów:
<ul>
	<li>- Daj mi chociaż parę złotych!</li>
	<li>- Odrób dzisiaj chociaż połowę lekcji.</li>
</ul>', 'Spójnik „chociaż” pełni funkcję wprowadzającą wobec wypowiedzeń podrzędnych lub części zdania. Umieszcza się przed nim przecinek, a w momencie gdy rozpoczyna on zdanie złożone, oddziela się przecinkiem część nadrzędną zdania:...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "chociaż"', 'Spójnik „chociaż” pełni funkcję wprowadzającą wobec wypowiedzeń podrzędnych lub części zdania. Umieszcza się przed nim przecinek, a w momencie gdy rozpoczyna on zdanie złożone, oddziela się przecinkiem część nadrzędną zdania:...', true, '2011-07-20 14:40:40', '2025-12-11 18:12:00.924', '2025-12-11 18:12:00.924');
INSERT INTO public."Article" VALUES ('ad6b4ce4-d14c-48bf-8b59-ce4a6b189df5', 'Przecinek przed "byle"', 'przecinek-przed-byle', '<strong>Funkcją tego spójnika jest wprowadzanie wypowiedzeń podrzędnych lub części zdania.</strong> Pojawia się on na początku zdania złożonego lub po wypowiedzeniu nadrzędnym. Części składowe takiego zdania oddziela się przecinkiem, kropką lub wielokropkiem:
<!--more-->
<ul>
	<li>- Jesteśmy gotowe na wszystko, byle pokonać swoje rywalki.</li>
	<li>- Powiedz mi wszystko, byle to była prawda.</li>
</ul>
<strong>Nie umieszcza się przecinka przed związkiem frazeologicznym</strong> „byle zbyć”, który oznacza – „niedbale”:
<ul>
	<li>- Napisaliśmy maturę byle zbyć.</li>
	<li>- Pracowałem dzisiaj na byle zbyć.</li>
</ul>
<strong>Również nie stawia się przecinka, gdy „byle”</strong> występuje w zdaniu jako partykuła przed rzeczownikiem lub zaimkiem i oznacza nieprzywiązywanie wagi do wyboru czegoś:
<ul>
	<li>- Uśmiech na jej twarzy sprawiała byle drobnostka.</li>
	<li>- Rozrzuciłem skarpety byle gdzie.</li>
</ul>', 'Funkcją tego spójnika jest wprowadzanie wypowiedzeń podrzędnych lub części zdania. Pojawia się on na początku zdania złożonego lub po wypowiedzeniu nadrzędnym. Części składowe takiego zdania oddziela się przecinkiem, kropką lub...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "byle"', 'Funkcją tego spójnika jest wprowadzanie wypowiedzeń podrzędnych lub części zdania. Pojawia się on na początku zdania złożonego lub po wypowiedzeniu nadrzędnym. Części składowe takiego zdania oddziela się przecinkiem, kropką lub...', true, '2011-07-20 14:37:40', '2025-12-11 18:12:00.926', '2025-12-11 18:12:00.926');
INSERT INTO public."Article" VALUES ('3101ce25-707f-4ffa-8902-7180cf1ceb51', 'Przecinek przed "by"', 'przecinek-przed-by', '<strong>Spójnik „by” wprowadza różne wypowiedzenia podrzędne w zdaniu, dlatego umieszcza się przed nim przecinek.</strong> W przypadku, gdy część podrzędna wypowiedzenia poprzedza nadrzędną lub występuje w jej środku, to oddziela się oba człony zdania przecinkiem lub dwoma przecinkami:
<!--more-->
<ul>
	<li>- Bardzo długo się uczył, by zdać ten egzamin na ocenę bardzo dobrą.</li>
	<li>- Próbowałem ją przekonać, by wzięła się do pracy.</li>
	<li>- Kupiłem lepszy samochód tylko po to, by móc się pochwalić przed sąsiadem.</li>
</ul>
<strong>Umieszcza się również przecinek przed związkami frazeologicznymi</strong> „by nie rzec, „by nie powiedzieć”, które są używane w celu złagodzenia ostrego określenia:
<ul>
	<li>- To łamanie norm, by nie rzec dobitniej.</li>
	<li>- Otępienie, by nie rzec, otumanienie ogarnęło wszystkich.</li>
</ul>
<strong>Nie umieszcza się natomiast przecinka przed „by” w połączeniach</strong>: „nie tylko by”. Występuje tu tak zwane cofanie przecinka:
<ul>
<li>- Przyszli na otwarcie sklepu, nie tylko by spróbować wytrawnych dań, ale także by obejrzeć ceny, które oferuje.</li>
</ul>', 'Spójnik „by” wprowadza różne wypowiedzenia podrzędne w zdaniu, dlatego umieszcza się przed nim przecinek. W przypadku, gdy część podrzędna wypowiedzenia poprzedza nadrzędną lub występuje w jej środku, to oddziela się...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "by"', 'Spójnik „by” wprowadza różne wypowiedzenia podrzędne w zdaniu, dlatego umieszcza się przed nim przecinek. W przypadku, gdy część podrzędna wypowiedzenia poprzedza nadrzędną lub występuje w jej środku, to oddziela się...', true, '2011-07-20 14:33:47', '2025-12-11 18:12:00.928', '2025-12-11 18:12:00.928');
INSERT INTO public."Article" VALUES ('bf8c6b0e-5e36-46b6-9e93-28e786f6a02b', 'Przecinek przed "bo"', 'przecinek-przed-bo', '<stron>”Bo” to spójnik, który wprowadza różne wypowiedzenia podrzędne albo przyłącza części zdania, które są jego rozwinięciem/wyjaśnieniem.</stron> Stawia się przed nim przecinek lub inne znaki oddzielające:
<!--more-->
<ul>
	<li>- Nie wolno tu palić, bo wisi zakaz.</li>
	<li>- Wyjdź spod stołu, bo uderzysz głowa o kant.</li>
	<li>- Nie zdałam egzaminu, bo się za mało uczyłam.</li>
</ul>
<strong>Jeżeli spójnik „bo” wystąpi w zdaniu jako partykuła wzmacniająca, to oddziela się ją przecinkiem</strong>:
<ul>
	<li>- Ciężko, bo ciężko, ale dobra płaca.</li>
	<li>- Dupek, bo dupek, ale i tak go lubię.</li>
</ul>
<strong>Jeżeli natomiast prezentowany spójnik wystąpi jako partykuła wyrażającą przeczenie</strong> lub powątpiewanie w zwrotach pytających albo mających charakter wykrzyknienia, to stawia się znak interpunkcyjny na końcu zdania:
<ul>
	<li>Bo ja wiem!</li>
	<li>A bo mi tu czego brakuje?</li>
</ul>', '”Bo” to spójnik, który wprowadza różne wypowiedzenia podrzędne albo przyłącza części zdania, które są jego rozwinięciem/wyjaśnieniem. Stawia się przed nim przecinek lub inne znaki oddzielające: - Nie wolno tu palić,...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "bo"', '”Bo” to spójnik, który wprowadza różne wypowiedzenia podrzędne albo przyłącza części zdania, które są jego rozwinięciem/wyjaśnieniem. Stawia się przed nim przecinek lub inne znaki oddzielające: - Nie wolno tu palić,...', true, '2011-07-20 14:30:26', '2025-12-11 18:12:00.929', '2025-12-11 18:12:00.929');
INSERT INTO public."Article" VALUES ('371f7771-d464-45cd-85dc-a0a19f938b96', 'Przecinek przed "bądź"', 'przecinek-przed-badz', 'Spójnik „bądź” o charakterze współrzędnym łączy zdania lub ich części i jednocześnie oznacza ich możliwą wymienność. Nie stawia się przed nim przecinka. Jego funkcja jest analogiczna wobec „albo” bądź „lub”:
<!--more-->
<ul>
	<li>- Pojadę autobusem bądź tramwajem.</li>
	<li>- Czeka Cię dużo miłości bądź dużo rozczarowań.</li>
	<li>- Pójdę na studia socjologiczne bądź na matematyczne.</li>
</ul>
<strong>Stawia się natomiast przecinek, jeśli spójnik „bądź” występuje w zdaniu więcej niż jeden raz:</strong>
<ul>
	<li>- Pojadę bądź autobusem, bądź tramwajem.</li>
	<li>- Czeka Cię bądź dużo miłości, bądź dużo rozczarowań.</li>
	<li>- Pójdę na studia bądź socjologiczne, bądź matematyczne.</li>
</ul>', 'Spójnik „bądź” o charakterze współrzędnym łączy zdania lub ich części i jednocześnie oznacza ich możliwą wymienność. Nie stawia się przed nim przecinka. Jego funkcja jest analogiczna wobec „albo” bądź „lub”:...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "bądź"', 'Spójnik „bądź” o charakterze współrzędnym łączy zdania lub ich części i jednocześnie oznacza ich możliwą wymienność. Nie stawia się przed nim przecinka. Jego funkcja jest analogiczna wobec „albo” bądź „lub”:...', true, '2011-07-20 14:28:26', '2025-12-11 18:12:00.931', '2025-12-11 18:12:00.931');
INSERT INTO public."Article" VALUES ('e693bc48-ba43-4d0c-bff6-de74020d732f', 'Przecinek przed "aż"', 'przecinek-przed-az', '<strong>„Aż” jest spójnikiem zestawiającym zdania współrzędne z uwydatnieniem treści jednego z nich lub nagłej zmiany sytuacji</strong>. Stawia się przed nim przecinek, myślnik, średnik lub kropkę:
<!--more-->
<ul>
	<li>- Dziadek opowiadał straszne historie, aż tu nagle coś zastukało w okno.</li>
	<li>- Tak długo czekałem na te raporty, aż straciłem cierpliwość.</li>
</ul>
<strong>Jeżeli spójnik „aż” występuje w zdaniu podrzędnym okolicznikowym, to stawia się przed nim przecinek:</strong>
<ul>
	<li>- Pracował, aż padł.</li>
	<li>- Czekałam, aż zasnęłam.</li>
	<li>- Próbowałam, aż do wczoraj, ale się nie udało.</li>
</ul>', '„Aż” jest spójnikiem zestawiającym zdania współrzędne z uwydatnieniem treści jednego z nich lub nagłej zmiany sytuacji. Stawia się przed nim przecinek, myślnik, średnik lub kropkę: - Dziadek opowiadał straszne historie,...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "aż"', '„Aż” jest spójnikiem zestawiającym zdania współrzędne z uwydatnieniem treści jednego z nich lub nagłej zmiany sytuacji. Stawia się przed nim przecinek, myślnik, średnik lub kropkę: - Dziadek opowiadał straszne historie,...', true, '2011-07-20 14:27:25', '2025-12-11 18:12:00.932', '2025-12-11 18:12:00.932');
INSERT INTO public."Article" VALUES ('5f07363c-3dec-4313-9ba8-88830a9ea9fc', 'Przecinek przed "ale"', 'przecinek-przed-ale', '<strong>Spójnik „ale” ma kilka funkcji w zdaniu: wyraża przeciwieństwo, kontrast, łączy równorzędne części zdania albo wypowiedzenia współrzędne.</strong> Umieszcza się przed nim przecinek, średnik lub myślnik:
<!--more-->
<ul>
	<li>- Ten telewizor jest duży, ale słabej jakości</li>
	<li>- Płakał nie z rozpaczy, ale z rozbawienia.</li>
	<li>- Zaczął pracę wcześnie, ale bardzo późno skończył.</li>
	<li>- Wydawało mi się, że jestem gotowy na konfrontację z szefem, ale się pomyliłem</li>
</ul>
<strong>Partykuła wzmacniająca lub wykrzyknik wraz ze spójnikiem „ale”</strong> wyraża zdumienie, podziw lub zaskoczenie. Na końcu zdań z tymi wyrazami mowy stawia się znak wykrzyknienia, który również może występować w jego środku:
<ul>
	<li>- Ale nuda!</li>
	<li>- Przyszedł na czas? - Ale gdzie tam!</li>
	<li>- Ale mnie zawiodłeś!</li>
	<li>- Ale, ale, oddaj te wszystkie cukierki, Zosiu!</li>
</ul>
<strong>Czasami używa się tego spójnika jako rzeczownika nieodmiennego</strong>, w znaczeniu – słaba strona kogoś lub czegoś brak; ewentualnie wada. W takiej sytuacji nie stawia się przed „ale” znaków interpunkcyjnych:
<ul>
	<li>- Jolka zawsze powie swoje ale.</li>
	<li>- Cokolwiek Ci nie powiem, to zawsze wyrazisz swoje ale.</li>
</ul>
', 'Spójnik „ale” ma kilka funkcji w zdaniu: wyraża przeciwieństwo, kontrast, łączy równorzędne części zdania albo wypowiedzenia współrzędne. Umieszcza się przed nim przecinek, średnik lub myślnik: - Ten telewizor jest duży,...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "ale"', 'Spójnik „ale” ma kilka funkcji w zdaniu: wyraża przeciwieństwo, kontrast, łączy równorzędne części zdania albo wypowiedzenia współrzędne. Umieszcza się przed nim przecinek, średnik lub myślnik: - Ten telewizor jest duży,...', true, '2011-07-20 14:23:43', '2025-12-11 18:12:00.936', '2025-12-11 18:12:00.936');
INSERT INTO public."Article" VALUES ('5cdc0c8f-d8e7-4432-bf60-47a1def72b68', 'Przecinek przed "albowiem"', 'przecinek-przed-albowiem', '<strong>Wprowadzający spójnik „albowiem” rozpoczyna wypowiedzenie podrzędne przyczynowe</strong>. Stawia się przed nim przecinek:
<!--more-->
<ul>
	<li>- Słychać było wielki huk, albowiem wykoleił się pociąg.</li>
	<li>- Dobiegł do mety ostatni, albowiem biegł najwolniej</li>
</ul>
<strong>Spójnik ten wprowadza także często wypowiedzenia wtrącone</strong>, wyjaśniające treść całości zdania. W takim wypadku znajduje się on w środku części nadrzędnej zdania. Wypowiedzenie wtrącone oddziela się przecinkami lub myślnikami:
<ul>
	<li>- Gdy kupiła nowy samochód, albowiem stary się zepsuł, okazało się, że wcale nie jest lepszy od starego.</li>
	<li>- Gdy kupiła nowy samochód - albowiem stary się zepsuł - okazało się, że wcale nie jest lepszy od starego.</li>
</ul>
', 'Wprowadzający spójnik „albowiem” rozpoczyna wypowiedzenie podrzędne przyczynowe. Stawia się przed nim przecinek: - Słychać było wielki huk, albowiem wykoleił się pociąg. - Dobiegł do mety ostatni, albowiem biegł najwolniej Spójnik...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "albowiem"', 'Wprowadzający spójnik „albowiem” rozpoczyna wypowiedzenie podrzędne przyczynowe. Stawia się przed nim przecinek: - Słychać było wielki huk, albowiem wykoleił się pociąg. - Dobiegł do mety ostatni, albowiem biegł najwolniej Spójnik...', true, '2011-07-20 14:20:20', '2025-12-11 18:12:00.939', '2025-12-11 18:12:00.939');
INSERT INTO public."Article" VALUES ('dc9aed1a-e6c0-44e3-98b4-4be74888c7a4', 'Przecinek przed "albo"', 'przecinek-przed-albo', '<strong>Spójnik „albo” jest spójnikiem współrzędnym. Łączy on wypowiedzenia rozłączne lub części zdania oraz wyraża możliwą wymienność wypowiedzeń albo wyrazów</strong>. Nie umieszcza się przed nim przecinka:
<!--more-->
<ul>
	<li>- Kupię samochód albo motor.</li>
	<li>- Pójdziemy na herbatę albo na kawę.</li>
	<li>- Teraz albo nigdy.</li>
	<li>- Wpadnę do Ciebie w południe albo wieczorem.</li>
</ul>
<strong>W sytuacji, gdy spójnik „albo” jest podwojony</strong> stawia się znak przestankowy przed drugim i każdym kolejnym „albo”:
<ul>
	<li>- Albo pojadę tramwajem, albo wezmę samochód.</li>
	<li>- Przyjadę albo jutro, albo w poniedziałek.</li>
</ul>
<strong>Może się zdarzyć, że spójnik „albo” stworzy z innymi wyrazami</strong> połączenie o charakterze dopowiedzenia lub wtrącenia. Stawia się wtedy przed nim przecinek bądź średnik:
<ul>
	<li>- Była bardzo dobrą nauczycielką, albo raczej wspaniałym pedagogiem.</li>
</ul>', 'Spójnik „albo” jest spójnikiem współrzędnym. Łączy on wypowiedzenia rozłączne lub części zdania oraz wyraża możliwą wymienność wypowiedzeń albo wyrazów. Nie umieszcza się przed nim przecinka: - Kupię samochód albo motor....', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "albo"', 'Spójnik „albo” jest spójnikiem współrzędnym. Łączy on wypowiedzenia rozłączne lub części zdania oraz wyraża możliwą wymienność wypowiedzeń albo wyrazów. Nie umieszcza się przed nim przecinka: - Kupię samochód albo motor....', true, '2011-07-20 14:17:17', '2025-12-11 18:12:00.941', '2025-12-11 18:12:00.941');
INSERT INTO public."Article" VALUES ('617d4e73-3f54-4c55-b55e-9eb74a75622b', 'Myślnik', 'funkcje-i-zastosowanie-myslnika', '<strong>Myślnik pełni różne funkcje w zdaniu, a jego użycie ma często charakter indywidualny, co oznacza, że może być zastąpiony przez inne znaki przestankowe. W przypadku, gdy myślnik jest użyty pojedynczo, wskazuje na przykład na pominięcie tekstu lub konieczność refleksji.</strong> Jeżeli natomiast myślnik w zdaniu użyje się podwójnie, to wydziela on wtrącone wstawki lub dodatkowe wyjaśnienia. Oto kilka funkcji myślnika w skrócie.<!--more-->
<h3>Funkcje myślnika</h3>
Myślnik stawia się  w celu uniknięcia powtórzenia wyrazu w obrębie tego samego zdania:
<ul>
	<li>- Dzisiaj wstałam o ósmej, wczoraj –  pół godziny szybciej.</li>
</ul>
<strong>Przed wyrażeniem lub zdaniem uogólniającym</strong> to, co zostało wcześniej wymienione szczegółowo:
<ul>
	<li>- Cukier, jabłka, banany, pomarańcze, mięso – wszystkie te produkty kupiłem dzisiaj w sklepie.</li>
	<li>- Płyty DVD, komputer, czytnik, monitor – te urządzenia dobrze zastępują telewizor.</li>
</ul>
<strong>Po rozwiniętych członach zdania</strong> lub po zdaniach w celu nawiązania do pierwotnej treści:
<ul>
	<li>- Jego strach wywołany snem, mogącym wstrząsnąć nawet najsilniejszymi ludźmi, a co dopiero mówić o małym chłopcu – przechodził stopniowo na wszystkich zgromadzonych.</li>
</ul>
<strong>W miejsce domyślnego słowa posiłkowego „być”</strong> - przed „to”, który wprowadza orzecznik:
<ul>
	<li>- Studia humanistyczne – to studia tak samo ważne, jak studia ścisłe.</li>
	<li>- Wiedza – to do potęgi klucz.</li>
</ul>
<strong>Przed członem nieoczekiwanym</strong>, zaskakującym czytelnika  w celu wywołania jego refleksji, zdziwienia itp.:
<ul>
	<li>- Opowiadaliśmy sobie straszne historie, gdy nagle – ktoś zapukał do drzwi.</li>
</ul>
<strong>Jako łącznik między liczebnikami oznaczającymi wartości przybliżone</strong> i między wyrazami o znaczeniu przeciwstawnym:
<ul>
	<li>- Musiał przejść jeszcze trzy-cztery schody.</li>
	<li>- Za  5-6 godzin przyjdzie Kamila.</li>
</ul>
<strong>Między wyrazami w zdaniu w celu uniknięcia dwuznaczności</strong>, jaka mogłaby w nim wystąpić bez znaku pauzy:
<ul>
	<li>- Zawodnicy wystartowali w najlepszy możliwy sposób – jak Adam Małysz.</li>
</ul>
<strong>W dwa myślniki, czyli otwierający i zamykający ujmuje się</strong> wyrazy lub zdania wtrącone:
<ul>
	<li>- Jej zdanie – szczerze powiedziawszy – nikogo nie obchodziło.</li>
	<li>- Zdobędę licencjat – myślę – jeszcze w tym miesiącu.</li>
	<li>- Tamten tramwaj – tamten nowy – nie jest wcale nowy, tylko tak wygląda po remoncie.</li>
</ul>
<strong>W dwa myślniki ujmuje się również wyrazy lub wypowiedzenia, które są wtrącone w cytowany tekst</strong>, oraz tekst odautorski w partiach dialogowych. Jeżeli człon odautorski kończy wypowiedzenie, to stawia się w zdaniu tylko jeden myślnik:
<ul>
	<li>- Jeżeli chodzi o pochodzenie umowy społecznej – jak pisze Włodzimierz Zamachowski – to pochodzi ona od Platona.</li>
</ul>
<strong>Pojedynczy myślnik umieszczać można na początku wypowiedzi</strong> w partiach dialogowych utworu artystycznego:
<ul>
	<li>―    Co ci jest? - spytał z okropnym przestrachem. I czuł, jak włosy zjeżają mu się na głowie, a mróz przechodzi przez kości.</li>
	<li>―    Co ci jest? Powiedz! - powtórzył.</li>
	<li>―    Ciemno! - szepnęła.</li>
	<li>―    Ciemno? Słonko świeci, a tobie ciemno? - zapytał zdyszanym głosem (H. Sienkiewicz - „Krzyżacy”)</li>
</ul>
<strong>Przed myślnikiem zawsze pomija się przecinek</strong>. Nie pomija się natomiast: kropki, pytajnika, wielokropka i wykrzyknika:
<ul>
	<li>- Obudź się! - wrzasnął Jarek. – Już wysiadamy!</li>
	<li>- Gdzie zostawiłam portfel – zastanawiała się Judyta.</li>
	<li>- A jak ktoś mi go ukradł – co ja zrobię?</li>
</ul>', 'Myślnik pełni różne funkcje w zdaniu, a jego użycie ma często charakter indywidualny, co oznacza, że może być zastąpiony przez inne znaki przestankowe. W przypadku, gdy myślnik jest użyty pojedynczo,...', 'cad45763-2945-4eda-bc1f-6dda56bbe2cb', 'Myślnik', 'Myślnik pełni różne funkcje w zdaniu, a jego użycie ma często charakter indywidualny, co oznacza, że może być zastąpiony przez inne znaki przestankowe. W przypadku, gdy myślnik jest użyty pojedynczo,...', true, '2011-07-20 07:09:54', '2025-12-11 18:12:00.96', '2025-12-11 18:12:00.96');
INSERT INTO public."Article" VALUES ('0589a0dd-ab4b-49b6-91e8-4e63f6c99c83', 'Przecinek przed "aczkolwiek"', 'przecinek-przed-aczkolwiek', 'Zdanie ze spójnikiem „aczkolwiek” oddziela się przecinek lub przecinkami:
<!--more-->
<ul>
	<li>- Zdał egzamin, aczkolwiek zaledwie na trójkę.</li>
	<li>- Jestem zadowolony z nowego samochodu, aczkolwiek myślę że sporo przepłaciłem.</li>
	<li>- W końcu przekonałem Marka do wzięcia się do pracy, aczkolwiek boje się, że jak tylko go skontroluję, to znajdę go z wódką pod pachą.</li>
</ul>
<strong>W momencie, gdy spójnik „aczkolwiek” pojawi się w zdaniu wraz z innymi spójnikami</strong>, takimi jak: ”ale”, „lecz” oraz „jednak”, to to obie części zdania złożonego oddziela się przecinkiem:
<ul>
	<li>- Aczkolwiek bardzo się staram, jednak nigdy nic mi nie wychodzi.</li>
	<li>- Aczkolwiek zwyciężyła zawody, to i tak znowu zrobiła to na „dopingu”.</li>
</ul>
', 'Zdanie ze spójnikiem „aczkolwiek” oddziela się przecinek lub przecinkami: - Zdał egzamin, aczkolwiek zaledwie na trójkę. - Jestem zadowolony z nowego samochodu, aczkolwiek myślę że sporo przepłaciłem. - W końcu...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "aczkolwiek"', 'Zdanie ze spójnikiem „aczkolwiek” oddziela się przecinek lub przecinkami: - Zdał egzamin, aczkolwiek zaledwie na trójkę. - Jestem zadowolony z nowego samochodu, aczkolwiek myślę że sporo przepłaciłem. - W końcu...', true, '2011-07-20 14:14:38', '2025-12-11 18:12:00.943', '2025-12-11 18:12:00.943');
INSERT INTO public."Article" VALUES ('7fd2b595-b73e-4732-b63a-ae93cfe58744', 'Przecinek przed "aby"', 'przecinek-przed-aby', '<strong>Spójnik „aby” wprowadza różne wypowiedzenia złożone podrzędnie. Występuje on na początku zdania złożonego lub po zdaniu nadrzędnym.</strong> Zawsze oddziela się części składowe takich zdań przecinkiem:
<!--more-->
<ul>
	<li>- Aby dostać się na studia, trzeba dobrze zdać maturę</li>
	<li>- Wstałem o 8 rano, aby zabrać się szybko do pracy.</li>
	<li>- Kot skoczył za myszą, aby się z nią pobawić.</li>
	<li>- Jutro mój pierwszy dzień w szkole, aby tylko było fajnie.</li>
</ul>
<strong>Spójnik „aby" może wystąpić w zdaniu też jako partykuła o znaczeniu ograniczającym</strong> albo na jego początku, albo w jego środku. Nie stawia się w takiej sytuacji przecinka w zdaniu:
<ul>
	<li>- Aby tylko dotrzeć do domu!</li>
	<li>- Po pożarze zostały aby meble i stajnia zniszczona, i chlew ledwo stojący.</li>
</ul>
<strong>W przypadku, kiedy „aby” oznacza tyle co zbyć (niedbale, byle jak), nie oddziela się go przecinkiem</strong>:
<ul>
	<li>- Robię to tylko po to aby zbyć.</li>
	<li>- Ta kobieta odpowiada mi tylko aby zbyć.</li>
</ul>
Podobne znaczenie do „aby” ma wyrażenie „aby-aby”, pisane z łącznikiem:
<ul>
	<li>- Jak się czujesz? - Jestem na aby-aby.</li>
</ul>
', 'Spójnik „aby” wprowadza różne wypowiedzenia złożone podrzędnie. Występuje on na początku zdania złożonego lub po zdaniu nadrzędnym. Zawsze oddziela się części składowe takich zdań przecinkiem: - Aby dostać się na...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "aby"', 'Spójnik „aby” wprowadza różne wypowiedzenia złożone podrzędnie. Występuje on na początku zdania złożonego lub po zdaniu nadrzędnym. Zawsze oddziela się części składowe takich zdań przecinkiem: - Aby dostać się na...', true, '2011-07-20 14:12:39', '2025-12-11 18:12:00.945', '2025-12-11 18:12:00.945');
INSERT INTO public."Article" VALUES ('2d46a3e2-30cb-4da8-abc9-8118c0f6a0c5', 'Przecinek przed "a"', 'przecinek-przed-a', '<strong>Spójnik „a” jest spójnikiem współrzędnym łączącym różne wypowiedzenia, takie jak: przeciwstawne, łączne, wynikowe i uzupełniające.</strong> W tego typu wypowiedzeniach złożonych ze spójnikiem „a” zawsze stawia się przecinek:
<!--more-->
<ul>
	<li>- Łukasz ma wspaniały, piękny rower, a jego kolega ma szybki samochód.</li>
	<li>- Raport miałeś przygotować na godzinę 15, a dopiero teraz mi go dajesz?</li>
	<li>- Pojadę na rowerze, a ty z racji tego, że bolą cię nogi, wsiądziesz do autobusu</li>
	<li>- „Solidarność” rozpoczęła kolejny strajk na kolei, a na jego czele stanął przewodniczący.</li>
</ul>
<strong>W utworach literackich można spotkać towarzyszące spójnikowi a</strong> także inne znaki interpunkcyjne, takie jak: myślnik, średnik oraz dwukropek:
<ul>
	<li>- Błyskawice, pochmurne niebo (…); a pod nimi – nadal rozpalony piasek.</li>
</ul>
<strong>Jeżeli spójnik „a” znajduje się w obrębie grupy wyrazów, to w wypowiedzeniu pojedynczym nie stawia się przecinka</strong>. Jeżeli natomiast spójnik „a” ma w takich konstrukcjach funkcję przeciwstawną, to stawia się w nich przecinek:
<ul>
	<li>- Chłop swoje, a baba swoje</li>
	<li>- Skowronek śpiewał cicho a łagodnie</li>
</ul>
<strong>Jeśli jednak spójnik „a” w funkcji łącznej wprowadza człon o charakterze dopowiedzenia lub wtrącenia</strong>, to stawia się wtedy przed nim przecinek:
<ul>
	<li>- Robię zakupy w Realu i Tesco, a rzadziej w Biedronce.</li>
	<li>- Testy oddały najpierw dziewczyny, a dopiero po nich chłopcy.</li>
</ul>
<strong>Spójnik „a” może też wystąpić w zdaniu w postaci partykuły nawiązującej i wzmacniającej</strong>, która odnosi się do całej wypowiedzi lub do jednego wyrazu. Taka funkcja tego spójnika pojawia się po różnych znakach interpunkcyjnych, takich jak: przecinek, myślnik i kropka:
<ul>
	<li>- Tak a tak.</li>
	<li>- Ten a ten.</li>
	<li>- Tyle a tyle.</li>
	<li>- Wcale a wcale.</li>
	<li>- Bardzo a bardzo.</li>
</ul>
<strong>W wypowiedzeniu może także pojawić się partykuła „a” nawiązująca i wzmacniająca</strong>, odnosząca się do całej wypowiedzi lub tylko do jednego wyrazu. Takie zastosowanie „a” pojawia się po różnych znakach interpunkcyjnych, takich jak: przecinek, myślnik i kropka:
<ul>
	<li>- A nie mówiłem, że znowu popełniłaś błąd?</li>
	<li>- Mój syn ciągle mnie pyta, a jak, a kiedy, a co, a gdzie, a po co, a dlaczego.</li>
</ul>
<strong>Spójnik „a” może też przybrać formę wykrzyknika</strong> wyróżniającego różne żywe stany uczuciowe. Stawia się w takiej sytuacji po nim znak wykrzyknienia lub przecinek:
<ul>
	<li>- A! Złapałem cię na gorącym uczynku!</li>
	<li>Aa, Złamałam nogę!</li>
</ul>
', 'Spójnik „a” jest spójnikiem współrzędnym łączącym różne wypowiedzenia, takie jak: przeciwstawne, łączne, wynikowe i uzupełniające. W tego typu wypowiedzeniach złożonych ze spójnikiem „a” zawsze stawia się przecinek: - Łukasz ma...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "a"', 'Spójnik „a” jest spójnikiem współrzędnym łączącym różne wypowiedzenia, takie jak: przeciwstawne, łączne, wynikowe i uzupełniające. W tego typu wypowiedzeniach złożonych ze spójnikiem „a” zawsze stawia się przecinek: - Łukasz ma...', true, '2011-07-20 14:10:07', '2025-12-11 18:12:00.947', '2025-12-11 18:12:00.947');
INSERT INTO public."Article" VALUES ('c7209133-c243-404a-a9d9-020aaf4e6a3f', 'Spacja w interpunkcji', 'spacja-w-interpunkcji', '<strong>Spacja ma kilka funkcji w zdaniach. Jej najważniejszą zadaniem jest zaznaczanie odstępu między wyrazami, literami, cyframi, symbolami i znakami graficznymi w tekście.</strong> Zasady stosowania lub niestosowania spacji w polskiej interpunkcji nie są jasno sprecyzowane.
<!--more-->
<h3>Spacja w oznaczeniach miar</h3>
Oznaczeniami miar mogą być zarówno skróty i skrótowce (m = metr, W = wat, A = amper, s = sekunda, min = minuta) oraz symbole lub połączenia skrótów z symbolami (° = stopień, % = procent) W przypadku oznaczeń miar stawia się ją między wartością liczbową a literowym oznaczeniem miary.
<h3>Spacja w zapisie dat</h3>
<ul>
	<li>- Pomija się ją przy cyfrach arabskich zakończonych kropką, zaznacza się ją natomiast przed skrótem r., który oznacza rok:  15.04.2006.</li>
	<li>- Stawia się ją po oznaczeniu dnia i miesiąca, jeśli miesiąc ten jest zapisany cyfrą rzymską: 18 XII 2011 r., 9 IV 1988, 04 VII 1504 r.</li>
	<li>- W przypadku tekstów odnoszących się do wydarzeń historycznych, które zawierają w sobie określenia: przed naszą erą, nowej ery, Anno Domini nie oddziela się ich spacją: A.D., n.e., p.n.e.</li>
</ul>
<h3>Spacja w zapisie skrótów i skrótowców</h3>
<ul>
	<li>- Nie stawia się jej po skrócie pierwszego wyrazu zapisywanego z kropką. Zasada ta dotyczy nazw zarówno wielowyrazowych rodzimych, jak i nazw pochodzenia obcego: sp.j. = spółka jawna, r.ub. = roku ubiegłego, p.o. = pełniący obowiązki, J.P. = inicjały Jan Przybylski, m.m. = mutatis mutandis, N.N. = nomen nescio, I.N.C. = in nomine Christi.</li>
	<li>- Nie stosuje się również spacji w skrótach i skrótowcach zapisywanych w języku angielskim: PAN = Polska Akademia Nauk, PZU = Powszechny Zakład Ubezpieczeń, MKOL = Między narodowy Komitet Olimpijski, PS = postcriptum.</li>
</ul>
', 'Spacja ma kilka funkcji w zdaniach. Jej najważniejszą zadaniem jest zaznaczanie odstępu między wyrazami, literami, cyframi, symbolami i znakami graficznymi w tekście. Zasady stosowania lub niestosowania spacji w polskiej interpunkcji...', 'cad45763-2945-4eda-bc1f-6dda56bbe2cb', 'Spacja w interpunkcji', 'Spacja ma kilka funkcji w zdaniach. Jej najważniejszą zadaniem jest zaznaczanie odstępu między wyrazami, literami, cyframi, symbolami i znakami graficznymi w tekście. Zasady stosowania lub niestosowania spacji w polskiej interpunkcji...', true, '2011-07-20 14:05:58', '2025-12-11 18:12:00.949', '2025-12-11 18:12:00.949');
INSERT INTO public."Article" VALUES ('22f6edd7-990d-4bc6-b7ed-0ecacb0ce016', 'Znaki nieliterowe', 'znaki-nieliterowe', '<strong> Do znaków nieliterowych zalicza się między innymi łącznik, który często jest mylony z myślnikiem.</strong> Różni się on od myślnika tym, że jest krótszy i łączy się ze znakiem literowym bezpośrednio, czyli bez spacji. W celu uniknięcia mieszania obu tych znaków, trzeba pamiętać o tym że:
<!--more-->
<h3>Myślnik</h3>
Znak międzywyrazowy i międzywypowiedzeniowy, który używa się wówczas, gdy występuje między członami samodzielnymi leksykalnie i składniowo. Nieregulowane jest przy tym zastosowanie spacji, która nie zawsze towarzyszy myślnikowi.
<h3>Półpauza</h3>
Półpauza służy do oddzielania wyrazów w tekście. Ma ona szerokość równą połowie litery M, myślnik – szerokość M, a łącznik - jednej czwartej litery M.
<h3>Łącznik</h3>
Łącznik jest znakiem wewnątrz wyrazowym, stosowanym w wyrazach pospolitych i nazwach własnych. Nazywany jest on też czasem dywizem. Łącznik spotyka się najczęściej w:
<ul>
	<li>- Złożeniach z członem liczebnikowym, w którym pierwszy człon zapisany został cyfrą, np.: 2-letni, 10-osobowy, 4-kołowy.</li>
	<li>- Wyrażeniach określających zakres liczbowy jakiejś wartości, np. I wojna światowa miała miejsce w latach 1914-1918.</li>
	<li>- Między cyframi numeru telefonicznego lub kodu pocztowego, np. 56-23-53. Toruń 87-100.</li>
	<li>- Jako znak urwanej części wyrazu, np. pięcio-, trzecio-. Dotyczy to także rzeczowników zakończonych na „-nie”, „-enie”, „-cie”.</li>
</ul>
<h3>Ukośnik</h3>
Ukośnik służy do zapisu wartości fizycznych oraz matematycznych, np. km/h, 2/4, 5/3. Używa się go także w zapisach adresów – ul. Purczybuta 13/15. Warto wiedzieć, że niepoprawne jest używanie ukośnika w taki oto sposób: Złotoria p/Toruniem, Myślęcinek k/Bydgoszczy. Poprawnie powinno się zapisać: Złotoria pod Toruniem, Myślęcinek k. Bydgoszczy.
<h3>Apostrof</h3>
Apostrof, zwany też czasem górnym przecinkiem, służy do oddzielania obcej nazwy od rodzimej końcówki, np. przylądek Kennedy''ego. Spotkać go też można między wyrazami, np. Miss Polonia ''94, Miss USA ''99.
<h3>Znaki graficzne</h3>
Do pozostałych znaków literowych należą:
<ul>
	<li>- Znaki matematyczne: plus „+, minus „-”, mnożenie „x”, dzielenie „:” lub kreska ułamkowa „/” równania „=”, części dziesiętne liczby „,”, procent „%”.</li>
	<li>- Tylda „~”, która oznacza opuszczenie części wyrazu, a w pewnych pisowniach jest znakiem diakrytycznym oznaczającym miękkość lub nosowość samogłoski</li>
	<li>- Kółeczko „°” będące znakiem wielofunkcyjnym. Oznaczać ono może znak stopnia lub stopnia a po cyfrze kolejny punkt wyliczenia.</li>
	<li>- Strzałki „→←” zaznaczają w skrócie kierunek relacji językowych.</li>
	<li>- Znak „and” (&) występuje w nazwach własnych, np. K & L Huglewscy. Pełni on tę samą funkcję, co polski łącznik „i”.</li>
	<li>- Małpa (@), która jest elementem adresu poczty elektronicznej.</li>
</ul>', 'Do znaków nieliterowych zalicza się między innymi łącznik, który często jest mylony z myślnikiem. Różni się on od myślnika tym, że jest krótszy i łączy się ze znakiem literowym bezpośrednio,...', 'cad45763-2945-4eda-bc1f-6dda56bbe2cb', 'Znaki nieliterowe', 'Do znaków nieliterowych zalicza się między innymi łącznik, który często jest mylony z myślnikiem. Różni się on od myślnika tym, że jest krótszy i łączy się ze znakiem literowym bezpośrednio,...', true, '2011-07-20 13:54:40', '2025-12-11 18:12:00.951', '2025-12-11 18:12:00.951');
INSERT INTO public."Article" VALUES ('6856d47a-4899-48a6-a3e4-03347b4a858e', 'Kropka w skrótach i skrótowcach', 'kropka-w-skrotach-i-skrotowcach', 'Kropka jest bardzo ważnym elementem skrótów i skrótowców. Istnieje kilka zasad odnośnie stawiania jej w takich konstrukcjach:
<!--more-->
<ul>
	<li><strong>- Stawia się kropkę po skrócie</strong>, który jest początkową literą lub początkowymi literami skróconego wyrazu poza jednostkami miar i wag oraz rodzimymi jednostkami monetarnymi.</li>
</ul>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="170">
<p align="center">a. = albo</p>
</td>
<td valign="top" width="214">
<p align="center">hr. = hrabia</p>
</td>
<td valign="top" width="148">
<p align="center">hon. = honorowy</p>
</td>
</tr>
<tr>
<td valign="top" width="170">
<p align="center">ob. = obywatel</p>
</td>
<td valign="top" width="214">
<p align="center">tow. = towarzysz</p>
</td>
<td valign="top" width="148">
<p align="center">przyp. = przypis</p>
</td>
</tr>
</tbody>
</table>
<ul>
	<li>- <strong>Stawia się kropkę na końcu skrótu polskiej nazwy wielowyrazowej</strong>, jeśli drugi wyraz zaczyna się od spółgłoski.</li>
</ul>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="171">
<p align="center">cdn. = ciąg dalszy nastąpi</p>
</td>
<td valign="top" width="214">
<p align="center">błp. = błogosławionej pamięci</p>
</td>
<td valign="top" width="148">
<p align="center">lm. = liczba mnoga</p>
</td>
</tr>
<tr>
<td valign="top" width="171">
<p align="center">tzw. = tak zwany</p>
</td>
<td valign="top" width="214">
<p align="center">śp. = świętej pamięci</p>
</td>
<td valign="top" width="148">
<p align="center">np. = na przykład</p>
</td>
</tr>
</tbody>
</table>
<ul>
	<li><strong>- W przypadku, gdy w nazwie wielowyrazowej drugi wyraz rozpoczyna się zaś od samogłoski</strong>, to jej skrót ma kropkę po skrócie każdego słowa.</li>
</ul>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="172">
<p align="center">m.in. = między innymi</p>
</td>
<td valign="top" width="214">
<p align="center">n.e. = naszej ery</p>
</td>
<td valign="top" width="147">
<p align="center">p.o. = pełniący obowiązki</p>
</td>
</tr>
<tr>
<td valign="top" width="172">
<p align="center">b.u. = bez uwag</p>
</td>
<td valign="top" width="214">
<p align="center">c.o. = centralne ogrzewanie</p>
</td>
<td valign="top" width="147">
<p align="center">o.o = ograniczona odpowiedzialność</p>
</td>
</tr>
</tbody>
</table>
<ul>
	<li>- W taki sam sposób pisze się nazwy wielowyrazowe obcego pochodzenia.</li>
</ul>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="172">
<p align="center">l.c. = loco ciato (w miejscu cytowanym</p>
</td>
<td valign="top" width="214">
<p align="center">m.m. = mutatis mutandis (zmieniając, to co powinno być zmienione)</p>
</td>
<td valign="top" width="146">
<p align="center">a.i. = ad interim (tymczasowo/zastępczo)</p>
</td>
</tr>
</tbody>
</table>
<ul>
	<li>- Należy postawić ją po skrótach obcych jednostek monetarnych.</li>
</ul>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="258">
<p align="center">dol. = dolar</p>
</td>
<td valign="top" width="274">
<p align="center">kor. = korona</p>
</td>
</tr>
</tbody>
</table>
<ul>
	<li>- Nie stawia się po skrótach jednostek miar i wag oraz rodzimych jednostek monetarnych.</li>
</ul>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="280">
<p align="center">ha = hektar</p>
</td>
<td valign="top" width="253">
<p align="center">dag = dekagram</p>
</td>
</tr>
<tr>
<td valign="top" width="280">
<p align="center">zł = złoty</p>
</td>
<td valign="top" width="253">
<p align="center">gr = grosz</p>
</td>
</tr>
</tbody>
</table>
<ul>
	<li>- Nie należy stawiać kropki po skrótach z początkiem i końcem wyrazu skróconego.</li>
</ul>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="280">
<p align="center">płk = pułkownik</p>
</td>
<td valign="top" width="254">
<p align="center">mgr = magister</p>
</td>
</tr>
</tbody>
</table>
<ul>
	<li><strong>- Nie stawia się po następujących skrótowcach</strong>: „PAN”, „BUW”, „MON”, „UW”, „URM”, „HIV”, „ONZ”, „PKO”, „USA”, „MSW”, „AIDS”, „PKP”, „RP”.</li>
	<li>- Nie wolno stawiać kropki po skrótach stosowanych w matematyce i fizyce.</li>
</ul>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="197">
<p align="center">cos = cosinus</p>
</td>
<td valign="top" width="211">
<p align="center">t = czas</p>
</td>
<td valign="top" width="186">
<p align="center">cosec = cosecans</p>
</td>
</tr>
<tr>
<td valign="top" width="197">
<p align="center">A = amper</p>
</td>
<td valign="top" width="211">
<p align="center">sin = sinus</p>
</td>
<td valign="top" width="186">
<p align="center">s = droga</p>
</td>
</tr>
<tr>
<td valign="top" width="197">
<p align="center">C = Celsjusz</p>
</td>
<td valign="top" width="211">
<p align="center">R = rentgen</p>
</td>
<td valign="top" width="186">
<p align="center">F =  Farenheit</p>
</td>
</tr>
</tbody>
</table>
<ul>
	<li>- Jedną kropką łączy się skróty podwojone:</li>
</ul>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="293">
<p align="center">pp. = państwo</p>
</td>
<td valign="top" width="302">
<p align="center">ss. = siostry, np. Elżbietanki</p>
</td>
</tr>
</tbody>
</table>
<ul>
	<li>- Wieloliterowe skróty powtarza się z zastosowaniem obu kropek lub bez nich:</li>
</ul>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="198">
<p align="center">ob.ob. = obywatele</p>
</td>
<td valign="top" width="211">
<p align="center">bp bp = biskupi</p>
</td>
<td valign="top" width="186">
<p align="center">dr dr = doktorzy</p>
</td>
</tr>
</tbody>
</table>
<ul>
	<li>- W skrótach i skrótowcach odgrywa ona nieocenioną rolę. Jej brak lub obecność decyduje o innym znaczeniu skrótu:</li>
</ul>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="198">
<p align="center">at = atmosfera techniczna</p>
<p align="center">a.t = łac. a tergo, czyli od tyłu</p>
</td>
<td valign="top" width="211">
<p align="center">br = bieżącego roku</p>
<p align="center">b.r. = bez roku</p>
</td>
<td valign="top" width="186">
<p align="center">ie. = indoeuropejski</p>
<p align="center">i.e. = łac. id est, czyli to znaczy</p>
</td>
</tr>
</tbody>
</table>
<ul>
	<li>- <strong>Nie ma ona jednak tak dużego znaczenia w skrótach wieloznacznych</strong> – czyli takich, które nawet pisane tak samo mogą oznaczać zupełnie coś innego:</li>
</ul>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="197">
<p align="center">a = łac. area, czyli miara</p>
<p align="center">a = fr. avancez, czyli przyspieszcie</p>
</td>
<td valign="top" width="211">
<p align="center">s. = strona</p>
<p align="center">s. = łac. sanctus</p>
</td>
<td valign="top" width="186">
<p align="center">j. = jednostkamij.</p>
<p align="center">j.= jezioro</p>
</td>
</tr>
<tr>
<td valign="top" width="197">
<p align="center">pl. = plac</p>
<p align="center">pl. = plansza</p>
</td>
<td valign="top" width="211">
<p align="center">k.o. = kulturalno- oświatowy</p>
<p align="center">k.o = ang. knock-out.</p>
</td>
<td valign="top" width="186">
<p align="center">r. = rok</p>
<p align="center">r. = rodzaj</p>
</td>
</tr>
</tbody>
</table>
Jednakże jej wstawienie bądź nie po skrócie wskazywać może na formę i znaczenie wyrazu oraz decydować nawet o płci osoby:
<ul>
	<li>- Kontrola u dr Zupy (kobiety)</li>
	<li>Kontrola u dr. Zupy (mężczyzny).</li>
</ul>
<strong>Pisownia interpunkcyjna w przypadku skrótów jest niestety niejasna</strong>. Często napotkać można skróty pisane według dawnych i nowych zasad, skróty polskie oraz pochodzące także z innych języków. Skróty pochodzące z języka łacińskiego są pisane wielką literą i stawia się po nich kropkę:
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="198">
<p align="center">P.T. = łac. pleno titulo</p>
</td>
<td valign="top" width="211">
<p align="center">N.N. = ktoś nie znany</p>
</td>
<td valign="top" width="186">
<p align="center">S.A. = spółka akcyjna</p>
</td>
</tr>
</tbody>
</table>
Po skrótach ksiąg biblijnych, które pochodzą od imion własnych nie stawia się:
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="294">
<p align="center">Ag = Księga Aggeusza</p>
</td>
<td valign="top" width="302">
<p align="center">Am = Księga Amosza</p>
</td>
</tr>
</tbody>
</table>
W różnych tekstach można się spotkać też ze skrótami o nietypowej pisowni – połączonych małymi i wielkimi literami, z łącznikiem, z ukośną kreską lub z dodatkowym znaczkiem:
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="195">
<p align="center">Khz = kiloherc</p>
</td>
<td valign="top" width="214">
<p align="center">C = symbol stopnia temperatury</p>
</td>
<td valign="top" width="186">
<p align="center">D-ca = dowódca</p>
</td>
</tr>
</tbody>
</table>
Problemowa jest sytuacja, gdy ten sam skrót jest pisany w różnych źródłach na różne sposoby:
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top" width="198">
<p align="center">PS lub P.S. = post scriptum</p>
</td>
<td valign="top" width="211">
<p align="center">k.k. lub kk = kodeks karny</p>
</td>
<td valign="top" width="186">
<p align="center">p.m lub P.M. = łac. post morten</p>
</td>
</tr>
</tbody>
</table>
<strong>Warto pamiętać, że kropka skrótu użytego na końcu zdania kończy wypowiedzenie</strong>. Dotyczy to takich skrótów, jak: „itd”, „itp”, „etc”. Należy więc nie umieszczać na końcu zdania skrótu napisanego bez niej, bo może to wprowadzić czytelnika w błąd.
<h2>Kropka po</h2>
Stawia się ją także po:
<ul>
	<li>- Inicjałach: K. M., Ł.D., F.G., E. B.</li>
	<li>- Po liczbie lub literze wprowadzających części składowe wyliczenia.</li>
	<li>- W tytułach: 
a) tytuły książek i czasopism pisze się na karcie tytułowej bez końcowej kropki:
◦    Monika Zalewska Logika w praktyce Wydawnictwo Naukowe Semafor Toruń 1999.
b) <strong>Po tytule utworu, czyli po tytule rozdziału, ustępu, paragrafu</strong>, można ją postawić (choć niekoniecznie), jeżeli początek tego tytułu jest rozpoczęty wielką literą:</li>
	<li>- Konsekwencje psychiczne traumy</li>
	<li>- Konsekwencje psychiczne traumy.</li>
</ul>
Należy ją pominąć, jeżeli  w takich tytułach <strong>nie odróżnia się małych i wielkich liter</strong>:
<ul>
	<li>- KONSEKWENCJE PSYCHICZNE TRAUMY</li>
	<li>- uwarunkowania i terapia</li>
</ul>
4) <strong>Po tytułach artykułów w gazetach i czasopismach</strong> nie stawia się:
<ul>
	<li>- Biegnąc po słońce</li>
	<li>- Wypadek na Siódemce</li>
	<li>- Ulewny Londyn</li>
</ul>
5) <strong>Nie stawia się po tytule, imieniu i nazwisku w podpisach</strong>, na wizytówkach i wywieszkach:
<ul>
	<li>- profesor Andrzej Przybylski</li>
	<li>- Wrocław, ul. Mazowiecka 7</li>
</ul>
6) <strong>Nie stawia się kropki również po napisach o charakterze hasłowym</strong>, na afiszach i transparentach oraz po napisach na szyldach:
<ul>
	<li>- Żądamy lepszej obsługi w sklepach</li>
</ul>
', 'Kropka jest bardzo ważnym elementem skrótów i skrótowców. Istnieje kilka zasad odnośnie stawiania jej w takich konstrukcjach: - Stawia się kropkę po skrócie, który jest początkową literą lub początkowymi literami...', 'cad45763-2945-4eda-bc1f-6dda56bbe2cb', 'Kropka w skrótach i skrótowcach', 'Kropka jest bardzo ważnym elementem skrótów i skrótowców. Istnieje kilka zasad odnośnie stawiania jej w takich konstrukcjach: - Stawia się kropkę po skrócie, który jest początkową literą lub początkowymi literami...', true, '2011-07-20 07:40:09', '2025-12-11 18:12:00.954', '2025-12-11 18:12:00.954');
INSERT INTO public."Article" VALUES ('185fd15a-2cdd-42f9-8d48-ea38b3e86d5b', 'Nawias', 'nawias', 'Nawias składa się z dwóch części – znaku otwarcia i zamknięcia. W polskim systemie interpunkcyjnym znaleźć można kilka jego rodzajów:
<!--more-->
<ul>
	<li>- okrągły (), który używany jest najczęściej;</li>
	<li>- kwadratowy [];</li>
	<li>prosty / / stosowany w piśmie maszynowym i zapisach specjalistycznych;</li>
	<li>ostrokątny &lt; &gt; i klamrowy {} - zarezerwowane tylko dla tekstów specjalnych.</li>
</ul>
<strong>Główną jego funkcją jest graficzne wyodrębnianie tekstu o charakterze pobocznym</strong>, drugoplanowym, uzupełniający oraz objaśniającym – w stosunku do tekstu głównego. Nawias wyodrębnia także wtrącenia i przykłady:
<ul>
	<li>- Pojedziemy po zakupy później (najpierw musimy iść wybrać pieniądze z bankomatu).</li>
	<li>- Jutro dostanę (tak twierdzi mój tata) wspaniałe, nowe auto.</li>
	<li>- W ciągu trzech ostatnich lat (jak wynika z badań instytutu) wzrosło spożycie alkoholu przez młodzież o 3%.</li>
	<li>- Tabliczki umieszczone w autobusach zachęcają do kasowania biletów (jednak nie wspominają o tym, gdzie je kupić).</li>
	<li>- Henryk Sienkiewicz  (1846-1916) urodził się w Woli Okrzejskiej.</li>
	<li>- Tamten pan strasznie na mnie nakrzyczał w jakimś dziwnym języku (mogę się tylko domyślać, o co mu chodziło, bo nie zrozumiałem ani słowa z tego, co mówił).</li>
</ul>
<h3>Nawias okrągły</h3>
Okrągły nawias zamykający – tylko znak zamknięcia – wstawia się po liczbach i literach, które są składnikami wyliczenia:
<ul>
	<li>- Spójniki w zdaniach mają kilka funkcji – a) oddzielają zdania w wypowiedzeniu złożonym b) łączą zdania w wypowiedzeniu złożonym.</li>
	<li>- Studia na Uniwersytecie można podzielić na dwie grupy: a) ścisłe (matematyka, fizyka, fizyka techniczna, informatyka stosowana, informatyka) oraz b) humanistyczne (socjologia, politologia, polityka społeczna, dziennikarstwo, kognitywistyka, filozofia).</li>
</ul>
<h3>Nawias kwadratowy</h3>
W nawiasie kwadratowym umieszcza się:
<ul>
	<li>- Wstawki odautorskie w cytatach.</li>
	<li>- Skróty i objaśnienia w cytatach:</li>
</ul>
np. Zdanie złożone (nadrzędnie lub podrzędnie) składa się z co najmniej dwóch orzeczeń.
<ul>
	<li>- Zapis fonetyczny wyrazów:</li>
</ul>
np. [pszypadek] to zapis wymowy wyrazu przypadek.
<strong>Do zapisu danych bibliograficznych, cytatu albo źródła, na które powołujemy się w tekście, używa się nawiasów okrągłych lub kwadratowych</strong>:
<ul>
	<li>- Dewiację definiuje się jako „zachowanie postrzegane przez większość członków danej grupy społecznej czy społeczeństwa jako sprzeczne z obowiązującym systemem norm, wartości i oczekiwań społecznych; zachowanie przekraczające granice tolerancji” (Pawlica 2001).</li>
	<li>- Biblijna historia o Sodomie i Gomorze [Księga Rodzaju, rozdz. 19,1-29].</li>
</ul>
W przypadku, gdy kwadratowy i okrągły są zastosowane w tym samym fragmencie tekstu, to <strong>pierwszy z nich ujmuje treści szersze, a drugi węższe</strong>:
<ul>
	<li>- W książce „Trudne sztuki konfrontacji” można znaleźć praktyczne wskazówki ułatwiające radzenie sobie ludzi ze złamanymi obietnicami [jednak sposoby rozpoczynania takich rozmów (m.in. przez odpowiednie rozpoczęcie negocjacji) znajdują się w poprzedniczce tej książki o tytule „Trudne sztuki negocjacji”].</li>
</ul>
Niestety <strong>używanie nawiasów w nawiasie może utrudniać zrozumienie sensu zdania</strong>, dlatego należy unikać takiego postępowania.
', 'Nawias składa się z dwóch części – znaku otwarcia i zamknięcia. W polskim systemie interpunkcyjnym znaleźć można kilka jego rodzajów: - okrągły (), który używany jest najczęściej; - kwadratowy [];...', 'cad45763-2945-4eda-bc1f-6dda56bbe2cb', 'Nawias', 'Nawias składa się z dwóch części – znaku otwarcia i zamknięcia. W polskim systemie interpunkcyjnym znaleźć można kilka jego rodzajów: - okrągły (), który używany jest najczęściej; - kwadratowy [];...', true, '2011-07-20 07:33:00', '2025-12-11 18:12:00.956', '2025-12-11 18:12:00.956');
INSERT INTO public."Article" VALUES ('ca9b9f7f-8a34-46e9-81e4-016d1463ecda', 'Cudzysłów', 'cudzyslow-funkcje-i-zastosowania', 'Cudzysłów to znak graficzny składający się z dwóch części: pierwszej otwierającej i drugiej zamykającej. W pisowni polskiej można spotkać trzy rodzaje cudzysłowów: „”, &lt;&lt;&gt;&gt; lub &gt;&gt;&lt;&lt;. Najczęściej stosowany jest oczywiście ten pierwszy. Ponadto można też spotkać dwa znaki umieszczone u góry:'' '' lub ` `, których zadaniem jest wyróżnienie w tekście definicji znaczeniowych wyrazu.
<!--more-->
<h3>Cudzysłów służy do:</h3>
<ul>
	<li>- Wyodrębniania w tekście przytoczonych wyrazów, cudzych słów, fragmentów utworów, tytułów dzieł lub ich części.</li>
	<li>- Wyodrębniania wyrazów i zwrotów użytych w znaczeniu innym niż znaczenie podstawowe.</li>
</ul>
<strong>Najważniejszą jego funkcją jest funkcja cytowania</strong>:
<ul>
	<li>- W 2000 roku ukazała się książka pt. „Harry Potter i komnata tajemnic”, która opowiada o przygodach czarodzieja.</li>
	<li>- Wyraz „szczegółowy” powinno się zastąpić zwrotami „szczególnie istotny”.</li>
	<li>- „Twój grosz, to dla nas miliony” - to hasło fundacji zbierającej pieniądze dla potrzebujących w akcji charytatywnej „Góra grosza”.</li>
</ul>
W pierwszym zdaniu w <strong>cudzysłów został wzięty tytuł publikacji</strong> – książki; w drugim zacytowano wyrazy i wyrażenia, a w trzecim wyodrębnia on przytoczone hasło. Należy pamiętać, że jeśli przytoczony wyraz lub grupa wyrazowa występują na końcu zdania, to kropkę umieszcza się zawsze po cudzysłowie. W przypadku pytajnika jest nieco inaczej. <strong>Pytajnik należy postawić po cudzysłowie</strong>, gdy odnosi się do całego wypowiedzenia, a przed nim, gdy znak zapytania odnosi się tylko do cytowanej grupy wyrazowej.
<strong>Wyrazy nie będące częścią składową cytatu należy wydzielić myślnikami</strong> z użyciem jednego tylko cudzysłowu. Inną możliwością jest podzielenie ich przecinkami, ale obie części cytatu należy ująć wówczas w samodzielne cudzysłowy:
<ul>
	<li>- „Zeszłego lata – mówi Aneta – spędziliśmy wspaniałe wakacje nad morzem”.</li>
	<li>- „Zeszłego lata” – mówi Aneta – „spędziliśmy wspaniałe wakacje nad morzem”.</li>
</ul>
<strong>W przypadku, gdy druga część cytatu stanowi samodzielne zdanie, wyrazy nienależące do cytatu wyodrębnia się na początku pauzą, a na końcu – kropką: </strong>
<ul>
	<li>„Drodzy obywatele” - przemówił prezydent. „Myślę, że w tym roku uda nam się więcej zmienić w naszym pięknym mieście”.</li>
</ul>
<strong>Możliwe jest cytowanie wyrazów lub tytułów dzieł bez umieszczania ich w cudzysłowie</strong>, jeżeli występują one po dwukropku, a w druku są wyróżnione inną czcionką:
<ul>
	<li>- Marcelina przeczytała z dużym zawzięciem <em>Krzyżaków</em> Henryka Sienkiewicza.</li>
</ul>
<strong>Wiele różnych zjawisk może zajść, gdy cudzysłowie używa się ze względów znaczeniowo-stylistycznych</strong>:
<ul>
	<li>- Paulina kupiła telewizor marki „Sony”.</li>
	<li>- Spółki „PKP intercity” i „PKP przewozy regionalne” nie są zarządzane przez te same spółki.</li>
	<li>- Nazywali go „plastuś”, bo stale mazał się w plastelinie.</li>
</ul>
Co ważne, <strong>cudzysłów można opuścić w przypadku nazw modeli, typów, gatunków oraz wytworów przemysłowych</strong>. Pomimo że ze względów znaczeniowo-stylistycznych pozostawia się piszącemu znaczną swobodę, to trzeba pamiętać, iż nie należy go nadużywać. Nie ma sensu brania w niego wyrazów o funkcji przenośnej, niepoprawnych oraz grup wyrazów będących związkami frazeologicznymi.
<strong>Interesujące jest zjawisko cudzysłowu w cudzysłowie</strong>, gdzie główny cudzysłów składa się z dwóch apostrofów, a w środku zdania znajduje się tak zwany cudzysłów ostrokątny:
<ul>
	<li>- prof. Dawid Zamachowski twierdzi, że „powiedzenie &lt;&lt;gdzie dwóch się bije, tam trzeci korzysta&gt;&gt;, jest jak najbardziej aktualne”.</li>
</ul>
', 'Cudzysłów to znak graficzny składający się z dwóch części: pierwszej otwierającej i drugiej zamykającej. W pisowni polskiej można spotkać trzy rodzaje cudzysłowów: „”, &lt;&lt;&gt;&gt; lub &gt;&gt;&lt;&lt;. Najczęściej stosowany jest oczywiście...', 'cad45763-2945-4eda-bc1f-6dda56bbe2cb', 'Cudzysłów', 'Cudzysłów to znak graficzny składający się z dwóch części: pierwszej otwierającej i drugiej zamykającej. W pisowni polskiej można spotkać trzy rodzaje cudzysłowów: „”, &lt;&lt;&gt;&gt; lub &gt;&gt;&lt;&lt;. Najczęściej stosowany jest oczywiście...', true, '2011-07-20 07:21:58', '2025-12-11 18:12:00.958', '2025-12-11 18:12:00.958');
INSERT INTO public."Article" VALUES ('d3e1bf54-3f84-4170-aaee-8e6d60297141', 'Przecinek w zdaniu pojedynczym', 'przecinek-w-zdaniu-pojedynczym', 'W wypowiedzeniach pojedynczych stosuje się takie znaki interpunkcyjne jak: przecinek, dwukropek, myślnik, nawias, średnik. Oczywiście zamyka takie wypowiedzenia kropka, która pojawić się też może po skrótach i po liczebnikach porządkowych.<!--more--> Zdania proste są krótkie i nierozwinięte, składają się zawsze z podmiotu i orzeczenia oraz dodatkowo z dopełnienia, okolicznika lub przydawki zwanych częściami zdania:
<ul>
	<li>- Gosia biega (podmiot + orzeczenie).</li>
	<li>- Gosia biega po bieżni (podmiot + orzeczenie + okolicznik).</li>
	<li>- Nasza Gosia biega po bieżni (przydawka + podmiot + orzeczenie + okolicznik).</li>
	<li>- Wysoka Gosia rzuca na zawodach oszczepem (przydawka + podmiot + orzeczenie + okolicznik + dopełnienie).</li>
</ul>
<h3>Szereg, wyliczenie</h3>
Części zdania mogą stworzyć tak zwany szereg, czyli połączenie dwóch lub więcej przydawek, podmiotów, okoliczników lub dopełnień, zwane również wyliczaniem. Przecinek stawia się przed połączonymi bezspójnikowo jednorodnymi członami szeregu podmiotów, orzeczników, dopełnień, przydawek lub okoliczników:
<ul>
	<li>- W pokoju znajdują się: krzesło, lampa, fotel (szereg składający się z trzech podmiotów).</li>
	<li>- Zawsze marzyłam o przystojnym, dobrym, energicznym mężu (szereg składający się z trzech przydawek).</li>
	<li>- Szybka, mądra, przebiegła Gosia nie dotarła do mety (szereg składający się z trzech przydawek).</li>
</ul>
<h3>Przydawka</h3>
W przypadku grup przydawek należy pamiętać, że nie oddziela się przecinkiem przydawek nierównorzędnych, czyli takich, z których pierwsza określa połączenie składające się z drugiej przydawki i określanego rzeczownika:
<ul>
	<li>- Współcześni polscy malarze są niedoceniani w wielkim świecie sztuki.</li>
</ul>
Między składnikami tego zdania zachodzą inne stosunki syntaktyczne niż w przypadku zdania z przydawkami równorzędnymi. Przecinek stawia się z kolei między składnikami powtórzonymi zdania, na przykład między dwoma przydawkami:
<ul>
	<li>- Czytała z zaciekawieniem długo, bardzo długo.</li>
	<li>- W Paryżu można zobaczyć wielką, monumentalną Wieżę Eiffla.</li>
</ul>
<h3>Wykrzykniki</h3>
Tylko w przypadku powtórzonych wykrzykników można pominąć przecinek, ze względu na tempo recytacji zdań:
<ul>
	<li>- Ho ho, Wesołych świąt!</li>
	<li>- No no no, na przyjęciu pamiętaj zachowywać się ładnie!</li>
</ul>
<h3>Rzeczownik i narzędnik</h3>
Szczególny przypadek stanowią wypowiedzenia pojedyncze złożone z rzeczownika i narzędnika: nazwiska, imienia, rodu itd. Oddziela się je przecinkiem:
<ul>
	<li>- Do mety dobiegła starszawa Pani, imieniem Gosia.</li>
	<li>- Łowca, rodem z Polski, upolował wielkiego dzika.</li>
	<li>- Menadżerem firmy został licencjonowany socjolog, nazwiskiem Leszczyński.</li>
</ul>
<h3>Zdania połączone spójnikowo</h3>
Przecinek w zdaniach połączonych spójnikowo stawia się podobnie jak w spójnikowych wypowiedzeniach złożonych współrzędnie. Nie należy go jednak stawiać przed następującymi spójnikami łącznymi, rozłącznymi i wyłączającymi: „i”, „oraz”, „tudzież”, „a”, „lub”, „albo”, „bądź”, „czy”, „ani”, „ni”:
<ul>
	<li>- Pojadę do cioci i do wujka.</li>
	<li>- Kupiłem warzywa oraz owoce.</li>
	<li>- Spotkałem ją pomiędzy kinem a teatrem.</li>
	<li>- Nie kupię herbaty ani kawy.</li>
	<li>- Zgubiłem klucze pomiędzy schodami a drzwiami.</li>
	<li>- Na egzaminie powiodło się Gosi tudzież Adamowi.</li>
</ul>
<h3>Zdania ze spójnikiem „a”</h3>
Nie należy również stawiać przecinka w wyrażeniach ze spójnikiem „a” mających charakter frazeologizmów: „to a to”, „ten a ten”, „tyle a tyle”, „tam a tam”, chyba że owe spójniki są w wyrażeniu powtórzone, to w takim wypadku stawia się przecinek przed drugim oraz ewentualnie kolejnym członem:
<ul>
	<li>- Flirtował i z Gosią, i z Anetą, i z Natalią.</li>
	<li>- Nie lubi ani muzyki klasycznej, ani rockowej.</li>
	<li>- Latem odwiedzimy bądź Toruń, bądź Włocławek.</li>
</ul>
<h3>Zdania ze spójnikami przeciwstawnymi, wynikowymi i synonimicznymi</h3>
W zdaniach pojedynczych stawia się przecinek tylko przed spójnikami przeciwstawnymi, wynikowymi i synonimicznymi: „ale”, „lecz”, „a” (w funkcji przeciwstawnej), „więc”, „toteż”, „zatem”, „czyli”, „to jest”, „to znaczy”, „mianowicie”:
<ul>
	<li>- Postanowiliśmy przyjechać szybciej, czyli o 5 rano.</li>
	<li>- Poszłam do sklepu za wcześnie, więc był jeszcze zamknięty.</li>
	<li>- Do egzaminu trzeba uczyć się solidnie, a nie byle jak.</li>
</ul>
<h3>Porównania</h3>
Porównania to połączenie niesamodzielnego wyrazu porównawczego „jak”, „jakby”, „jako”, „niby”, „ni to”, „niż”, „niczym” z innym wyrazem samodzielnym lub wyrażeniem przyimkowym, które nazywają treść porównywalną. Przed słowem porównującym nie stawia się przecinka:
<ul>
	<li>- Jesteś zdrowy jak koń.</li>
	<li>- Masz takie oceny jak każdy.</li>
	<li>- Gosia biega szybciej niż Andrzej.</li>
	<li>- Potraktowałaś go niczym żebraka.</li>
</ul>
Człon porównawczy należy jednak podzielić przecinkiem, jeśli ma on charakter zwrotu wtrąconego lub dopowiedzenia:
<ul>
	<li>- Dzisiaj, tak samo jak wczoraj, mam zajęcia do późnego wieczora.</li>
</ul>
Przecinek stawia się też w porównaniach paralelnych, zawierającymi spójniki: „zarówno – jak i”, „tak – jak”, „równie – jak”:
<ul>
	<li>- 10 punktów na egzaminie otrzymała zarówno Gosia, jak i Emila.</li>
	<li>- W strukturze społecznej liczy się zarówno klasa średnia, jak i niższa.</li>
	<li>- Kocham tak samo Ciebie jak Twojego brata.</li>
</ul>
<h3>Dopowiedzenia</h3>
W przypadku dopowiedzeń, będących wyrazami i ich połączeniem, wyrażeniami przyimkowymi lub rozwiniętymi imiesłowami, zawsze stawia się przecinek w wypowiedzeniu pojedynczym, aby dopowiedzenia te były interpunkcyjnie wyodrębnione:
<ul>
	<li>- Na służbie pojawił się nowy oficer, wysoki i umięśniony.</li>
	<li>- W Warszawie znajduje się wielka statua, czy raczej pomnik Józefa Piłsudskiego.</li>
	<li>- Lubi pływać, szczególnie stylem klasycznym i delfinem.</li>
	<li>- W przyszłym tygodniu jadę do Szczecina, we wtorek rano.</li>
</ul>

<h3>Imiona, nazwiska, tytuły, adresy zamieszkania</h3>
Oddziela się natomiast przecinkiem poszczególne człony wyliczenia wskazującego na miejsce zamieszkania:
<ul>
	<li>- Władysław Kowalski, Bydgoszcz, ul. Mikołaja Reja 23, 5. piętro.</li>
</ul>
Jeżeli takie wyliczenie nie kończy zdania, to stawia się przecinek po ostatnim członie wyliczenia:
<ul>
	<li>- Ewa, Halina Lewandowska, Konin, Nowy rynek 20, została przyjęta na Uniwersytet Trzeciego Wieku.</li>
</ul>
Nie oddziela się przecinkiem imion i tytułów stojących przed nazwiskiem:
<ul>
	<li>- Prof. dr hab. Jan Kowalski.</li>
</ul>
Jeżeli jednak po imieniu i nazwisku lub po samym nazwisku występuje w zdaniu przydawka rozwinięta, to wydziela się ją dwoma przecinkami:
<ul>
	<li>- Mikołaj Kopernik, wynalazca teorii heliocentrycznej, urodził się w Toruniu.</li>
</ul>
Może się zdarzyć, że imię i nazwisko w zdaniu wystąpią na drugim miejscu, czyli po przydawce. W tej sytuacji oba przecinki są fakultatywne – można je umieścić lub nie:
<ul>
	<li>- Wynalazca teorii heliocentrycznej Mikołaj Kopernik, urodził się w Toruniu.</li>
<li>- Wynalazca teorii heliocentrycznej, Mikołaj Kopernik urodził się w Toruniu.
</ul>
', 'W wypowiedzeniach pojedynczych stosuje się takie znaki interpunkcyjne jak: przecinek, dwukropek, myślnik, nawias, średnik. Oczywiście zamyka takie wypowiedzenia kropka, która pojawić się też może po skrótach i po liczebnikach porządkowych....', 'cad45763-2945-4eda-bc1f-6dda56bbe2cb', 'Przecinek w zdaniu pojedynczym', 'W wypowiedzeniach pojedynczych stosuje się takie znaki interpunkcyjne jak: przecinek, dwukropek, myślnik, nawias, średnik. Oczywiście zamyka takie wypowiedzenia kropka, która pojawić się też może po skrótach i po liczebnikach porządkowych....', true, '2011-07-20 06:54:08', '2025-12-11 18:12:00.961', '2025-12-11 18:12:00.961');
INSERT INTO public."Article" VALUES ('2f369f42-6ab9-4097-8a40-aa7b732fefd5', 'Ogólne zasady interpunkcji w zdaniu złożonym', 'ogolne-zasady-interpunkcji-w-zdaniu-zlozonym', '<strong>Zdanie złożone składa się z dwóch lub więcej wypowiedzeń pojedynczych zwanych składowymi. Wypowiedzenia te mogą być albo zdaniami, czyli formą osobową lub nieosobową czasownika, albo równoważnikami zdania.</strong>
<!--more-->
W języku polskim dominują wypowiedzenia dwukrotnie złożone o dwóch częściach składowych, ale można się też spotkać z przypadkami wypowiedzeń wielokrotnie złożonych. Wypowiedzenia składowe łączone są za pomocą dwóch wskaźników zespolenia. Pierwsze z nich noszą nazwę wymawianiowych – w trakcie mowy są to: intonacja, akcent oraz pauza, w piśmie zaś znaki interpunkcyjne.
Drugie wskaźniki zespolenia noszą nazwę wyrazowych i są to głównie spójniki i zaimki. Najwięcej w naszym języku występuje wskaźników wyrazowych pojedynczych, takich jak: „i”, „a”, „ponieważ”, „jeśli”, „jak”, „jaki”, „który”, „czyj”, „ile”. Zdarza się, że wskaźniki te mogą być podwojone w zdaniu, czyli po prostu powtórzone (albo – albo, i – i, ani – ani, to – to), skorelowane (jeśli – to, choć – lecz, nie tylko – ale, tyle - o ile, im – tym) lub zestawione (mimo że, skoro tylko, a jednak, zwłaszcza że, wskutek tego).
<h3>Wypowiedzenia złożone współrzędnie</h3>
W wypowiedzeniach złożonych współrzędnie spójniki stoją między wypowiedzeniami składowymi lub członami szeregu, jak np.:
1) Biegnę i chudnę.
2) Płacze lub beczy.
3) Ona i on.
Bardzo rzadko się zdarza, aby znajdowały się one przed każdym członem zdania. Zamiast tego stosuje się w takim wypadku przecinek:
1) I on, i ona
2) Albo ty, albo ja
3) Czy pracujesz, czy się lenisz.
<h3>Wypowiedzenia złożone podrzędnie</h3>
W wypowiedzeniach złożonych podrzędnie wskaźnikami zespolenia są natomiast spójniki, zaimki i niektóre inne wyrazy:
1) Nie wiem, kiedy przyjdę.
2) Gotuję, tak jak lubisz.
3) Dowiedziałem się, dokąd jedzie tramwaj.
<strong>Dla przestankowania ważne jest miejsce w szyku</strong>, czyli wskaźnika zespolenia w zdaniu:
1) Poszedłem na tramwaj, bo tak chciałem
2) Poszedłem na tramwaj, ponieważ tak chciałem.
W obu przykładowych zdaniach stawia się <strong>przecinek przed spójnikiem</strong>, ale tylko w drugim zdaniu pozycja zaimka „bo” jest ustalona i możliwa wyłącznie między wypowiedziami składowymi. W zdaniu z „ponieważ” można zmienić szyk:
1)      Ponieważ tak chciałem, poszedłem na tramwaj.
2)      Na tramwaj poszedłem, ponieważ tak chciałem.
Spójnik <strong>„ponieważ” jest związany z wypowiedzeniem podrzędnym</strong> i jeśli ono się przemieszcza w szyku zdania, to również spójnik przemieszcza się razem z częścią podrzędną. Reguła przestankowania w takich wypowiedziach złożonych podrzędnie brzmi więc następująco:
1) Przed spójnikiem ponieważ stawia się przecinek.
2) Jeśli część podrzędna występuje na początku wypowiedzenia złożonego, to oddziela się ją przecinkiem od części nadrzędnej.
3) Jeśli wypowiedzenie podrzędne występuje w środku części nadrzędnej, to ujmuje się je w dwa przecinki.
<h3>Spójniki między wypowiedzeniowe i przywypowiedzeniowe</h3>
W polskim systemie interpunkcyjnym wyróżnia się spójniki międzywypowiedzeniowe oraz przywypowiedzeniowe. Do spójników międzywypowiedzeniowych należą:
„a”, „albo”, „albowiem”, „ale” , „ani” , „aniżeli”, „atoli”, „bo”, „boć”, „bowiem”, „czyli”, „gdyż”, „i”, „jednak”, „jednakże”, „lub”, „mianowicie”, „natomiast”, „ni”, „niż”, „oraz”, „przeto”, „przecie”, „przecież”, „tedy”, „też”, „to”, „to jest”, „tudzież”, „więc”, „wszelako”, „zarazem”, „zaś”, „zatem”. 
Do spójników przywypowiedzeniowych należą natomiast, takie znaki jak: „aby”, „ażeby”, „acz”, „aczkolwiek”, „aż”, „by”, „byle”, „chociaż”, „choć”, „choćby”, „chociażby”, „chybaby”, „co”, „coby”, „że”, „żeby”, „gdy”, „gdyby”, „iż”, „iżby”, „jak”, „jakby”, „jakkolwiek”, „jakkolwiek bądź”, „jako”, „jeśli”, „jeżeli”, „jeśliby”, „jeżeliby”, „lubo”, „nim”, „nuż”, „ponieważ”, „skoro”, „wprawdzie”.
Należy pamiętać, że przy zaimkach wprowadzających wypowiedzenie podrzędne mogą występować poprzedzające je i jednocześnie <strong>tworzące z nimi jedną całość przyimki</strong>:
1) Znam górę, na którą moglibyśmy wejść.
2) Na chodniku szedł jeż, do którego podeszliśmy.
3) Jesteś kobietą, o jakiej marzyłem.
4) Nie jestem pewien, po ile kartek wam rozdać.
<h3>Wypowiedzenie wplecione jedno w drugie</h3>
W polskiej interpunkcji zdarzają się też wypowiedzenia, w których na skutek wplecenia jednego w drugie <strong>występuje zbieg dwóch wskaźników zespolenia</strong>, czyli dwóch spójników, spójnika i zaimka albo zaimka i spójnika. Przykładami takich wypowiedzeń są:
„a gdy”, „a kiedy”, „a choć”, „a jeśli”, „a mianowicie”, „a ponieważ”, „a więc”, „a że” , „aby gdy”, „aby kiedy”, „aby jeśli”, „albo gdy”, „albo kiedy”, „albo jeśli”, „albo że”, „że jeśli”, „że aby”, „że gdy”, „i choć”, „który jeśli”, „bo gdy”, „czyli że” itp.
O interpunkcji w takich zdaniach <strong>decyduje konstrukcja składowa</strong>, czyli pierwszy wskaźnik zespolenia:
Przed „że”, „który”, że jeśli”, „że aby”, „który  jeśli” stawia się przecinek. Przed „i”, „albo”, „i choć”, „i gdyby”, „albo gdyby” nie stawia się przecinka, jak w przykładach:
1) Biegnę już bardzo długo i choć jestem bardzo zmęczony, nie poddam się tak łatwo.
2) Dowiedziałam się, że aby dostać się tu na studia, trzeba dobrze zdać maturę.
3) Gosia jest mądrą dziewczyną, którą jeśliby się podszkoliło, to uzyskałaby dobre wyniki w nauce.
', 'Zdanie złożone składa się z dwóch lub więcej wypowiedzeń pojedynczych zwanych składowymi. Wypowiedzenia te mogą być albo zdaniami, czyli formą osobową lub nieosobową czasownika, albo równoważnikami zdania. W języku polskim...', 'e1d65c0c-2a31-445a-b7d3-508c5e06bbe2', 'Ogólne zasady interpunkcji w zdaniu złożonym', 'Zdanie złożone składa się z dwóch lub więcej wypowiedzeń pojedynczych zwanych składowymi. Wypowiedzenia te mogą być albo zdaniami, czyli formą osobową lub nieosobową czasownika, albo równoważnikami zdania. W języku polskim...', true, '2011-07-13 12:01:40', '2025-12-11 18:12:00.963', '2025-12-11 18:12:00.963');
INSERT INTO public."Article" VALUES ('f40acaba-e98d-4aa9-9994-3625a5f497df', 'Funkcje znaków interpunkcyjnych', 'funkcje-znakow-interpunkcyjnych', 'W polskim systemie interpunkcyjnym znajdziemy 10 znaków. Do najczęściej używanych zaliczają się:
<!--more-->
<ul>
	<li>- kropka,</li>
	<li>- przecinek,</li>
	<li>- znak zapytania,</li>
	<li>- znak wykrzyknienia,</li>
	<li>- dwukropek.</li>
</ul>
Rzadziej natomiast stosujemy takie znaki interpunkcyjne jak:
<ul>
	<li>- myślnik oznaczający pauzę,</li>
	<li>- wielokropek,</li>
	<li>- nawias,</li>
	<li>- cudzysłów,</li>
	<li>- średnik.</li>
</ul>
Niemniej jednak <strong>wszystkie one są jednakowo ważne</strong>, ponieważ zapewniają jednoznaczność wypowiedzi, a także ułatwiają jej zrozumienie oraz właściwie wygłoszenie. Poszczególne znaki interpunkcyjne oprócz wymienionych już funkcji ogólnych posiadają funkcje właściwe tylko dla siebie.
<strong>Przecinek, średnik i kropka oddzielają w zdaniu sąsiadujące ze sobą człony</strong>. Kropka jednocześnie służy do zamykania wypowiedzenia. Dwukropek zapowiada wyliczenia przydatne, gdy np. chcemy wyliczać cechy jakiegoś człowieka:
- Jasiu jest: mądry, silny, inteligentny, sprytny itp.
Wielokropek służy natomiast do przerywania zdania, a myślnik wskazuje na opuszczenie części wypowiedzenia. <strong>Na ładunek emocjonalno-logiczny w wypowiedzi pisemnej wskazują</strong> takie znaki interpunkcyjne jak: pytajnik, wykrzyknik, częściowo też pauza oraz wielokropek. Do cytowania czyjejś wypowiedzi lub artykułu umieszczonego w jakimś źródle tekstowym służy z kolei cudzysłów.
Najważniejszą rolę w polskim systemie interpunkcyjnym odgrywa struktura zdania, dlatego nazywany jest on systemem składniowym. O tym, jaki charakter ma wypowiedzenie, a zarazem jaki jest stosunek części zdania oraz jego zdań składowych, informują znaki przestankowe, którymi są <strong>oznajmienie, wykrzyknienie oraz pytanie</strong>. Znaki te zaznaczają także tekst główny i poboczny zdania oraz tekst własny i cytowany.
', 'W polskim systemie interpunkcyjnym znajdziemy 10 znaków. Do najczęściej używanych zaliczają się: - kropka, - przecinek, - znak zapytania, - znak wykrzyknienia, - dwukropek. Rzadziej natomiast stosujemy takie znaki interpunkcyjne...', 'e1d65c0c-2a31-445a-b7d3-508c5e06bbe2', 'Funkcje znaków interpunkcyjnych', 'W polskim systemie interpunkcyjnym znajdziemy 10 znaków. Do najczęściej używanych zaliczają się: - kropka, - przecinek, - znak zapytania, - znak wykrzyknienia, - dwukropek. Rzadziej natomiast stosujemy takie znaki interpunkcyjne...', true, '2011-07-13 11:34:48', '2025-12-11 18:12:00.966', '2025-12-11 18:12:00.966');
INSERT INTO public."Article" VALUES ('0f565f91-5464-460f-9e09-e1ebd86955b3', 'Przecinek przed "czy"', 'przecinek-przed-czy', '<strong>„Czy” jest wskaźnikiem zespolenia. Wprowadza on do zdania wypowiedzenia podrzędne. Przed „czy” stawia się przecinek. </strong> Jeżeli część podrzędna zdania znajduje się na jego początku, to oba jego człony rozdziela się przecinkiem:
<ul>
	<li>- Długo myślałem, czy podejdę do tego zadania.</li>
	<li>- Mam wątpliwości, czy uda nam się dotrzeć na czas.</li>
</ul>
„Czy” funkcjonujące w zdaniu jako spójnik może łączyć zdania współrzędne lub ich części i wyrażać wymienność lub wyłączanie się ich obu członów. W takiej sytuacji nie umieszcza się przed nim przecinka:
<ul>
	<li>- Sobota czy niedziela – ja i tak do pracy muszę wstać rano.</li>
	<li>- Ściągała czy sama napisała ten egzamin?</li>
</ul>
Jeśli spójnik rozłączny „czy” kreuje z innymi wyrazami połączenie o funkcji dopowiedzenia lub wtrącenia – to możne je oddzielić przecinkiem:
<ul>
	<li>- Kupiłam nowy, wspaniały sprzęt komputerowy, czy raczej kolejny gadżet do kolekcji…</li>
	<li>- Wpadniesz, czy odłożymy naszą rozmowę na później?</li>
</ul>
Jeżeli spójnik „czy” wystąpi w zdaniu więcej niż jeden raz, to stawia się przed nim przecinek:
<ul>
	<li>- Czy sobota, czy niedziela – do pracy rano wstaję.</li>
	<li>- Czy ściągała, czy sama zdała egzamin, to ja naprawdę nie wiem.</li>
</ul>
<strong>Wyraz „czy” może też funkcjonować w zdaniu jako partykuła</strong> zaczynająca wypowiedzenie pytające lub ekspresywne. Na końcu takiego zdania umieszcza się pytajnik:
<ul>
	<li>- Czy przyjdziesz do mnie jutro?</li>
	<li>- Czy Ty się naprawdę dobrze czujesz?!</li>
	<li>- Czy pójdziesz we wtorek na zakupy?</li>
</ul>
<strong>Czasem się zdarza, że wypowiedzenia z „czy” są pozornie pytające</strong>. Nie umieszcza się w takim przypadku znaku zapytania przy zakończeniu zdania:
<ul>
	<li>- Czy może zmądrzała.</li>
	<li>- Czy można żyć wiecznie.</li>
</ul>
W pytaniach rozłącznych partykuła „czy” znajduje się przed każdym z członów pytających lub tylko przed drugim członem. W pierwszej sytuacji oba człony zdania rozdziela się przecinkiem, w drugiej natomiast przecinka się nie stawia:
<ul>
	<li>- Czy w poniedziałek, czy w środę?</li>
	<li>- W środę czy w poniedziałek?</li>
	<li>- Czy przyjedziesz autem, czy skorzystasz z autobusu?</li>
</ul>
', '„Czy” jest wskaźnikiem zespolenia. Wprowadza on do zdania wypowiedzenia podrzędne. Przed „czy” stawia się przecinek. Jeżeli część podrzędna zdania znajduje się na jego początku, to oba jego człony rozdziela się...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed "czy"', '„Czy” jest wskaźnikiem zespolenia. Wprowadza on do zdania wypowiedzenia podrzędne. Przed „czy” stawia się przecinek. Jeżeli część podrzędna zdania znajduje się na jego początku, to oba jego człony rozdziela się...', true, '2025-12-11 22:10:32.109', '2025-12-11 18:12:00.913', '2025-12-11 22:10:32.11');
INSERT INTO public."Article" VALUES ('944bbbe3-8549-487d-847a-a2a0bb61b2cb', 'Przecinek przed "ani"', 'przecinek-przed-ani', '<strong>„Ani” jest spójnikiem, który łączy równorzędne części wypowiedzenia w zdaniu zaprzeczonym lub wypowiedzenia przeczące współrzędne</strong>. Nie stawia się przed nim przecinka, o ile nie pełni roli wtrącenia ani nie występuje w zdaniu więcej niż jeden raz:
<!--more-->
<ul>
	<li>- Nie pójdę do pracy dzisiaj ani jutro.</li>
	<li>- Na dworze nie ma mrówek ani pszczółek.</li>
	<li>- Nie kupił mleka ani herbaty.</li>
</ul>
<strong>Można postawić przecinek przed „ani”, gdy pełni on funkcję wyłączającą</strong>. Dzieje się tak w momencie, kiedy tworzy on z innymi wyrazami połączenia o charakterze dopowiedzeń lub wtrąceń:
<ul>
	<li>- Nie zwrócił pożyczonej odzieży, ani nie zadzwonił.</li>
	<li>- Nie nauczył się go egzaminu, ani nawet o nim nie wiedział.</li>
</ul>
<strong>W przypadku, gdy spójnik ten jest powtórzony, stawia się przy nim przecinek</strong>. Znak interpunkcyjny pojawia się w zdaniu przed drugim ani lub przed oboma spójnikami:
<ul>
	<li>- Nie kupiła ani warzyw, ani owoców.</li>
	<li>- Ani nie zdała matury, ani nie skończyła szkoły.</li>
	<li>- Normalna praca, ani trudna, ani łatwa.</li>
	<li>- Jak możesz wymagać dużych zarobków, kiedy nie masz ani wykształcenia, ani zdolności, ani nawet ubrać się dobrze nie potrafisz.</li>
</ul>
<strong>Jeżeli wystąpi on w funkcji partykuły przeczącej</strong>, która poprzedza orzeczenie czasownikowe oraz rzeczowniki, a wyrażenie to znajdzie się na początku zdania lub w jego środku, to nie stawia się przed nim przecinka:
<ul>
	<li>- Nie kupiłam ani trochę cukierków.</li>
	<li>- W sklepie nie było ani litra mleka.</li>
	<li>- Ani się waż!</li>
</ul>', '„Ani” jest spójnikiem, który łączy równorzędne części wypowiedzenia w zdaniu zaprzeczonym lub wypowiedzenia przeczące współrzędne. Nie stawia się przed nim przecinka, o ile nie pełni roli wtrącenia ani nie występuje...', '434d48d9-f4c3-4412-90a4-de73d3e8356b', 'Przecinek przed Ani', '„Ani” jest spójnikiem, który łączy równorzędne części wypowiedzenia w zdaniu zaprzeczonym lub wypowiedzenia przeczące współrzędne. Nie stawia się przed nim przecinka, o ile nie pełni roli wtrącenia ani nie występuje...', true, '2025-12-11 22:11:51.202', '2025-12-11 18:12:00.934', '2025-12-11 22:11:51.203');


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."User" VALUES ('6bde43c5-e9a7-4280-9884-24babfd79f0e', 'kontakt@webcopywriting.pl', '$2b$10$Wqfw6RwgiPSRxcqmQSdIYeY5p5J5eUSzEC427Xril6qfhxIGo/lyu', 'karol', 'PREMIUM', true, NULL, NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YmRlNDNjNS1lOWE3LTQyODAtOTg4NC0yNGJhYmZkNzlmMGUiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc2NTQ3MjIyMywiZXhwIjoxNzY4MDY0MjIzfQ.0ei4NIOw_yB586D4W-_wIDkK5X9G5iDZJjmpLquzrAM', '2025-12-11 16:57:03.039', '2025-12-11 14:23:41.279', '2025-12-11 16:57:03.047', 'cus_TaNH5RahUjbTyK', true, 'ADMIN');


--
-- Data for Name: Check; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Check" VALUES ('0e21cf4a-1355-4bf3-89e1-2397a8b104da', '6bde43c5-e9a7-4280-9884-24babfd79f0e', NULL, 'Wczoraj wieczorem kiedy wracałem z pracy zobaczyłem że na ulicy stoi mój stary znajomy Marek którego nie widziałem od co najmniej pięciu lat. Podszedłem do niego i zapytałem co u niego słychać bo byłem naprawdę ciekawy jak potoczyło się jego życie. Okazało się że przeprowadził się do Krakowa gdzie znalazł świetną pracę w firmie informatycznej która zajmuje się tworzeniem aplikacji mobilnych. Powiedział mi również że niedawno się ożenił i że jego żona spodziewa się dziecka co bardzo mnie ucieszyło. Rozmawialiśmy przez dobre pół godziny mimo że było już dość późno i obaj byliśmy zmęczeni po całym dniu. Marek wspomniał że planuje otworzyć własną działalność gospodarczą ponieważ ma kilka ciekawych pomysłów na aplikacje które mogłyby odnieść sukces na rynku. Umówiliśmy się że spotkamy się w przyszłym tygodniu żeby porozmawiać dłużej i wymienić się doświadczeniami. Kiedy wróciłem do domu opowiedziałem żonie o tym spotkaniu a ona przypomniała sobie że Marek był kiedyś na naszym ślubie i że zawsze był bardzo sympatycznym człowiekiem.
', 'Wczoraj wieczorem, kiedy wracałem z pracy, zobaczyłem, że na ulicy stoi mój stary znajomy Marek, którego nie widziałem od co najmniej pięciu lat. Podszedłem do niego i zapytałem, co u niego słychać, bo byłem naprawdę ciekawy, jak potoczyło się jego życie. Okazało się, że przeprowadził się do Krakowa, gdzie znalazł świetną pracę w firmie informatycznej, która zajmuje się tworzeniem aplikacji mobilnych. Powiedział mi również, że niedawno się ożenił i że jego żona spodziewa się dziecka, co bardzo mnie ucieszyło. Rozmawialiśmy przez dobre pół godziny, mimo że było już dość późno i obaj byliśmy zmęczeni po całym dniu. Marek wspomniał, że planuje otworzyć własną działalność gospodarczą, ponieważ ma kilka ciekawych pomysłów na aplikacje, które mogłyby odnieść sukces na rynku. Umówiliśmy się, że spotkamy się w przyszłym tygodniu, żeby porozmawiać dłużej i wymienić się doświadczeniami. Kiedy wróciłem do domu, opowiedziałem żonie o tym spotkaniu, a ona przypomniała sobie, że Marek był kiedyś na naszym ślubie i że zawsze był bardzo sympatycznym człowiekiem.', '[{"rule": "Przecinek przed i po zdaniu podrzędnym okolicznikowym", "original": "Wczoraj wieczorem kiedy wracałem z pracy zobaczyłem", "position": {"end": 56, "start": 0}, "corrected": "Wczoraj wieczorem, kiedy wracałem z pracy, zobaczyłem", "explanation": "Zdanie podrzędne okolicznikowe czasu \"kiedy wracałem z pracy\" powinno być wydzielone przecinkami."}, {"rule": "Przecinek przed spójnikiem \"że\" i przed zaimkiem względnym", "original": "zobaczyłem że na ulicy stoi mój stary znajomy Marek którego", "position": {"end": 103, "start": 47}, "corrected": "zobaczyłem, że na ulicy stoi mój stary znajomy Marek, którego", "explanation": "Przed spójnikiem \"że\" wprowadzającym zdanie podrzędne oraz przed zaimkiem względnym \"którego\" stawiamy przecinek."}, {"rule": "Przecinek przed mową zależną i spójnikami podrzędnymi", "original": "i zapytałem co u niego słychać bo byłem naprawdę ciekawy jak", "position": {"end": 207, "start": 149}, "corrected": "i zapytałem, co u niego słychać, bo byłem naprawdę ciekawy, jak", "explanation": "Przecinki należy stawiać przed \"co\" (mowa zależna), \"bo\" (przyczyna) i \"jak\" (sposób)."}, {"rule": "Przecinek przed spójnikami podrzędnymi", "original": "Okazało się że przeprowadził się do Krakowa gdzie znalazł świetną pracę w firmie informatycznej która", "position": {"end": 333, "start": 232}, "corrected": "Okazało się, że przeprowadził się do Krakowa, gdzie znalazł świetną pracę w firmie informatycznej, która", "explanation": "Przecinki przed \"że\", \"gdzie\" i \"która\" wydzielają zdania podrzędne."}, {"rule": "Przecinek przed spójnikami podrzędnymi", "original": "Powiedział mi również że niedawno się ożenił i że jego żona spodziewa się dziecka co", "position": {"end": 477, "start": 394}, "corrected": "Powiedział mi również, że niedawno się ożenił i że jego żona spodziewa się dziecka, co", "explanation": "Przecinki przed \"że\" i \"co\" wydzielają zdania podrzędne."}, {"rule": "Przecinek przed zdaniem podrzędnym przyzwolenia", "original": "Rozmawialiśmy przez dobre pół godziny mimo że było już dość późno", "position": {"end": 574, "start": 509}, "corrected": "Rozmawialiśmy przez dobre pół godziny, mimo że było już dość późno", "explanation": "Przed spójnikiem \"mimo że\" wprowadzającym zdanie podrzędne przyzwolenia stawiamy przecinek."}, {"rule": "Przecinek przed spójnikami podrzędnymi", "original": "Marek wspomniał że planuje otworzyć własną działalność gospodarczą ponieważ ma kilka ciekawych pomysłów na aplikacje które", "position": {"end": 735, "start": 614}, "corrected": "Marek wspomniał, że planuje otworzyć własną działalność gospodarczą, ponieważ ma kilka ciekawych pomysłów na aplikacje, które", "explanation": "Przecinki przed \"że\", \"ponieważ\" i \"które\" wydzielają kolejne zdania podrzędne."}, {"rule": "Przecinek przed spójnikami podrzędnymi", "original": "Umówiliśmy się że spotkamy się w przyszłym tygodniu żeby", "position": {"end": 832, "start": 776}, "corrected": "Umówiliśmy się, że spotkamy się w przyszłym tygodniu, żeby", "explanation": "Przecinki przed \"że\" i \"żeby\" wydzielają zdania podrzędne."}, {"rule": "Przecinek po zdaniu podrzędnym i przed spójnikami", "original": "Kiedy wróciłem do domu opowiedziałem żonie o tym spotkaniu a ona przypomniała sobie że Marek był kiedyś na naszym ślubie", "position": {"end": 1016, "start": 895}, "corrected": "Kiedy wróciłem do domu, opowiedziałem żonie o tym spotkaniu, a ona przypomniała sobie, że Marek był kiedyś na naszym ślubie", "explanation": "Przecinek po zdaniu podrzędnym czasowym, przed spójnikiem \"a\" i przed \"że\" wydzielającym zdanie podrzędne."}]', 1042, 9, '2025-12-11 16:37:05.543');
INSERT INTO public."Check" VALUES ('b8a89e67-958d-4d94-bbc9-5c2bb84ef104', '6bde43c5-e9a7-4280-9884-24babfd79f0e', NULL, 'Wczoraj wieczorem kiedy wracałem z pracy zobaczyłem że na ulicy stoi mój stary znajomy Marek którego nie widziałem od co najmniej pięciu lat. Podszedłem do niego i zapytałem co u niego słychać bo byłem naprawdę ciekawy jak potoczyło się jego życie. Okazało się że przeprowadził się do Krakowa gdzie znalazł świetną pracę w firmie informatycznej która zajmuje się tworzeniem aplikacji mobilnych. Powiedział mi również że niedawno się ożenił i że jego żona spodziewa się dziecka co bardzo mnie ucieszyło. Rozmawialiśmy przez dobre pół godziny mimo że było już dość późno i obaj byliśmy zmęczeni po całym dniu. Marek wspomniał że planuje otworzyć własną działalność gospodarczą ponieważ ma kilka ciekawych pomysłów na aplikacje które mogłyby odnieść sukces na rynku. Umówiliśmy się że spotkamy się w przyszłym tygodniu żeby porozmawiać dłużej i wymienić się doświadczeniami. Kiedy wróciłem do domu opowiedziałem żonie o tym spotkaniu a ona przypomniała sobie że Marek był kiedyś na naszym ślubie i że zawsze był bardzo sympatycznym człowiekiem.
', 'Wczoraj wieczorem, kiedy wracałem z pracy, zobaczyłem, że na ulicy stoi mój stary znajomy Marek, którego nie widziałem od co najmniej pięciu lat. Podszedłem do niego i zapytałem, co u niego słychać, bo byłem naprawdę ciekawy, jak potoczyło się jego życie. Okazało się, że przeprowadził się do Krakowa, gdzie znalazł świetną pracę w firmie informatycznej, która zajmuje się tworzeniem aplikacji mobilnych. Powiedział mi również, że niedawno się ożenił i że jego żona spodziewa się dziecka, co bardzo mnie ucieszyło. Rozmawialiśmy przez dobre pół godziny, mimo że było już dość późno i obaj byliśmy zmęczeni po całym dniu. Marek wspomniał, że planuje otworzyć własną działalność gospodarczą, ponieważ ma kilka ciekawych pomysłów na aplikacje, które mogłyby odnieść sukces na rynku. Umówiliśmy się, że spotkamy się w przyszłym tygodniu, żeby porozmawiać dłużej i wymienić się doświadczeniami. Kiedy wróciłem do domu, opowiedziałem żonie o tym spotkaniu, a ona przypomniała sobie, że Marek był kiedyś na naszym ślubie i że zawsze był bardzo sympatycznym człowiekiem.', '[{"rule": "Przecinek przy równoważniku zdania i zdaniu podrzędnym", "original": "Wczoraj wieczorem kiedy wracałem z pracy zobaczyłem", "position": {"end": 51, "start": 0}, "corrected": "Wczoraj wieczorem, kiedy wracałem z pracy, zobaczyłem", "explanation": "Przecinki wydzielają równoważnik zdania okolicznikowy czasu oraz zdanie podrzędne czasowe. Obowiązkowo oddzielamy przecinkami konstrukcje rozpoczynające się od ''kiedy''."}, {"rule": "Przecinek przed spójnikiem ''że''", "original": "zobaczyłem że na ulicy", "position": {"end": 66, "start": 44}, "corrected": "zobaczyłem, że na ulicy", "explanation": "Przed spójnikiem ''że'' wprowadzającym zdanie podrzędne zawsze stawiamy przecinek."}, {"rule": "Przecinek przed zaimkiem względnym", "original": "znajomy Marek którego nie widziałem", "position": {"end": 122, "start": 87}, "corrected": "znajomy Marek, którego nie widziałem", "explanation": "Zdanie względne wprowadzone zaimkiem ''którego'' oddzielamy przecinkiem od zdania nadrzędnego."}, {"rule": "Przecinki przy mowie zależnej i spójniku przyczynowym", "original": "i zapytałem co u niego słychać bo byłem", "position": {"end": 215, "start": 176}, "corrected": "i zapytałem, co u niego słychać, bo byłem", "explanation": "Przecinek przed ''co'' (mowa zależna) oraz przed ''bo'' (zdanie podrzędne przyczynowe)."}, {"rule": "Przecinek przed spójnikiem ''jak'' w zdaniu podrzędnym", "original": "ciekawy jak potoczyło się", "position": {"end": 253, "start": 228}, "corrected": "ciekawy, jak potoczyło się", "explanation": "Zdanie podrzędne sposobowe wprowadzone spójnikiem ''jak'' oddzielamy przecinkiem."}, {"rule": "Przecinki przed ''że'' i ''gdzie''", "original": "Okazało się że przeprowadził się do Krakowa gdzie znalazł", "position": {"end": 325, "start": 267}, "corrected": "Okazało się, że przeprowadził się do Krakowa, gdzie znalazł", "explanation": "Przecinek przed ''że'' oraz przed ''gdzie'' wprowadzającym zdanie względne miejsca."}, {"rule": "Przecinek przed zaimkiem względnym ''która''", "original": "firmie informatycznej która zajmuje się", "position": {"end": 386, "start": 346}, "corrected": "firmie informatycznej, która zajmuje się", "explanation": "Zdanie względne wprowadzone zaimkiem ''która'' wydzielamy przecinkami."}, {"rule": "Przecinek przed spójnikiem ''że''", "original": "również że niedawno", "position": {"end": 453, "start": 434}, "corrected": "również, że niedawno", "explanation": "Przed spójnikiem ''że'' wprowadzającym zdanie podrzędne stawiamy przecinek."}, {"rule": "Przecinek przed zaimkiem względnym ''co''", "original": "dziecka co bardzo mnie", "position": {"end": 520, "start": 498}, "corrected": "dziecka, co bardzo mnie", "explanation": "Zaimek względny ''co'' wprowadza zdanie podrzędne, które oddzielamy przecinkiem."}, {"rule": "Przecinek przed spójnikiem złożonym ''mimo że''", "original": "pół godziny mimo że było", "position": {"end": 593, "start": 569}, "corrected": "pół godziny, mimo że było", "explanation": "Zdanie podrzędne przyzwalające wprowadzone przez ''mimo że'' wydzielamy przecinkiem."}, {"rule": "Przecinek przed spójnikiem ''że''", "original": "wspomniał że planuje", "position": {"end": 681, "start": 661}, "corrected": "wspomniał, że planuje", "explanation": "Przed spójnikiem ''że'' wprowadzającym zdanie podrzędne stawiamy przecinek."}, {"rule": "Przecinek przed spójnikiem ''ponieważ''", "original": "gospodarczą ponieważ ma kilka", "position": {"end": 751, "start": 722}, "corrected": "gospodarczą, ponieważ ma kilka", "explanation": "Zdanie podrzędne przyczynowe wprowadzone przez ''ponieważ'' oddzielamy przecinkiem."}, {"rule": "Przecinek przed zaimkiem względnym ''które''", "original": "na aplikacje które mogłyby", "position": {"end": 802, "start": 776}, "corrected": "na aplikacje, które mogłyby", "explanation": "Zdanie względne wprowadzone zaimkiem ''które'' wydzielamy przecinkiem."}, {"rule": "Przecinek przed spójnikiem ''że''", "original": "się że spotkamy się", "position": {"end": 860, "start": 842}, "corrected": "się, że spotkamy się", "explanation": "Przed spójnikiem ''że'' wprowadzającym zdanie podrzędne stawiamy przecinek."}, {"rule": "Przecinek przed spójnikiem ''żeby''", "original": "tygodniu żeby porozmawiać", "position": {"end": 905, "start": 880}, "corrected": "tygodniu, żeby porozmawiać", "explanation": "Zdanie podrzędne celowe wprowadzone przez ''żeby'' oddzielamy przecinkiem."}, {"rule": "Przecinek przed zdaniem głównym po zdaniu podrzędnym", "original": "domu opowiedziałem żonie", "position": {"end": 989, "start": 965}, "corrected": "domu, opowiedziałem żonie", "explanation": "Po zdaniu podrzędnym rozpoczynającym wypowiedzenie stawiamy przecinek przed zdaniem nadrzędnym."}, {"rule": "Przecinki przed spójnikiem ''a'' i ''że''", "original": "spotkaniu a ona przypomniała sobie że Marek", "position": {"end": 1043, "start": 1000}, "corrected": "spotkaniu, a ona przypomniała sobie, że Marek", "explanation": "Przecinek przed spójnikiem ''a'' łączącym zdania współrzędne oraz przed ''że'' wprowadzającym zdanie podrzędne."}]', 1042, 17, '2025-12-11 22:18:39.466');


--
-- Data for Name: DailyUsage; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."DailyUsage" VALUES ('9cb7b145-7fab-4410-af25-c90c82df1fbb', '6bde43c5-e9a7-4280-9884-24babfd79f0e', NULL, '2025-12-10', 2, 2084);


--
-- PostgreSQL database dump complete
--

