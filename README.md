# Dashboard APEI Val d'Oise

Dashboard statique de lecture transversale des projets APEI compares par annee de jury 2017, 2018 et 2021.

Important :
- les annees de jury affichees dans la page correspondent aux cohortes de projets comparees
- les mentions "Analyse APEI 2023" ou "Analyse APEI 2024" presentes dans certaines citations correspondent aux documents d'analyse sources, pas aux jurys compares
- la page n'affiche que les colleges disposant d'une base qualitative suffisamment exploitable pour renseigner les cinq axes
- ne pas ajouter un laureat dans l'interface tant que ses scores ne sont pas documentes de maniere verifiable

## Finalite du code

Ce projet sert a presenter une lecture institutionnelle, sobre et accessible des evolutions observees dans les projets APEI.

Le code doit prioriser :
- une lecture transversale plutot qu'une lecture centree sur un seul millesime
- la clarte editoriale avant l'effet visuel
- la stabilite des donnees et des intitulés
- l'accessibilite, y compris clavier et reduced motion
- une maintenance simple sur GitHub Pages, sans backend

## Fichiers du projet

- `index.html` : structure de la page et contenus statiques
- `style.css` : charte visuelle, layout, accessibilite et impression
- `app.js` : chargement des donnees, rendu dynamique, graphiques, tableaux, navigation
- `matrice-globale.json` : donnees affichees dans la page
- `favicon-32.png` : favicon

## Hierarchie des sources a utiliser

La page reste organisee par annee de jury. Les annees d'analyse servent a documenter ces jurys, pas a structurer l'interface.

Ordre de priorite :
- `matrice-globale.json` = source affichee dans le site, a modifier seulement avec appui d'une source verifiable
- rapports d'analyse exportes en PDF = source principale pour confirmer le perimetre des colleges, les formulations et les matrices globales
- fichiers d'analyse detaillee rediges en Markdown = source privilegiee pour les scores par axe quand ils explicitent la methode et justifient les notes
- classeurs d'extraction = source de travail utile, mais a utiliser avec prudence si leurs scores reconstruits ne sont pas explicitement confirmes dans les rapports

Regle de lecture actuelle par jury :
- jury 2017 : jury documente par l'analyse 2023 ; s'appuyer d'abord sur `2023_Analyse_impact_qualitative_Valdoise.pptx.pdf`
- jury 2018 : jury documente par l'analyse 2024 en mesure de cloture ; s'appuyer sur `V2_2024_Analyse_impact_qualitative_Valdoise.pptx.pdf` pour le perimetre et les moyennes globales, puis sur `analyse_scores_2024.md` pour les scores par axe par college
- jury 2019 : jury documente dans l'analyse 2021 quand un college est effectivement couvert ; s'appuyer sur `20210727_Valdoise_Lab2034_Analyse_impact_quali_Livrable.pptx.pdf`
- jury 2021 : jury documente par l'analyse 2024 en mesure de mi-parcours ; s'appuyer sur `V2_2024_Analyse_impact_qualitative_Valdoise.pptx.pdf` pour le perimetre et les moyennes globales, puis sur `analyse_scores_2024.md` pour les scores par axe par college

Point de vigilance :
- le fichier `extraction_donnees_valdoise.xlsx` contient des feuilles de travail utiles mais certaines valeurs 2024 ne sont pas strictement alignees avec `analyse_scores_2024.md`
- si une divergence apparait en 2024 entre le classeur et le Markdown detaille, privilegier le Markdown detaille tant qu'aucune source plus forte ne vient le contredire explicitement
- ne pas afficher un college absent ou incomplet tant qu'aucune source exploitable ne permet de renseigner les cinq axes

## Principes de developpement a conserver

### 1. Rester en site statique simple
- Pas de backend
- Pas de framework
- Pas de build complexe
- Code lisible, modifiable rapidement, compatible GitHub Pages

### 2. Ne pas changer le cadrage editorial sans raison forte
- La page est une analyse transversale par jury 2017 / 2018 / 2021
- L'ouverture doit rester institutionnelle et sobre
- Ne pas retransformer la page en dashboard marketing ou en page promotionnelle
- Eviter les blocs demonstratifs, gadgets ou sur-signaux visuels

### 3. Ne pas changer les 5 axes
Les 5 axes doivent rester strictement inchanges dans leur intitulé.

### 4. Ne pas modifier les donnees sans preuve source
- Toute correction de contenu doit reposer sur une source explicite
- Ne pas extrapoler a partir d'une tendance ou d'une moyenne supposee
- En cas de doute, ne pas inventer

### 5. Garder une accessibilite robuste
- Navigation clavier fonctionnelle
- Etats visuels lisibles
- Contrastes suffisants
- `prefers-reduced-motion` respecte
- Messages de fallback visibles en cas d'erreur de chargement

### 6. Favoriser les composants sobres et reutilisables
- Limiter les classes mortes ou redondantes
- Eviter les doubles systemes de binding JS
- Privilegier des fonctions JS petites, explicites et defensives
- Toute nouvelle classe HTML doit avoir une vraie utilite

### 7. Proteger la lisibilite des contenus
- Les textes de synthese doivent rester factuels
- Ne pas sur-interpreter les donnees qualitatives
- Les citations doivent conserver le role du locuteur et la source/annee associee
- Ne pas toucher a l'introduction validee

## Regles de modification

Avant toute modification :
1. verifier si le changement touche au fond, a la structure ou seulement a la forme
2. modifier le plus petit bloc logique possible
3. conserver la compatibilite mobile, desktop et print
4. relire les effets de bord sur la navigation, les tabs, les details et les graphiques

## Regles specifiques par fichier

### `index.html`
- garder une hierarchie de titres propre
- eviter les handlers inline
- limiter les textes ajoutes aux blocs vraiment utiles

### `style.css`
- conserver une interface light, lisible et sobre
- eviter les effets visuels inutiles
- supprimer le CSS mort quand il est confirme
- verifier les contrastes avant tout changement de couleur

### `app.js`
- ne pas dupliquer les mecanismes existants
- garder les garde-fous en cas d'erreur de chargement ou d'absence de Chart.js
- conserver les rendus accessibles des tabs, tableaux et resumes graphiques

### `matrice-globale.json`
- utiliser ce fichier comme source unique des donnees affichees
- ne pas corriger a la main une valeur sans justification explicite

## Deploiement

Le projet est concu pour etre deploie tel quel sur GitHub Pages.

- depot a la racine du repo ou dans `/docs`
- source GitHub Pages : branche `main`
- dossier : `/(root)` ou `/docs`

## Verifications minimales avant livraison

- la page se charge sans erreur
- le JSON se charge correctement
- les tabs fonctionnent au clic et au clavier
- les graphiques s'affichent ou montrent un fallback propre
- les details annuels ont le bon etat par defaut
- le favicon est bien reference
- le rendu mobile et le rendu print restent lisibles
