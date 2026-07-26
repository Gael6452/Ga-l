import { useState } from "react";
import type { Strings } from "../i18n";
import type { Collection } from "../hooks/useCollection";
import type { Tool } from "../types";
import { buildShareUrl, copyToClipboard } from "../services/share";
import type { Weights } from "../types";
import { ToolCard } from "./ToolCard";

interface Props {
  t: Strings;
  collection: Collection;
  onClose: () => void;
  weights: Weights;
}

function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withScheme).toString();
  } catch {
    return null;
  }
}

export function CollectionPanel({ t, collection, onClose, weights }: Props) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleShare() {
    if (collection.items.length === 0) {
      setNotice(t.shareEmpty);
      return;
    }
    const shareUrl = buildShareUrl(collection.items);
    try {
      if (navigator.share) {
        await navigator.share({ title: t.myToolkit, url: shareUrl });
        return;
      }
    } catch {
      // user cancelled the native share sheet — fall through to copy
    }
    await copyToClipboard(shareUrl);
    setNotice(t.linkCopied);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    if (!name.trim() || !normalized) {
      setError(t.invalidCustom);
      return;
    }
    const custom: Tool = {
      id: `custom-${normalized}`,
      name: name.trim(),
      tagline: "",
      howTo: "",
      url: normalized,
      category: category.trim() || "Custom",
      scores: { effectiveness: 0, cost: 0, safety: 0 },
      tags: [],
    };
    collection.add(custom);
    setName("");
    setUrl("");
    setCategory("");
    setError("");
  }

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2>{t.myToolkit} ({collection.items.length})</h2>
          <div className="drawer-head-actions">
            <button type="button" className="chip" onClick={handleShare}>
              ↗ {t.share}
            </button>
            <button type="button" className="chip icon-btn" onClick={onClose} aria-label={t.close}>
              ✕
            </button>
          </div>
        </div>

        {notice && <p className="notice">{notice}</p>}

        <form className="card custom-form" onSubmit={handleAdd}>
          <h3 className="custom-title">{t.addCustomTitle}</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.toolName}
          />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.toolUrl}
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder={t.toolCategory}
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">
            {t.add}
          </button>
        </form>

        {collection.items.length === 0 ? (
          <p className="empty">{t.collectionEmpty}</p>
        ) : (
          <div className="drawer-list">
            {collection.items.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                t={t}
                saved
                onToggleSave={() => {}}
                onRemove={collection.remove}
                weights={weights}
              />
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
