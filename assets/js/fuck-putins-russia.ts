const userLocale = navigator.languages && navigator.languages.length? navigator.languages[0] : navigator.language;

const russia = "ru_RU";

if (userLocale === russia) {
  alert("Остановить войну. Спасите Украину. Покончить с путинским режимом.");
  const hasBeenRedirected = !!window.sessionStorage.getItem(russia);
  
  if (!hasBeenRedirected) {
    window.sessionStorage.setItem(russia, "1");
    window.location.href = "https://en.wikipedia.org/wiki/War_crimes_in_the_2022_Russian_invasion_of_Ukraine";
  }
}
