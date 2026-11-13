export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  tier: 1 | 2 | 3;
  dir: "ltr" | "rtl";
  speechCode: string | null; // Web Speech API BCP-47 tag if supported
  reviewed: boolean;
}

export const RTL_LANGUAGES = new Set(["ar", "ur", "fa", "he", "sd", "ks", "ps", "ug", "yi"]);

export function isRtl(code: string): boolean {
  const base = code.split("-")[0].toLowerCase();
  return RTL_LANGUAGES.has(base);
}

export const LANGUAGES: LanguageInfo[] = [
  // Tier 1: Indian Languages
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", tier: 1, dir: "ltr", speechCode: "hi-IN", reviewed: true },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", tier: 1, dir: "ltr", speechCode: "bn-IN", reviewed: false },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", tier: 1, dir: "ltr", speechCode: "te-IN", reviewed: false },
  { code: "mr", name: "Marathi", nativeName: "मराठी", tier: 1, dir: "ltr", speechCode: "mr-IN", reviewed: false },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", tier: 1, dir: "ltr", speechCode: "ta-IN", reviewed: false },
  { code: "ur", name: "Urdu", nativeName: "اردو", tier: 1, dir: "rtl", speechCode: "ur-IN", reviewed: false },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", tier: 1, dir: "ltr", speechCode: "gu-IN", reviewed: false },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", tier: 1, dir: "ltr", speechCode: "kn-IN", reviewed: false },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", tier: 1, dir: "ltr", speechCode: null, reviewed: false },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", tier: 1, dir: "ltr", speechCode: "ml-IN", reviewed: false },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", tier: 1, dir: "ltr", speechCode: "pa-Guru-IN", reviewed: false },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", tier: 1, dir: "ltr", speechCode: null, reviewed: false },
  { code: "mai", name: "Maithili", nativeName: "मैथिली", tier: 1, dir: "ltr", speechCode: null, reviewed: false },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", tier: 1, dir: "ltr", speechCode: "ne-NP", reviewed: false },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", tier: 1, dir: "rtl", speechCode: null, reviewed: false },
  { code: "gom", name: "Konkani", nativeName: "कोंकणी", tier: 1, dir: "ltr", speechCode: null, reviewed: false },
  { code: "doi", name: "Dogri", nativeName: "डोगरी", tier: 1, dir: "ltr", speechCode: null, reviewed: false },
  { code: "mni", name: "Manipuri (Meitei)", nativeName: "ꯃꯤꯇꯩꯂꯣꯟ", tier: 1, dir: "ltr", speechCode: null, reviewed: false },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", tier: 1, dir: "ltr", speechCode: null, reviewed: false },
  { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ", tier: 1, dir: "ltr", speechCode: null, reviewed: false },
  { code: "ks", name: "Kashmiri", nativeName: "کٲشُر", tier: 1, dir: "rtl", speechCode: null, reviewed: false },
  { code: "brx", name: "Bodo", nativeName: "बड़ो", tier: 1, dir: "ltr", speechCode: null, reviewed: false },
  { code: "bho", name: "Bhojpuri", nativeName: "भोजपुरी", tier: 1, dir: "ltr", speechCode: null, reviewed: false },
  { code: "lus", name: "Mizo", nativeName: "Mizo ṭawng", tier: 1, dir: "ltr", speechCode: null, reviewed: false },

  // Tier 2: Global Buyer Languages
  { code: "en", name: "English", nativeName: "English", tier: 2, dir: "ltr", speechCode: "en-US", reviewed: true },
  { code: "es", name: "Spanish", nativeName: "Español", tier: 2, dir: "ltr", speechCode: "es-ES", reviewed: false },
  { code: "fr", name: "French", nativeName: "Français", tier: 2, dir: "ltr", speechCode: "fr-FR", reviewed: false },
  { code: "de", name: "German", nativeName: "Deutsch", tier: 2, dir: "ltr", speechCode: "de-DE", reviewed: false },
  { code: "pt", name: "Portuguese", nativeName: "Português", tier: 2, dir: "ltr", speechCode: "pt-BR", reviewed: false },
  { code: "it", name: "Italian", nativeName: "Italiano", tier: 2, dir: "ltr", speechCode: "it-IT", reviewed: false },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", tier: 2, dir: "ltr", speechCode: "nl-NL", reviewed: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", tier: 2, dir: "rtl", speechCode: "ar-SA", reviewed: false },
  { code: "ja", name: "Japanese", nativeName: "日本語", tier: 2, dir: "ltr", speechCode: "ja-JP", reviewed: false },
  { code: "ko", name: "Korean", nativeName: "한국어", tier: 2, dir: "ltr", speechCode: "ko-KR", reviewed: false },
  { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "简体中文", tier: 2, dir: "ltr", speechCode: "zh-CN", reviewed: false },
  { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "繁體中文", tier: 2, dir: "ltr", speechCode: "zh-TW", reviewed: false },
  { code: "ru", name: "Russian", nativeName: "Русский", tier: 2, dir: "ltr", speechCode: "ru-RU", reviewed: false },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", tier: 2, dir: "ltr", speechCode: "tr-TR", reviewed: false },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", tier: 2, dir: "ltr", speechCode: "id-ID", reviewed: false },
  { code: "th", name: "Thai", nativeName: "ไทย", tier: 2, dir: "ltr", speechCode: "th-TH", reviewed: false },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", tier: 2, dir: "ltr", speechCode: "vi-VN", reviewed: false },

  // Tier 3: Long tail (marked machine translated)
  { code: "pl", name: "Polish", nativeName: "Polski", tier: 3, dir: "ltr", speechCode: "pl-PL", reviewed: false },
  { code: "sv", name: "Swedish", nativeName: "Svenska", tier: 3, dir: "ltr", speechCode: "sv-SE", reviewed: false },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", tier: 3, dir: "ltr", speechCode: "el-GR", reviewed: false },
  { code: "cs", name: "Czech", nativeName: "Čeština", tier: 3, dir: "ltr", speechCode: "cs-CZ", reviewed: false },
  { code: "ro", name: "Romanian", nativeName: "Română", tier: 3, dir: "ltr", speechCode: "ro-RO", reviewed: false },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", tier: 3, dir: "ltr", speechCode: "hu-HU", reviewed: false },
  { code: "he", name: "Hebrew", nativeName: "עברית", tier: 3, dir: "rtl", speechCode: "he-IL", reviewed: false },
  { code: "fa", name: "Persian", nativeName: "فارسی", tier: 3, dir: "rtl", speechCode: "fa-IR", reviewed: false },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", tier: 3, dir: "ltr", speechCode: "sw-TZ", reviewed: false },
  { code: "fi", name: "Finnish", nativeName: "Suomi", tier: 3, dir: "ltr", speechCode: "fi-FI", reviewed: false },
  { code: "da", name: "Danish", nativeName: "Dansk", tier: 3, dir: "ltr", speechCode: "da-DK", reviewed: false },
  { code: "no", name: "Norwegian", nativeName: "Norsk", tier: 3, dir: "ltr", speechCode: "nb-NO", reviewed: false },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", tier: 3, dir: "ltr", speechCode: "uk-UA", reviewed: false },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", tier: 3, dir: "ltr", speechCode: "ms-MY", reviewed: false },
  { code: "fil", name: "Filipino (Tagalog)", nativeName: "Tagalog", tier: 3, dir: "ltr", speechCode: "fil-PH", reviewed: false },

  // Pseudo-locale for i18n testing & overflow checks
  { code: "en-XA", name: "Pseudo-locale", nativeName: "[!!! Ƥşéûḓô-ľôćáľé !!!]", tier: 3, dir: "ltr", speechCode: null, reviewed: true }
];

export const LANGUAGE_MAP = new Map<string, LanguageInfo>(
  LANGUAGES.map((l) => [l.code, l])
);

export function getLanguage(code: string): LanguageInfo {
  return LANGUAGE_MAP.get(code) || LANGUAGE_MAP.get(code.split("-")[0]) || LANGUAGES[0];
}

