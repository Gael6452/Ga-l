import { useState } from "react";
import type { Strings } from "../i18n";
import type { ProfileInput } from "../types";
import { ArrowRightIcon, BriefcaseIcon, TargetIcon } from "./icons";

interface Props {
  t: Strings;
  loading: boolean;
  onSubmit: (profile: ProfileInput) => void;
}

export function ScoutForm({ t, loading, onSubmit }: Props) {
  const [currentStatus, setCurrentStatus] = useState("");
  const [expectedPosition, setExpectedPosition] = useState("");
  const [dreamJob, setDreamJob] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentStatus.trim() && !expectedPosition.trim()) {
      setError(t.emptyStatusError);
      return;
    }
    setError("");
    onSubmit({
      currentStatus: currentStatus.trim(),
      expectedPosition: expectedPosition.trim(),
      dreamJob: dreamJob.trim(),
    });
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field-icon"><BriefcaseIcon className="icon" /></span>
        <span className="field-body">
          <span className="field-label">{t.currentStatus}</span>
          <input
            type="text"
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value)}
            placeholder={t.currentStatusPlaceholder}
          />
        </span>
      </label>

      <label className="field">
        <span className="field-icon"><ArrowRightIcon className="icon" /></span>
        <span className="field-body">
          <span className="field-label">{t.expectedPosition}</span>
          <input
            type="text"
            value={expectedPosition}
            onChange={(e) => setExpectedPosition(e.target.value)}
            placeholder={t.expectedPositionPlaceholder}
          />
        </span>
      </label>

      <label className="field">
        <span className="field-icon"><TargetIcon className="icon" /></span>
        <span className="field-body">
          <span className="field-label">{t.dreamJob}</span>
          <input
            type="text"
            value={dreamJob}
            onChange={(e) => setDreamJob(e.target.value)}
            placeholder={t.dreamJobPlaceholder}
          />
        </span>
      </label>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? t.submitting : t.submit}
      </button>
    </form>
  );
}
