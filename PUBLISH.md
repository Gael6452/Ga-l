# Publier TrioInclusion sur le Play Store

L'app est un site web. Pour la mettre sur le Play Store, on l'empaquette
en **TWA** (Trusted Web Activity) avec **Bubblewrap** : Android ouvre le
site en plein écran, sans barre d'URL, et c'est exactement la même app.

## 1. Héberger le site

Choisissez un hébergeur statique gratuit :

- **Netlify** : `netlify deploy --prod` après `npm i -g netlify-cli`
- **Vercel** : `vercel --prod` après `npm i -g vercel`
- **GitHub Pages** : push sur `main`, activer Pages dans les réglages

Vérifiez ensuite que :

- Le site répond en **HTTPS** (Bubblewrap l'exige).
- `https://votre-domaine/manifest.webmanifest` se charge.
- Lighthouse rapporte « PWA installable » (DevTools → Lighthouse).

## 2. Générer les icônes PNG

Depuis la racine du projet :

```bash
./tools/build-icons.sh
```

Cela crée `icon-192.png`, `icon-512.png`, leurs variantes maskable, et un
`icon-1024.png` pour la fiche Play. Le script utilise le premier outil
disponible parmi `rsvg-convert`, `imagemagick`, `inkscape` ou `npx sharp-cli`.

## 3. Préparer Bubblewrap

```bash
npm i -g @bubblewrap/cli
```

Éditez `twa-manifest.json` :

- `host` → votre domaine (sans `https://`).
- `iconUrl` / `maskableIconUrl` → URLs absolues vers les PNG hébergés.
- `packageId` → identifiant unique inversé (ex. `app.trioinclusion.twa`).

Puis :

```bash
bubblewrap init --manifest=https://votre-domaine/manifest.webmanifest
bubblewrap build
```

À la fin, vous obtenez :

- `app-release-bundle.aab` → à uploader sur le Play Store
- `android.keystore` → **gardez-le précieusement**, chiffré, hors du dépôt
- Le SHA-256 du certificat est affiché dans le terminal

## 4. Lier le site et l'app (Digital Asset Links)

Sans cette étape, l'app affichera la barre d'URL. Édutez
`.well-known/assetlinks.json` :

- `package_name` → la valeur de `packageId`
- `sha256_cert_fingerprints` → le SHA-256 affiché par Bubblewrap

Ce fichier doit être servi à l'URL exacte :

    https://votre-domaine/.well-known/assetlinks.json

Vérifiez :

```bash
curl -s https://votre-domaine/.well-known/assetlinks.json | jq .
```

## 5. Compte Play Console

1. Inscrivez-vous : https://play.google.com/console (25 $ une fois,
   vérification d'identité, **votre vrai nom + pièce d'identité**).
2. Créez l'application (français, gratuit, type « App »).
3. **Politique de confidentialité** : hébergez une page publique (le repo
   peut servir `privacy.html` — j'en fournis un modèle si besoin).
4. **Sécurité des données** : déclarez « Aucune donnée collectée » si
   c'est le cas (TrioInclusion ne traque rien).
5. **Classification de contenu** : remplir le questionnaire IARC.
6. **Fiche du Store** :
   - Icône : `icon-1024.png`
   - Bannière : 1024 × 500 (à créer — outil intégré Play Console possible)
   - Au moins 2 captures d'écran de l'app sur téléphone (1080 × 1920 conseillé)
   - Description courte (80 car.) et complète (4000 car.)
7. **Production → Créer une nouvelle version** → uploadez le `.aab`.
8. Soumettre pour examen. Délai : quelques heures à quelques jours.

## 6. Accessibilité — déclaration Play Console

L'app respecte WCAG 2.1 AA (cf. section « Accessibilité » du site). À
compléter dans la fiche Play :

- **Description complète** : ajoutez une ligne « Accessibilité : conforme
  WCAG 2.1 AA. Compatible TalkBack, navigation au clavier et Bluetooth,
  contraste élevé, pas de verrouillage d'orientation. »
- **Tags** : cochez « Accessibilité » dans les catégories secondaires.
- **Sécurité des données** : déclarez « aucune donnée collectée », « aucun
  partage », « pas de tracking ».
- **Politique de confidentialité** : URL publique obligatoire, même si
  l'app ne collecte rien (mentionnez-le explicitement).
- **Captures d'écran** : ajoutez la **description textuelle** dans la
  description longue (les captures elles-mêmes n'ont pas d'alt sur Play).
- **Vidéo de démonstration** : si vous en mettez une, fournissez des
  sous-titres (les sourds et malentendants en bénéficient).
- **Test TalkBack** : avant publication, activez TalkBack sur le téléphone
  test et vérifiez que tous les boutons sont annoncés correctement.
- **Test Switch Access / clavier Bluetooth** : vérifiez la navigation
  séquentielle au focus.

La TWA hérite **automatiquement** de l'accessibilité du site web : le
moteur de rendu Chrome dans Android expose le DOM à TalkBack. Tout ce qui
fonctionne avec NVDA/VoiceOver dans le navigateur fonctionne avec TalkBack
dans l'app.

## 7. Après la publication

À chaque mise à jour :

```bash
bubblewrap update      # met à jour la version Bubblewrap si besoin
bubblewrap build       # regénère le .aab (incrémente appVersion)
```

Et uploadez le nouveau `.aab` sur la même piste de production.

## Notes

- Le Play Store n'autorise plus les APK depuis 2021 : seul `.aab`.
- Si l'app utilise plus tard des paiements in-app, le **Play Billing** est
  obligatoire (passer par Bubblewrap `playBilling.enabled = true`).
- Pour iOS / l'App Store, c'est une autre démarche (PWA simple ou Capacitor).
