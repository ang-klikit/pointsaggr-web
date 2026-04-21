import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      id: { translation: id },
    },
    // App is Jakarta-only; default to id-ID regardless of browser locale.
    // Users can still switch to English from the profile screen, and the
    // choice is persisted in localStorage.
    fallbackLng: 'id-ID',
    supportedLngs: ['en', 'id', 'id-ID'],
    // `load: 'languageOnly'` makes i18next look up the `id` resource when
    // the active language is `id-ID`, so we don't have to duplicate files.
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      // Intentionally drops `navigator` — we don't want a user on an
      // English-locale phone to see the app in English by default.
      // Storage key is `:v2` because `:v1` was auto-populated with 'en'
      // back when fallback was 'en' + navigator was in detection order;
      // bumping invalidates those stale caches so id-ID actually wins.
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mypoints:lang:v2',
    },
  });

export default i18n;
