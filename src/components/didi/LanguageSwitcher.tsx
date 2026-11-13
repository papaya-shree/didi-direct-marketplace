import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Search, Check, X } from "lucide-react";
import { LANGUAGES, type LanguageInfo } from "@/i18n/languages";
import { loadLanguage } from "@/i18n";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const currentLang = i18n.language || "en";

  const currentInfo = useMemo(() => {
    return (
      LANGUAGES.find((l) => l.code === currentLang) ||
      LANGUAGES.find((l) => l.code === currentLang.split("-")[0]) ||
      LANGUAGES[0]
    );
  }, [currentLang]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [search]);

  const tier1 = useMemo(() => filtered.filter((l) => l.tier === 1), [filtered]);
  const tier2 = useMemo(() => filtered.filter((l) => l.tier === 2), [filtered]);
  const tier3 = useMemo(() => filtered.filter((l) => l.tier === 3), [filtered]);

  const handleSelect = async (code: string) => {
    await loadLanguage(code);
    setOpen(false);
    setSearch("");
  };

  const renderGroup = (title: string, list: LanguageInfo[], showBadge = false) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-4">
        <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <div className="mt-1 space-y-0.5">
          {list.map((lang) => {
            const isSelected =
              currentLang === lang.code || currentLang.startsWith(lang.code + "-");
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-start text-sm transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    {lang.nativeName}{" "}
                    <span
                      className={`text-xs ${
                        isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      ({lang.name})
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {showBadge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted-foreground/10 text-muted-foreground"
                      }`}
                    >
                      {t("language.machineTranslated")}
                    </span>
                  )}
                  {isSelected && <Check className="h-4 w-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t("language.switcherLabel")}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-slate-300 transition-colors"
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium">{currentInfo.nativeName}</span>
        <span className="text-muted-foreground">({currentInfo.name})</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-3 sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("language.switcherLabel")}
            className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-slate-200 bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-terracotta" />
                <h3 className="font-semibold text-foreground">
                  {t("language.switcherLabel")}
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={t("common.close")}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="border-b border-slate-200 p-3">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("language.searchPlaceholder")}
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 bg-background ps-9 pe-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Language Lists */}
            <div className="flex-1 overflow-y-auto p-3">
              {renderGroup(t("language.tier1"), tier1)}
              {renderGroup(t("language.tier2"), tier2)}
              {renderGroup(t("language.tier3"), tier3, true)}

              {filtered.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No languages match "{search}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

