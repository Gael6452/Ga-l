# FindMyAI

Petite application web qui aide à trouver la meilleure IA **gratuite, sûre et peu chère** selon votre métier.

## Lancer

Aucun build : ouvrez `index.html` dans un navigateur, ou servez le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Structure

- `index.html` — squelette de la page
- `styles.css` — design (thème sombre, responsive)
- `data.js` — base de connaissances (métiers + outils)
- `app.js` — logique de recherche et filtres

## Ajouter un outil

Modifiez `data.js`. Chaque outil a la forme :

```js
{
  name: "Nom",
  url: "https://…",
  price: "free" | "freemium" | "cheap",   // < 10 €/mois pour 'cheap'
  flags: ["private", "eu", "offline", "hidden"],  // au choix
  jobs: ["dev", "writer", …],             // ids depuis JOBS
  why:  "Phrase courte expliquant l'intérêt",
}
```

Pas de tracking, pas d'affiliation.
