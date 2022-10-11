const userLocale = navigator.languages && navigator.languages.length? navigator.languages[0] : navigator.language;

if (userLocale === "ru_RU") {
  alert("Остановить войну. Спасите Украину. Покончить с путинским режимом.");
  window.location.href = "https://en.wikipedia.org/wiki/War_crimes_in_the_2022_Russian_invasion_of_Ukraine";
}
