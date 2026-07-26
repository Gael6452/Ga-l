import type { Strings } from "../i18n";
import type { WeightsState } from "../hooks/useWeights";
import type { Weights } from "../types";

interface Props {
  t: Strings;
  state: WeightsState;
}

export function WeightsControl({ t, state }: Props) {
  const { weights, setAxis, reset } = state;

  const axes: Array<{ key: keyof Weights; label: string }> = [
    { key: "effectiveness", label: t.effectiveness },
    { key: "cost", label: t.cost },
    { key: "safety", label: t.safety },
  ];

  return (
    <section className="card weights">
      <div className="weights-head">
        <div>
          <h2 className="weights-title">{t.priorities}</h2>
          <p className="weights-hint">{t.prioritiesHint}</p>
        </div>
        <button type="button" className="chip" onClick={reset}>
          {t.reset}
        </button>
      </div>

      <div className="weights-sliders">
        {axes.map(({ key, label }) => (
          <label key={key} className="weight-row">
            <span className="weight-label">{label}</span>
            <input
              type="range"
              min={0}
              max={5}
              step={1}
              value={weights[key]}
              onChange={(e) => setAxis(key, Number(e.target.value))}
              aria-label={label}
            />
            <span className="weight-value">{weights[key]}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
