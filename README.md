# Dashboard APEI Val d'Oise

Dashboard statique de lecture transversale des analyses qualitatives APEI 2021, 2023 et 2024.

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

## Principes de developpement a conserver

### 1. Rester en site statique simple
- Pas de backend
- Pas de framework
- Pas de build complexe
- Code lisible, modifiable rapidement, compatible GitHub Pages

### 2. Ne pas changer le cadrage editorial sans raison forte
- La page est une analyse transversale 2021 / 2023 / 2024
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
