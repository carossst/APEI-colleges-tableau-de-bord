# Val d'Oise - Matrice globale (2021/2023/2024)

Page statique prête pour GitHub Pages.

## Structure
- index.html
- style.css
- app.js
- matrice-globale.json
- favicon-32.png

## Ce qui a été corrigé
- Nettoyage du JavaScript mort lie aux anciennes sections supprimees.
- Rehierarchisation de la page : synthese editoriale en haut, exploration analytique plus bas.
- Conservation du radar avec une explication explicite de son role.
- Ajout de resumes textuels sous les graphiques pour une meilleure accessibilite.
- Remontee des points cles transversaux avant la lecture detaillee par etablissement.
- Ajout d'un rappel de perimetre sur la distinction 2024 entre cloture 2018 et mi-parcours 2021.
- Scroll spy de navigation reel, au lieu d'un simple etat actif au clic.

## Deploiement GitHub Pages
1. Mettre les fichiers a la racine du repo (ou dans /docs).
2. GitHub > Settings > Pages > Build and deployment.
3. Source : Deploy from a branch.
4. Branch : main.
5. Folder : /(root) ou /docs.

## Mise a jour des donnees
Modifier `matrice-globale.json`, puis commit/push.
