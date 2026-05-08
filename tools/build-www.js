#!/usr/bin/env node
/*
 * Copie les fichiers web statiques dans www/ pour Capacitor.
 * Utilisé par `npm run build`. Pas de bundler : on copie tel quel.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT  = path.join(ROOT, "www");

const ENTRIES = [
  "index.html",
  "privacy.html",
  "styles.css",
  "app.js",
  "data.js",
  "manifest.webmanifest",
  "sw.js",
  "icons",
];

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  fs.rmSync(p, { recursive: true, force: true });
}

function copy(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copy(path.join(src, name), path.join(dst, name));
    }
  } else {
    fs.copyFileSync(src, dst);
  }
}

console.log(`→ build www/ depuis ${ROOT}`);
rmrf(OUT);
fs.mkdirSync(OUT, { recursive: true });

for (const entry of ENTRIES) {
  const src = path.join(ROOT, entry);
  const dst = path.join(OUT, entry);
  if (!fs.existsSync(src)) {
    console.warn(`  · ignoré (absent) : ${entry}`);
    continue;
  }
  copy(src, dst);
  console.log(`  ✓ ${entry}`);
}

console.log(`✓ www/ prêt — utilisable par Capacitor (webDir).`);
