import type { Tool } from "../types";

const HASH_KEY = "toolkit";

/** Unicode-safe base64url encode. */
function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Unicode-safe base64url decode. */
function fromBase64Url(b64: string): string {
  const padded = b64.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(padded);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Build a shareable URL that encodes the toolkit in the location hash. */
export function buildShareUrl(items: Tool[]): string {
  const encoded = toBase64Url(JSON.stringify(items));
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#${HASH_KEY}=${encoded}`;
}

/** Parse a shared toolkit from the current URL hash, if present. */
export function parseSharedToolkit(): Tool[] | null {
  const hash = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);
  const encoded = params.get(HASH_KEY);
  if (!encoded) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(encoded));
    if (!Array.isArray(parsed)) return null;
    return parsed as Tool[];
  } catch {
    return null;
  }
}

/** Remove the toolkit param from the URL without reloading. */
export function clearSharedToolkit(): void {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

/** Copy text to clipboard, falling back to a temporary textarea. */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}
