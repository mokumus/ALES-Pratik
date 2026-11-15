import { useEffect, useState, type ReactNode } from "react";
import { applyTheme, readTheme, type Theme } from "../lib/store";
import type { View } from "../lib/router";
import { questions } from "../data";

const NAV: { view: View; href: string; label: string; short: string }[] = [
  { view: "home", href: "#/", label: "Ana Sayfa", short: "Ana" },
  { view: "practice", href: "#/calis", label: "Çalış", short: "Çalış" },
  { view: "bank", href: "#/sorular", label: "Soru Bankası", short: "Bank" },
];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
    </svg>
  );
}

export default function Layout({ view, children }: { view: View; children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => readTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="#/" aria-label="ALES Pratik ana sayfa">
          <span className="brand__mark">A</span>
          <span className="brand__text">
            <strong>ALES</strong>
            <span>Pratik</span>
          </span>
        </a>

        <nav className="nav" aria-label="Ana menü">
          {NAV.map((item) => (
            <a
              key={item.view}
              href={item.href}
              className={`nav__link${view === item.view ? " is-active" : ""}`}
              aria-current={view === item.view ? "page" : undefined}
            >
              <span className="nav__full">{item.label}</span>
              <span className="nav__short">{item.short}</span>
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="iconbtn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Aydınlık temaya geç" : "Karanlık temaya geç"}
          title={theme === "dark" ? "Aydınlık tema" : "Karanlık tema"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </header>

      <main className="main">{children}</main>

      <footer className="footer">
        <div className="footer__left">
          <strong>ALES Pratik</strong>
          <span>{questions.length} soru · {new Set(questions.map((q) => `${q.year}-${q.session}`)).size} sınav dönemi</span>
        </div>
        <p className="footer__note">
          Bağımsız bir çalışma aracıdır; ÖSYM ile bağlantılı değildir. Soruların kaynağı için{" "}
          <a href="#/sorular">soru bankası</a> sayfasındaki bilgi notuna bakın.
        </p>
      </footer>
    </div>
  );
}
