# MAXRØ, le site de Maximilien Roi

Le site portfolio de Maximilien Roi (MAXRØ), pianiste et producteur à Londres.
Une seule page en anglais : production, piano et enseignement, réseaux sociaux,
journal de la Music Society, autres expériences, contact.

Ce guide explique, en mots simples, comment mettre le site à jour.

---

## Comment ça marche, en une minute

- **Le contenu vit dans Notion**, dans la base **« Portfolio — site »** de ton cerveau externe.
  Une ligne = une entrée du site.
- **Toutes les heures**, GitHub lit cette base, copie dans ce dépôt les lignes où **Publish** est coché,
  reconstruit le site et le met en ligne. Tu n'as rien à faire.
- Les textes sont publiés **exactement comme tu les écris**. Rien n'est réécrit automatiquement.
- Chaque mise à jour est enregistrée dans l'historique de GitHub. On peut donc toujours revenir en arrière.

---

## Ajouter ou modifier quelque chose (avec Notion)

1. Ouvre Notion, puis **Cerveau externe — Maximilien › Portfolio — site**.
2. Ajoute une ligne (ou modifie une ligne existante) :

| Colonne | Ce qu'il faut mettre |
|---|---|
| **Title** | Le titre de l'entrée. Pour le journal de la Music Society : la phrase elle-même, par ex. *Hosted The Session.* |
| **Section** | Production, Piano & teaching, Social media, Music Society log, Also ou Education |
| **Date** | Sert à trier (le plus récent en premier). Pour le journal : le jour exact. |
| **Dates shown** | Comment la date s'affiche, par ex. `Mar 2025 – now`. Facultatif pour le journal. |
| **Where** | Le lieu, l'équipe ou le rôle, par ex. `Chez Lui, Notting Hill, London` |
| **Text** | 1 à 3 phrases simples. L'italique est conservé. Saute une ligne entre deux paragraphes. |
| **University project** | Coche-la pour ajouter « (university project) ». |
| **Photo** | Facultatif. Une photo JPG ou PNG. |
| **Photo description** | Ce que montre la photo, en une phrase. C'est pour les personnes malvoyantes et pour Google. |
| **Video** | Facultatif. Un MP4 court, moins de 20 Mo. Il se lance au survol, ou au toucher sur téléphone. |
| **Audio** | Facultatif. Un MP3 pour le petit lecteur intégré. |
| **Links** | Écris un mot (par ex. `Spotify`), sélectionne-le et ajoute-lui un lien. Pour plusieurs liens, sépare-les par des espaces. |
| **Spotify player** | Facultatif. Un lien Spotify (titre, album ou artiste) pour le lecteur « Play on this page ». |
| **Order** | Facultatif. `1` pour mettre l'entrée tout en haut de sa section. |
| **Publish** | **Coche-la pour mettre en ligne.** Décoche-la pour retirer l'entrée du site. |

3. Attends au maximum une heure. Si tu es pressé, publie tout de suite :
   GitHub › onglet **Actions** › **Publish site** › bouton **Run workflow** › **Run workflow**.

Si une entrée n'a pas de photo, le site s'adapte simplement : aucun cadre vide n'apparaît.

### Ajouter une ligne au journal de la Music Society

Nouvelle ligne : **Section** = `Music Society log`, **Title** = ce que tu as fait
(une phrase), **Date** = le jour, **Publish** coché. C'est tout.

---

## Sans Notion (ou en demandant à Claude)

Tout le contenu est aussi dans des fichiers de ce dépôt, donc tu peux demander à Claude
« ajoute ceci au site » ou modifier les fichiers directement sur GitHub :

- `src/content/entries/en/` : un fichier `.md` par projet ou expérience
- `src/content/log/en/` : un fichier `.md` par ligne du journal de la Music Society
- `src/content/site/en.json` : ton nom, la phrase d'accueil, l'e-mail, le téléphone, les liens et les titres des sections

> Attention : quand Notion est branché, **c'est Notion qui fait foi**. Un fichier modifié à la main
> dans `entries/en/` ou `log/en/` sera remplacé à la synchronisation suivante. Pour un changement
> qui doit durer, fais-le dans Notion. Seul `site/en.json` n'est pas géré par Notion.

### Ajouter une photo sans Notion

1. Sur GitHub, ouvre `src/assets/media/`, puis **Add file › Upload files** et dépose la photo.
2. Dans le fichier de l'entrée, ajoute deux lignes en haut, entre les `---` :
   ```
   image: ../../../assets/media/nom-de-la-photo.jpg
   imageAlt: Ce que montre la photo
   ```
3. Clique **Commit changes**. Le site se republie tout seul en 1 à 2 minutes.

Les vidéos et les fichiers audio vont dans `public/media/`, puis dans l'entrée :
`video: media/ma-video.mp4` ou `audio: media/mon-titre.mp3`.

---

## Republier le site

Le site se republie automatiquement :

- à chaque modification de la branche `main` ;
- toutes les heures (pour récupérer Notion) ;
- à la demande : **Actions › Publish site › Run workflow**.

Pour revenir à une ancienne version : onglet **Code** › **Commits**, trouve la version voulue,
puis demande à Claude de « revenir à ce commit ».

---

## Mise en place (à faire une seule fois)

Les étapes détaillées, clic par clic, sont dans [`docs/SETUP.md`](docs/SETUP.md) :
rendre le dépôt public, activer GitHub Pages, brancher Notion et, plus tard, un nom de domaine.

---

## Pour les développeurs

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # construit le site dans dist/
NOTION_TOKEN=... npm run sync   # récupère Notion à la main
```

- Astro 7, collections de contenu (`src/content.config.ts`), aucun framework JavaScript.
  Il n'y a que de petits scripts pour copier l'e-mail, le lecteur audio, la vidéo, Spotify et la photo agrandie.
- Polices auto-hébergées : Archivo (axe de largeur) et Newsreader.
- Couleurs dans `src/styles/global.css` (mode clair et sombre automatiques).
- Version française : ajouter `src/content/site/fr.json`, les dossiers `entries/fr/` et `log/fr/`,
  et une page `src/pages/fr/index.astro` contenant `<Home lang="fr" />`.
- `node scripts/screenshots.mjs` : captures d'écran sur ordinateur et mobile, en clair et en sombre.
- `node scripts/brand/make-images.mjs` : régénère l'image de partage (`public/og.png`) et les icônes.
