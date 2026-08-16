import { useRef, useState } from "react";
import { useLingui } from "@lingui/react";
import { activateLocale, getInitialLocale, normalizeLocale } from "../../i18n";
import useClickOutside from "../../hooks/useClickOutside";

function FlagES() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true">
      <rect width="20" height="14" fill="#AA151B" />
      <rect y="3.5" width="20" height="7" fill="#F1BF00" />
    </svg>
  );
}

function FlagUS() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true">
      <rect width="20" height="14" fill="#B22234" />
      <rect y="1.08" width="20" height="1.08" fill="#fff" />
      <rect y="3.23" width="20" height="1.08" fill="#fff" />
      <rect y="5.38" width="20" height="1.08" fill="#fff" />
      <rect y="7.54" width="20" height="1.08" fill="#fff" />
      <rect y="9.69" width="20" height="1.08" fill="#fff" />
      <rect y="11.85" width="20" height="1.08" fill="#fff" />
      <rect width="9" height="7.54" fill="#3C3B6E" />
    </svg>
  );
}

function FlagFR() {
  return (
    <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true">
      <rect width="6.67" height="14" fill="#0055A4" />
      <rect x="6.67" width="6.67" height="14" fill="#fff" />
      <rect x="13.33" width="6.67" height="14" fill="#EF4135" />
    </svg>
  );
}

const LANGUAGES = [
  { code: "es", label: "ES", Flag: FlagES },
  { code: "en", label: "EN", Flag: FlagUS },
  { code: "fr", label: "FR", Flag: FlagFR },
];

function LanguageSelector() {
  const { i18n } = useLingui();
  const t = (id, message) => i18n._({ id, message });
  const locale = normalizeLocale(i18n?.locale || getInitialLocale());
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useClickOutside(wrapperRef, () => setOpen(false), open);

  const handleChange = async (newLocale) => {
    setOpen(false);
    await activateLocale(normalizeLocale(newLocale));
  };

  const current = LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[0];

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 min-[2560px]:gap-3 min-[3840px]:gap-4 bg-card-bg text-text border border-snd-bg rounded-full px-3 py-2 min-[2560px]:px-5 min-[2560px]:py-3 min-[3840px]:px-7 min-[3840px]:py-5 text-sm min-[2560px]:text-xl min-[3840px]:text-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 focus-visible:ring-offset-bg hover:border-main transition"
        aria-label={t("common.selectLanguage", "Select language")}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <current.Flag /> {current.label}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-[2560px]:mt-3 w-32 min-[2560px]:w-44 min-[3840px]:w-60 bg-card-bg text-text rounded-xl min-[2560px]:rounded-2xl shadow-lg p-2 min-[2560px]:p-3 z-[1300] transition-colors duration-300">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleChange(lang.code)}
              className={`w-full flex items-center gap-2 min-[2560px]:gap-3 px-2 py-1.5 min-[2560px]:px-3 min-[2560px]:py-2.5 min-[3840px]:px-4 min-[3840px]:py-3.5 rounded-lg min-[2560px]:rounded-xl text-sm min-[2560px]:text-lg min-[3840px]:text-2xl font-semibold transition ${
                lang.code === locale ? "bg-main/10 text-main" : "hover:bg-snd-bg"
              }`}
            >
              <lang.Flag /> {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
