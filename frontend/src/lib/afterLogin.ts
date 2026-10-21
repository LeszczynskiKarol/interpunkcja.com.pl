// frontend/src/lib/afterLogin.ts
// Zapamiętuje stronę panelu, na którą użytkownik chciał wejść przed zalogowaniem
// (np. /panel/dokumenty z landingu korekty pracy). sessionStorage przeżywa
// przekierowanie przez Google OAuth, w przeciwieństwie do stanu routera.
const KEY = "interpunkcja-after-login";
const ALLOWED = /^\/(panel|konto|historia)(\/|$|\?)/;

export function rememberAfterLogin(path: string) {
  try {
    if (ALLOWED.test(path)) sessionStorage.setItem(KEY, path);
  } catch {
    // brak dostępu do sessionStorage - zostaje domyślny /panel
  }
}

export function takeAfterLogin(): string {
  try {
    const path = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (path && ALLOWED.test(path)) return path;
  } catch {
    // jw.
  }
  return "/panel";
}
