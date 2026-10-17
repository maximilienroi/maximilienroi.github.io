# Mise en place (une seule fois)

Compte environ 15 minutes. Fais les étapes dans l'ordre. Les mots en **gras** sont
exactement ce sur quoi tu cliques.

---

## 1. Créer l'organisation « maximilienroi » (gratuit)

C'est ce qui donne l'adresse `maximilienroi.github.io`, sans « thekingchamallow ».

1. Va sur <https://github.com/account/organizations/new?plan=free>.
2. **Organization name** : `maximilienroi`. Si le nom est pris, essaie `maximilien-roi`.
3. **Contact email** : `maximilienroi@icloud.com`.
4. **This organization belongs to** : **My personal account**.
5. Accepte les conditions, clique **Next**, puis **Skip this step** (inutile d'inviter quelqu'un).

## 2. Déplacer le dépôt dans l'organisation

1. Ouvre le dépôt `MAX-PORTFOLIO` sur GitHub, puis l'onglet **Settings** (tout à droite).
2. Descends tout en bas, jusqu'à la zone rouge **Danger Zone**.
3. **Transfer**, puis **Select one of my organizations** › `maximilienroi`.
4. Tape le nom demandé pour confirmer, puis **I understand, transfer this repository**.

## 3. Renommer le dépôt

Avec ce nom précis, le site sera à l'adresse courte `https://maximilienroi.github.io/`.

1. Dans le dépôt (maintenant `maximilienroi/MAX-PORTFOLIO`) : **Settings**.
2. Tout en haut, **Repository name** : `maximilienroi.github.io`, puis **Rename**.

## 4. Rendre le dépôt public

GitHub Pages gratuit ne fonctionne qu'avec un dépôt public. Ce dépôt ne contient rien de
privé : seulement ce qui est déjà sur le site, et aucun mot de passe.

1. **Settings** › en bas, **Danger Zone** › **Change visibility** › **Change to public**.
2. Confirme.

## 5. Activer GitHub Pages

1. **Settings** › menu de gauche **Pages**.
2. Sous **Build and deployment** › **Source**, choisis **GitHub Actions**.

## 6. Mettre le site en ligne (fusionner la branche de travail)

Le site est sur la branche `claude/portfolio-website-eyt6et`. Pour le publier, il faut la fusionner dans `main` :

1. Onglet **Pull requests** › **New pull request**.
2. **base: main** et **compare: claude/portfolio-website-eyt6et**.
3. **Create pull request**, encore **Create pull request**, puis **Merge pull request** › **Confirm merge**.
4. Onglet **Actions** : « Publish site » tourne (rond jaune). Après 1 à 2 minutes, la coche
   est verte et le site est en ligne sur `https://maximilienroi.github.io/`.

(Tu peux aussi demander à Claude de créer la pull request ; il ne te reste alors qu'à cliquer **Merge**.)

## 7. Brancher Notion

### 7a. Créer une clé Notion

1. Va sur <https://www.notion.so/profile/integrations>.
2. **New integration**.
   - **Integration name** : `Site portfolio`
   - **Associated workspace** : ton espace (celui du cerveau externe)
   - **Type** : **Internal**
   - **Save**
3. Sur la page qui s'ouvre, onglet **Configuration** : laisse seulement **Read content**
   (décoche « Update content » et « Insert content »). Le site n'a besoin que de lire.
4. Onglet **Access** › **Edit access** › coche uniquement **Portfolio — site** › **Save**.
   Le site ne voit **que** cette base, jamais le reste de ton cerveau externe.
5. Retourne dans **Configuration** › **Internal Integration Secret** › **Show** › **Copy**.

### 7b. Donner la clé à GitHub

1. Dans le dépôt : **Settings** › **Secrets and variables** › **Actions**.
2. **New repository secret**.
   - **Name** : `NOTION_TOKEN`
   - **Secret** : colle la clé copiée
   - **Add secret**
3. Teste : **Actions** › **Publish site** › **Run workflow** › **Run workflow**.
   Quand c'est vert, le site affiche ce qu'il y a dans Notion.

La clé reste secrète : elle n'apparaît ni dans le code ni sur le site.

---

## Plus tard : un nom de domaine (par ex. maxro.co.uk)

1. Achète le domaine chez un registraire (par ex. Cloudflare, Namecheap ou OVH).
2. Chez le registraire, dans les réglages **DNS** du domaine, ajoute :
   - quatre lignes de type **A**, nom `@`, valeurs `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153` et `185.199.111.153` ;
   - une ligne de type **CNAME**, nom `www`, valeur `maximilienroi.github.io`.
3. Sur GitHub : **Settings** › **Pages** › **Custom domain** : `maxro.co.uk` › **Save**.
4. Quand la vérification est finie (de quelques minutes à 24 h), coche **Enforce HTTPS**.

Il n'y a rien d'autre à changer : le site lit son adresse dans les réglages de GitHub Pages.
