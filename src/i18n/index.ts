import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enCommon from "../locales/en/common.json";
import { isRtl } from "./languages";

export const DEFAULT_LANGUAGE = "en";
export const STORAGE_KEY = "didi_direct_language";

// Vite's import.meta.glob creates dynamic import chunks for each locale
const localeLoaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> =
  typeof import.meta.glob === "function"
    ? import.meta.glob("../locales/*/common.json")
    : {};

function applyHtmlAttributes(lng: string) {
  if (typeof document === "undefined") return;
  const rtl = isRtl(lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = rtl ? "rtl" : "ltr";
}

export async function loadLanguage(lng: string): Promise<void> {
  if (i18n.hasResourceBundle(lng, "translation")) {
    await i18n.changeLanguage(lng);
    applyHtmlAttributes(lng);
    return;
  }

  // Attempt to load locale JSON chunk
  const path = `../locales/${lng}/common.json`;
  const loader = localeLoaders[path];

  if (loader) {
    try {
      const module = await loader();
      i18n.addResourceBundle(lng, "translation", module.default, true, true);
    } catch (err) {
      console.warn(`[i18n] Failed to load locale ${lng}, falling back to English:`, err);
    }
  } else {
    // If not found, try base language (e.g. "zh" for "zh-CN")
    const base = lng.split("-")[0];
    const basePath = `../locales/${base}/common.json`;
    if (localeLoaders[basePath]) {
      try {
        const module = await localeLoaders[basePath]();
        i18n.addResourceBundle(lng, "translation", module.default, true, true);
      } catch (err) {
        console.warn(`[i18n] Failed to load base locale ${base}:`, err);
      }
    }
  }

  await i18n.changeLanguage(lng);
  applyHtmlAttributes(lng);
}

// Initialise i18next
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: enCommon,
        },
      },
      fallbackLng: DEFAULT_LANGUAGE,
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: STORAGE_KEY,
        caches: ["localStorage"],
      },
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      missingKeyHandler: (lngs, ns, key) => {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[i18n] Missing translation key: "${key}" for languages:`, lngs);
        }
      },
      returnNull: false,
    });

  // Apply initial HTML attributes
  const initialLng = i18n.language || DEFAULT_LANGUAGE;
  applyHtmlAttributes(initialLng);

  // If initial language is not English, trigger lazy load
  if (initialLng !== "en") {
    void loadLanguage(initialLng);
  }

  i18n.on("languageChanged", (lng) => {
    applyHtmlAttributes(lng);
  });
}

export default i18n;
