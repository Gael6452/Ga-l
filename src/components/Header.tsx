import type { Lang } from "../i18n";
import type { Theme } from "../hooks/useTheme";
import { CompassIcon, FolderIcon, MoonIcon, SunIcon } from "./icons";

interface Props {
  lang: Lang;
  onToggleLang: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  collectionCount: number;
  onOpenCollection: () => void;
}

export function Header({
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  collectionCount,
  onOpenCollection,
}: Props) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-logo">
          <CompassIcon className="icon" />
        </span>
        <span className="brand-name">AI Scout</span>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="chip folder-btn"
          onClick={onOpenCollection}
          aria-label="Open my toolkit"
        >
          <FolderIcon className="icon" />
          {collectionCount > 0 && <span className="badge">{collectionCount}</span>}
        </button>
        <button
          type="button"
          className="chip"
          onClick={onToggleLang}
          aria-label="Toggle language"
        >
          {lang === "en" ? "🇺🇸 EN" : "🇫🇷 FR"}
        </button>
        <button
          type="button"
          className="chip icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <SunIcon className="icon" /> : <MoonIcon className="icon" />}
        </button>
      </div>
    </header>
  );
}
