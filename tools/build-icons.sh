#!/usr/bin/env bash
# Génère les PNG d'icônes attendus par le manifeste à partir des SVG.
# Détecte automatiquement rsvg-convert, ImageMagick, Inkscape ou sharp (npx).
set -euo pipefail

cd "$(dirname "$0")/.."
DEST=icons

render() {
  local src="$1" dst="$2" size="$3"
  if command -v rsvg-convert >/dev/null; then
    rsvg-convert -w "$size" -h "$size" "$src" -o "$dst"
  elif command -v magick >/dev/null; then
    magick -background none -resize "${size}x${size}" "$src" "$dst"
  elif command -v convert >/dev/null; then
    convert -background none -resize "${size}x${size}" "$src" "$dst"
  elif command -v inkscape >/dev/null; then
    inkscape "$src" --export-type=png --export-filename="$dst" -w "$size" -h "$size"
  elif command -v npx >/dev/null; then
    npx --yes sharp-cli -i "$src" -o "$dst" resize "$size" "$size"
  else
    echo "Aucun outil de rendu SVG trouvé." >&2
    echo "Installez un de : librsvg2-bin / imagemagick / inkscape / node+npx" >&2
    exit 1
  fi
}

render "$DEST/icon.svg"          "$DEST/icon-192.png"          192
render "$DEST/icon.svg"          "$DEST/icon-512.png"          512
render "$DEST/icon-maskable.svg" "$DEST/icon-maskable-192.png" 192
render "$DEST/icon-maskable.svg" "$DEST/icon-maskable-512.png" 512

# Captures recommandées Play Store : carré 1024 (icône haute résolution)
render "$DEST/icon.svg" "$DEST/icon-1024.png" 1024

echo "Icônes générées :"
ls -1 "$DEST"/*.png
