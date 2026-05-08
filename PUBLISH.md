# Publier TrioInclusion sur le Play Store

L'app est packagée avec **Capacitor** : tout le code est embarqué dans le
`.aab`, **pas besoin d'héberger un site**. L'utilisateur installe l'app, ça
tourne 100 % en local.

## Pré-requis

À installer sur ta machine :

- **Node.js ≥ 18** : <https://nodejs.org>
- **Java JDK 17** : `apt install openjdk-17-jdk` ou Adoptium / Temurin
- **Android Studio** (le plus simple, fournit le SDK + l'émulateur) :
  <https://developer.android.com/studio>

Vérifie :
```bash
node -v
java -version
echo $ANDROID_HOME    # doit pointer sur ~/Android/Sdk
```

## 1. Installer les dépendances

```bash
npm install
```

Ça récupère `@capacitor/core`, `@capacitor/cli` et `@capacitor/android`.

## 2. Construire le bundle web

```bash
npm run build
```

Ça crée `www/` à partir des fichiers du repo (rien n'est minifié, c'est
de l'app pure HTML/CSS/JS).

## 3. Ajouter la plateforme Android (une seule fois)

```bash
npm run cap:add
```

Capacitor crée le dossier `android/` (projet Gradle complet). Ce dossier
n'est pas commité — il se régénère à la demande.

## 4. Ouvrir dans Android Studio

```bash
npm run cap:open
```

Android Studio s'ouvre sur le projet généré. À l'intérieur :

1. Vérifier `android/app/build.gradle` :
   - `applicationId "app.trioinclusion.android"`
   - `versionCode 1`, `versionName "1.0.0"`
2. **Build → Generate Signed Bundle / APK**
3. Choisir **Android App Bundle** (.aab — exigé par le Play Store).
4. Créer une nouvelle clé de signature (à conserver précieusement, hors
   du dépôt). Mots de passe à mémoriser.
5. Build variant : **release**.
6. Le `.aab` sort dans `android/app/release/app-release.aab`.

## 5. Tester sur un appareil réel

Avant de soumettre :

```bash
adb install android/app/release/app-release.aab   # ou drag-drop dans le téléphone
```

Vérifie :
- L'icône TrioInclusion apparaît dans le launcher
- L'app s'ouvre sans connexion Internet (mode avion)
- Tous les filtres fonctionnent
- **TalkBack** : Réglages → Accessibilité → TalkBack. Parcours toute l'app
  au doigt, vérifie que les chips sont annoncées « bouton, sélectionné /
  non sélectionné ».
- Rotation de l'écran (le manifeste autorise toutes les orientations).

## 6. Compte Play Console

Seule étape que je ne peux pas automatiser :

1. <https://play.google.com/console>
2. **25 $** une fois (carte bancaire).
3. Vérification d'identité avec pièce d'identité (24-48 h).
4. Créer l'application : nom **TrioInclusion**, langue par défaut
   **français**, gratuit, type « App ».

## 7. Remplir la fiche

Tout est prêt dans `store-listing.md`. À copier-coller dans :

- **Description courte / longue** → onglet *Présence sur le Store / Fiche du Store*
- **Icône** → `icons/icon-1024.png` (slot « Icône d'application »)
- **Bannière** → `icons/feature-graphic.png` (slot « Image de présentation »)
- **Captures d'écran** → 2 minimum, 1080 × 1920 conseillé. Prends-les sur
  ton téléphone via *Réglages → Captures d'écran* après installation.
- **Politique de confidentialité** → URL publique. Si tu n'héberges pas
  encore le site trioinclusion.org, GitHub Pages gratuit suffit pour
  héberger uniquement `privacy.html`.
- **Sécurité des données** → réponses dans `store-listing.md` (tout en
  « Non »).
- **Classification de contenu** → questionnaire IARC, réponses dans
  `store-listing.md` (PEGI 3 attendu).

## 8. Soumettre

1. **Production → Créer une nouvelle version**
2. Upload de `app-release.aab`
3. Notes de version (ex. « Première version. »)
4. **Examiner et déployer**
5. Délai d'examen : **quelques heures à 7 jours** pour une première publication.

## Mises à jour

Quand tu modifies l'app :

```bash
# 1. Bump versions dans android/app/build.gradle
#    versionCode 2
#    versionName "1.0.1"

# 2. Resync et rebuild
npm run cap:sync
npm run cap:open
# → Build → Generate Signed Bundle (avec la même clé que la 1re fois)

# 3. Upload le nouveau .aab dans Play Console → Production → Nouvelle version
```

## Annexe — sauvegarder la clé

⚠️ **Si tu perds le keystore, tu ne pourras plus jamais publier de mise
à jour de l'app.** Google ne peut pas le régénérer.

Sauvegarde au moins 2 copies :
- Un mot de passe manager (Bitwarden, 1Password)
- Un disque externe chiffré

Active aussi **Play App Signing** (option Google) au premier upload :
Google garde une copie de ta clé chez lui en plus.

## Annexe — alternative TWA (si tu changes d'avis)

Tout le travail TWA reste dans le repo (`twa-manifest.json`,
`.well-known/assetlinks.json`). Pour basculer dessus, voir l'historique
git ou demander.
