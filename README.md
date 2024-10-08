# Drone Enterprise Management App

[English version](./README.eng.md)

Aplikacja stworzona z myślą o własnej działalności związanej z usługami z wykorzystaniem Bezzałogowych Statków Powietrznych. Niniejszy projekt stanowi jednocześnie moją pracą inżynierską pod tytułem "Aplikacja Internetowa wspomagająca działanie i promocję przedsiębiorstwa na przykładzie firmy świadczącej usługi z wykorzystaniem dronów" .

Aplikacja obejmuje warstwę prezentacji usług i aspektów współpracy, prezentację wybranych usług w formie portfolio stworzonego na wzór popularnego serwisu mediów społecznościowych oraz warstwę autoryzacji gdzie zalogowany użytkownik ma dostęp do panelu użytkownika oraz formularza składania zamówienia na zlecenie. Administrator ma dostęp do modyfikowania zawartości portfolio jak również zarządzania stanem zlecenia na usługę.

## Najważniejsze aspekty aplikacji

-   Responsywność (RWD)
-   Autoryzacja oparta na sesji użytkownika z pomocą plików cookie
-   Funkcjonalne i estetyczne UI/UX
-   Pokrycie testami
-   Zastosowanie efektywnych rozwiązań oferowanych przez poszczególne framework'i
-   Powiadomienia e-mailowe

## Stack technologiczny

-   Frontend: Angular (Typescript)
-   Backend: Laravel (PHP)
-   DB: PostgreSQL
-   Style: Tailwind, CSS3
-   Komponenty: Angular Materials, PrimeNG
-   Testy: PHPUnit (Backend), Cypress (Frontend)

Frontend został stworzony z wykorzystaniem frameworku Angular w wyniku czego powstała aplikacja jednostronicowa (SPA). Przy zastosowaniu framework'u Laravel stworzono REST API z warstwą autoryzacyjną (biblioteka Sanctum). Zastosowano wydajny silnik relacyjnej bazy danych - PostgreSQL.

Style zdefiniowano głównie przy użyciu biblioteki Tailwind z lekkimi modyfikacjami po stronie CSS3. Projekt korzysta również z gotowych komponentów takich jak Carousel, Timeline, Stepper czy Toast oferowanych przez Angular Materials oraz PrimeNG.

## Biblioteki zewnętrzne

-   [AOS - Animate On Scroll](https://www.npmjs.com/package/aos) - biblioteka wykorzystana do implementacji animacji sprzężonych ze scrollowaniem
-   [Cookie Service](https://www.npmjs.com/package/ngx-cookie-service) - biblioteka wspomagająca działanie na plikach cookie
-   [Angular Materials](https://v16.material.angular.io/) - biblioteka typu Materials ściśle związana i dedykowana do framework'a Angular
-   [PrimeNG](https://primeng.org) - biblioteka komponentów dedykowanych dla framework'a Angular
-   [Angular Code Input](https://www.npmjs.com/package/angular-code-input) - biblioteka wspomagająca obsługę kodów weryfkacyjnych
-   [@tailwindcss/aspect-ratio](https://www.npmjs.com/package/@tailwindcss/aspect-ratio) - biblioteka wspomagająca responsywność elementów określonych proporcją
-   [Google Maps API](https://www.npmjs.com/package/@angular/google-maps) - biblioteka wspierająca zastosowanie funkcjonalności oferowanych przez platformę Google Maps

## Przegląd funkcjonalności

### Strona główna

![Strona główna](drone-enterprise-management-app-backend/storage/documentation-assets/menu.png)

Strona główna składa się z powyższego banneru, prezentacji mocnych stron wspołpracy, skrótu oferowanych usług, skrótu do portolio oraz skrótu do formularza kontaktowego - oczywiście w pełnej responsywności na innych urządzeniach w myśl zasady mobile-first. Podobnie pasek nawigacji - dla odpowiedniej szerokości menu przechodzi w tryb "hamburger". Zawartość paska nawigacji jest ściśle związana ze stanem autoryzacji użytkownika.

### Prezentacja usługi

Aplikacja posiada dedykowaną zakładkę zawierającą skrót to wszystkich dostępnych usług. Przejście do szczegółów usługi następuje po wybraniu odpowiedniej karty z usługą.

![Karty usług](drone-enterprise-management-app-backend/storage/documentation-assets/services-menu.png)

Po wybraniu usługi przechodzimy do szczegółow z nią związanych. Z tego poziomu można przejść do informacji związanych z procedurą realizacji zamówienia, formularza składania zamówienia, formularza kontaktowego lub portfolio.

![Szczegóły usługi](drone-enterprise-management-app-backend/storage/documentation-assets/service-info.png)

### Autoryzacja

Autoryzacja zrealizowana w ramach REST API funkcjonuje z wykorzystaniem biblioteki Sanctum. Jak już wspomniano, autoryzacja użytkownika polega na wygenerowaniu unikatowej sesji opartej na przegldarkowych plikach cookie.

Co więcej, implementacja REST API w projekcie wykorzystuje mechanizmy zabezpieczeń CSRF. Poniżej zaprezentowano uprawnienia do działań związanych z aplikacją z podziałem na role.

| Rola       | Uprawnienia                                               |
| ---------- | --------------------------------------------------------- |
| Gość       | Rejestracja, przeglądanie portoflio, formularz kontatkowy |
| Użytkownik | Logowanie, panel użytkownika, składanie zamówienia        |
| Admin      | Zarządzanie portfolio i zleceniami                        |

Endpointy zawierające restrykcje co do roli użytkownika korzystają z middleware API CheckRole.

_Middleware/CheckRole.php:_

```
public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, $roles)) {

            return $this->error(
                'You have no privileges to call that endpoint',
                'UNAUTHORIZED',
                401
            );
        }
        return $next($request);
    }
```

```
    Route::post('/posts/create', [PostController::class, 'store'])->middleware('restrictRole:admin');
```

Wszystkie requesty z wyjątkiem requestu typu _GET_ muszą zostać autoryzowane pod kątem zabezpieczeń CSRF.

Aby żądanie nie zostało odrzucone, przed dokonaniem właściwego requestu należy odpytać endpoint przeznaczony do autoryzowania CSRF.

```http
  GET /sanctum/csrf-cookie
```

Zwrotnie, API przydziela odpowiedni klucz CSRF, który powinien być dołączony do właściwego requestu w postaci headera **Set-Cookie**.

Po stronie klienta Angular dba o to aby każdy request niebędący requestem typu _GET_ był poprzedzony odpytaniem endpointa CSRF dzięki zastosowaniu **http interceptors**:

_csrf.interceptor.ts_

```javascript
intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return from(this.csrfService.fetchCsrfToken()).pipe(
        switchMap(() => {
          const csrfToken = this.csrfService.getCsrfToken();
          const clonedRequest = req.clone({
            headers: req.headers.set(
              'X-XSRF-TOKEN',
              csrfToken ? csrfToken : ''
            ),
          });
          return next.handle(clonedRequest);
        })
      );
    } else {
      return next.handle(req);
    }
  }
```

_csrf.service.ts_

```javascript
private csrfToken: string = this.cookieService.get('XSRF-TOKEN');

  async fetchCsrfToken(): Promise<void> {
    try {
      console.log('inside fetch csrf method');
      await this.http.get('http://localhost:8000/sanctum/csrf-cookie', {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }),
        withCredentials: true,
      }).toPromise();
      this.csrfToken = this.cookieService.get('XSRF-TOKEN');
    } catch (error) {
      console.error('Failed to fetch CSRF token', error);
    }
  }

  getCsrfToken(): string | null {
    return this.csrfToken;
  }
```

#### Rejestracja

Aplikacja umożliwia założenie konta użytkownika poprzez podanie adresu mailowego, hasła, akceptację regulaminu i dobrowolną akceptację przypisania do newslettera.

```http
  POST /register
```

![Rejestracja](drone-enterprise-management-app-backend/storage/documentation-assets/register.png)

Aplikacja dynamicznie kontroluje walidację pól formularza jak również informuje o wystąpieniu błędu w postaci powiadmienia w formularzu lub w postaci dynamiczych komponentów _Toasts_.

Kolejnym etapem po pomyślnym wysłaniu formularza jest weryfikacja konta. W tym celu na podany adres mailowy wysyłany jest 6-cyfrowy kod, który należy wpisać w odpowiednie miejsce na stronie weryfikacyjnej. Kod ma ważność 24h a po upływie tego czasu jest usuwany razem z niezweryfikowanym kontem.

![Mail weryfikacyjny](drone-enterprise-management-app-backend/storage/documentation-assets/verification-email.png)

![Strona weryfikacyjna](drone-enterprise-management-app-backend/storage/documentation-assets/verification.png)

#### Logowanie

```http
  POST /login
```

![Logowanie](drone-enterprise-management-app-backend/storage/documentation-assets/login.png)

Proces logowania zakończony sukcesem niesie za sobą utworzenia pliku cookie sesji oraz pliku cookie z danymi użytkownika

#### Autologin i Login Check

Autologin bazuje na zasadzie odtworzenia stanu zalogowania odpowiedniego użytkownika na podstawie pliku cookie z jego danymi w przypadku odświeżenia przeglądarki. Taki plik tworzony jest w momencie zalogowania i usuwany w momencie wylogowania. Aplikacja po stronie klienta dba o to aby odtworzyć globalny stan zalogowania kiedy flagi logiczne, z których korzystają komponenty są zresetowane.

Login Check służy do usprawnienia działania aplikacji. W momencie wykonywania requestu wrażliwego na stan autoryzacji, najpierw odpytywany jest endpoint, który zwraca informację o stanie zalogowania. Pliki sesyjne nie określają jednoznacznie daty ważności sesji gdyż jest ona przedłużana i zarządzana przez serwer.

```http
  POST /user/check
```

### Portfolio

Istotnym aspektem aplikacji jest prezentacja wybranych realizacji. Założeniem dotyczącym formy portfolio było to aby przypominało użytkownikowi odczucia związane z ergonomicznymi rozwiązanami oferowanymi przez popularne media społecznościowe.

![Portoflio](drone-enterprise-management-app-backend/storage/documentation-assets/portfolio.png)

Dla urządzeń o większym rozmiarze ekranu przewidziany jest podgląd posta w postaci slider/carousel.

![Post](drone-enterprise-management-app-backend/storage/documentation-assets/post.png)

Dla urządzeń o mniejszym rozmiarze ekranu uznawany za urządzenie mobilne przewidziany jest podgląd postów w formie poziomej, przewijanej galerii.

![Post mobile](drone-enterprise-management-app-backend/storage/documentation-assets/post-mobile.png)

W tym przypadku, wymagane jest aby post, który został wybrany w podglądzie znajdował się na początku Viewport. W tym celu zastosowano poniższą funkcję, która scrolluje do odpowiedniego elementu w galerii:

_preview-mobile.component.ts_:

```javascript
ngAfterViewInit(): void {
    const postId: string | null = this.route.snapshot.paramMap.get('post_id');

    if (postId) {
      this.postIdToPreview = +postId;

      const postToPreview = document.getElementById('item_' + this.postIdToPreview);

      if (postToPreview) {
        postToPreview.scrollIntoView({
          behavior: "instant",
          block: "start",
          inline: "nearest",
        });
      }
    }
  }
```

Posty będące krótkimi filmami powinny odtwarzać się i zatrzymywać automatycznie, tylko wtedy kiedy są w zasięgu viewport.

_onscroll-autoplay.directive.ts_:

```javascript
private observer: IntersectionObserver;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.initIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private initIntersectionObserver(): void {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video: HTMLVideoElement = this.el.nativeElement;
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      });
    });

    this.observer.observe(this.el.nativeElement);
  }
```

```html
<video
    onscrollAutoplay
    (pause)="isEditMode"
    controls
    loop
    *ngIf="!isImage(post.path)"
    [src]="post.path"
    [poster]="post.cover"
    alt="gallery-item"
    class="max-h-[80vh] w-auto object-contain"
></video>
```

Administrator jako uprawniony użytkownik ma wyłączne prawo do modyfikowania zawartości portfolio. Ma do dyspozycji utworzenie nowego posta, jego modyfikację lub usunięcie. Siłą rzeczy ma również dostęp do postów oznaczonych jako ukryte. W przypadku dodawania/edytowania posta w charakterze materiału video, responsywny formularz zadba o dodanie okładki do video.

![Dodawanie posta](drone-enterprise-management-app-backend/storage/documentation-assets/create.png)

![Edycja posta](drone-enterprise-management-app-backend/storage/documentation-assets/update.png)

### Panel użytkownika

Panel użytkownika skupia w sobie kluczowe funkcjonalności bezpośrednio związane ze zleceniami na wykonanie usługi.

Zakładka _Zlecenia_ umożliwia podgląd zleconych zamówień lub utworzenie nowego.

![Zakładka zlecenia](drone-enterprise-management-app-backend/storage/documentation-assets/orders.png)

Tworzenie nowego zlecenia powoduje otwarcie nowego okna. Formularz podzielony jest na kroki podawania odpowiednich danych, skupionych w _stepperze_.

_Szczegóły zlecenia_

Po kliknięciu przycisku DODAJ należy wybrać odpowiedni typ usługi. Następnie przechodzimy do pierwszego etapu formularza podając w nim rodzaj usługi. Responsywny formularz dba o to aby opcje dodatkowe takie jak podkład muzyczny czy generowanie dokumentacji z inspekcji pojawiły sie adekwatnie do wybranego typu usługi.
![Krok 1](drone-enterprise-management-app-backend/storage/documentation-assets/step1.png)

_Lokalizacja_

Lokalizacja wybierana jest na podstawie dodania markera do mapy, w tym wypadku komponentu Google Maps. Event związany z dodaniem markera odczytuje współrzędne geograficzne dodając je do danych formularza.

![Krok 2](drone-enterprise-management-app-backend/storage/documentation-assets/step2.png)

_Termin_

Istotnym parametrem zlecenia jest data realizacji. Spodziewaną datę można wybrać za pomocą komponentu Angulr Materials o nazwie _datepicker_. Co więcej, datepicker umożiwia filtrację dostępnych terminów w związku z tym, że przyjęto nie więcej niż jedno zlecenie dziennie.

![Krok 3](drone-enterprise-management-app-backend/storage/documentation-assets/step3.png)

_FV_

Część formularza związana z danymi rozliczeniowymi do zlecenia

![Krok 4](drone-enterprise-management-app-backend/storage/documentation-assets/step4.png)

_Podsumowanie_

Stawka za zlecenie obliczana jest na podstawie ilości jednostek rozliczeniowych i ceny za jednostę oraz szacowany koszt dojazdu. Koszt dojazdu obliczany jest za pomocą wspomnianej biblioteki Google Maps, która potrzebuje dwóch współrzędnych geograficznych oraz charakteru trasy (CAR).

![Krok 5](drone-enterprise-management-app-backend/storage/documentation-assets/step5.png)

Pomyślne złożenie zamówienia wiąże się z wysłaniem powiadomienia mailowego do administratora

![New Order Email](drone-enterprise-management-app-backend/storage/documentation-assets/new-order-email.png)

Na liście zleceń pojawiła się nowa publikacja, którą można wyświetlić pod kątem większej ilości danych:

![Order info](drone-enterprise-management-app-backend/storage/documentation-assets/order-info.png)

Administrator również z tego poziomu ma do dyspozycji funkcjonalność, która polega na zmianie aktualnego statusu zlecenia. W ten sposób użytkownik informowany jest o postępach w realizacji zlecenia.

![State Change](drone-enterprise-management-app-backend/storage/documentation-assets/change-status.png)

![State Change Dialog](drone-enterprise-management-app-backend/storage/documentation-assets/state-change-dialog.png)

Zmiana statusu widoczna jest z poziomu listy zleceń

![New Order State](drone-enterprise-management-app-backend/storage/documentation-assets/new-order-state.png)

Zostaje wysłane powiadomienie do klienta składającego zamówienie.

![Notification-sidebar](drone-enterprise-management-app-backend/storage/documentation-assets/notification.png)

Powiadomienie zostaje odczytane w momencie rozwiniecia elementu typu accordion co powoduje zaktualizowanie badge przy ikonie powiadomienia a samo powiadomienie uzyskuje status "seen". Poniżej podgląd powiadomienia tym razem w wersji mobile.

![Notification-mobile](drone-enterprise-management-app-backend/storage/documentation-assets/notification-mobile.png)

Równolegle do powiadomienia w aplikacji wysyłane jest powiadomienie mailowe:

![New State Email](drone-enterprise-management-app-backend/storage/documentation-assets/new-order-state-email.png)

### Formularz kontaktowy

Aplikacja umożliwia skontaktowanie się z administratorem przez niezarejestrowanego użytkownika za pomoca formularza kontaktowego. Otrzymanie wiadomości jest równoznaczne z wysłaniem przez serwer do administratora wiadomości mailowej zawierającej dane pozostawione przez nadawcę.

![Contact](drone-enterprise-management-app-backend/storage/documentation-assets/contact.png)

## Konfiguracja

### Frontend

SPA powinna zawierać plik environment.ts zlokalizowany w folderze src/environments

_src/environents/environment.ts_

```javascript
export const environment = {
    production: false,
    googleMapsApiKey: "YOUR_API_KEY",
    origin: {
        lat: "YOUR_STARTPOINT_LATITUDE (FLOAT)",
        lng: "YOUR_STARTPOINT_LONGITUDE (FLOAT)",
    },
    kilometreage: "KILOMETRAGE (FLOAT)",
};
```

| Zmienna          | Opis                                              |
| ---------------- | ------------------------------------------------- |
| googleMapsApiKey | Twój indywidualny Google Maps API_KEY             |
| origin (lat)     | Szerokość geograficzna Twojego miejsca startowego |
| origin (lng)     | Długość geograficzna Twojego miejsca startowego   |
| kilometrage      | Cena przejazdu w odnieseniu do kilometra          |

### Backend

_.env_

```
APP_ADDRESS=http://127.0.0.1:8000

DB_CONNECTION=pgsql
DB_DATABASE=drone-management-app-db

FILESYSTEM_DISK=local
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:4200
SESSION_SECURE_COOKIE=true

FRONTEND_URL= *YOUR_FRONTEND_ADDRESS*

MAIL_MAILER= *YOUR_EMAIL_PROTOCOL*
MAIL_HOST= *YOUR_EMAIL_PROTOCOL_HOST*
MAIL_PORT= *YOUR_MAILER_PORT*
MAIL_USERNAME= *YOUR_EMAIL_ADDRESS*
MAIL_PASSWORD= *YOUR_MAILER_PASSWORD*
MAIL_ENCRYPTION= *YOUR_MAIL_ENCRYPTION*
MAIL_FROM_ADDRESS= *YOUR_MAIL_FROM_ADDRESS*
MAIL_FROM_NAME= *YOUR_MAIL_SERVICE_NAME*
```

_php.ini_

W przypadku pliku _php.ini_ należy pamiętać o odpowiednich sterownikach baz danych, czyli pgssql oraz sqlite(testy) jak również maksymalny rozmiar przesyłanych plików przez request (zalecane 10MB) oraz bibliotekę _gd_ niezbędną do generowania przykładowych obrazów wykorzystywanych w testach.

## Testy

Aplikacja pokryta jest testami funkcjonalnymi w zakresie endpointów REST API oraz testem komponentu w zakresie komponentu logowania jako przykładowy test.

Aplikacja korzysta z technologii **_PHPUnit_** po stronie backendu oraz biblioteki **_Cypress_** w zakresie frontendu.

Uruchamianie testów po stronie backendu

```
php artisan config:clear (jeżeli istnieje plik konfiguracyjny cache)

php artisan test
```

Uruchamianie testów po stronie frontendu

```
npx cypress open
```

## Roadmap

Aplikacja ma charakter rozwojowy. Wymagane jest jeszcze kilka kroków zanim aplikacja osiągnie status _użyta komeryjnie_

-   Wdrożenie
-   Implementacja systemu płatności internetowych
-   Integracja z Google Ads, Google Analytics oraz Google Push Notifications
-   Implementacja checklisty przed zleceniem, generowanie raportu z inspekcji, generowanie INOP (Instrukcja Operacyjna)
-   Poprawa efektywności i pozycjonowania

## Licencja

Wszystkie prawa są zastrzeżone. Dozwolone jest uruchamianie projektu w celach rekrutacyjnych oraz weryfikacyjnych.

## Autor

Szymon Słomiński [@5l0m1n5ky](https://github.com/5l0m1n5ky)

## Przypisy

Część użytych multimediów pochodzi z:

-   https://www.pexels.com/pl-pl/zdjecie/aparat-dslr-martwa-natura-gimbal-7443438/
-   https://www.pexels.com/pl-pl/zdjecie/zblizenie-zdjecia-migawki-aparatu-414781/
-   https://pixabay.com/pl/users/ln_photoart-2780243/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3198324" by Lars Nissen
-   https://pixabay.com/pl/users/paymaster_ukraine-27640709/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=7224727 by Eduard Skorov
-   https://pixabay.com/pl/users/vale_photography-13626041/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=4923366 by Valentin J-W
-   https://unsplash.com/@markusspiske?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash by Markus Spiske

-   https://www.pexels.com/pl-pl/zdjecie/pole-srodowisko-elektrycznosc-energia-odnawialna-16586163/ by Diego Vivanco
-   https://www.pexels.com/pl-pl/zdjecie/czarny-aparat-fotograficzny-w-skali-szarosci-2050720/ by Tembela Bohle
-   https://www.pexels.com/pl-pl/video/dach-zielony-trzymajacy-samochod-sportowy-16000242/ by paashu
-   https://www.pexels.com/pl-pl/video/zaglowa-lodz-rybacka-2257010/ by Kelly
-   https://www.pexels.com/pl-pl/zdjecie/brown-electricity-post-230518/ by Miguel Á. Padriñán
-   https://www.pexels.com/pl-pl/zdjecie/bialy-wiatrak-z-trzema-ostrzami-pod-zachmurzonym-niebem-744344/ by Expect Best
-   https://www.pexels.com/pl-pl/zdjecie/trzy-szare-turbiny-wiatrowe-243138/ by Sam Forson
-   https://pixabay.com/pl/users/paulbr75-2938186/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2871079 by Paul Brennan
-   https://icons8.com/icon/87/heart icon by Icons8

