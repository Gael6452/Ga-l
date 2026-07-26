import type { Strings } from "../i18n";

export function Hero({ t }: { t: Strings }) {
  return (
    <section className="hero">
      <h1 className="hero-title">
        {t.heroTitle1}
        <br />
        <span className="accent">{t.heroTitle2}</span>
      </h1>
      <p className="hero-subtitle">{t.heroSubtitle}</p>
    </section>
  );
}
