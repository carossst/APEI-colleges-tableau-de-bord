# Val d'Oise - Matrice globale (2021/2023/2024)

Page statique prête pour GitHub Pages.

## Structure
- index.html
- style.css
- app.js
- matrice-globale.json
- favicon-32.png

## Ce qui a été corrigé
- Nettoyage du JavaScript mort lié aux anciennes sections supprimées.
- Réhiérarchisation de la page : synthèse éditoriale en haut, exploration analytique plus bas.
- Suppression du bloc "Comment utiliser cette page" et de la logique de guidage trop démonstrative en haut de page.
- Recentrage du cadrage sur une lecture transversale 2021, 2023 et 2024, sans mise en avant de 2024 en ouverture.
- Conservation du radar avec une explication explicite de son rôle.
- Ajout de résumés textuels sous les graphiques pour une meilleure accessibilité.
- Remontée des points clés transversaux avant la lecture détaillée par établissement.
- Conservation du contexte 2024 uniquement dans les zones de détail où il est utile à l'interprétation.
- Anonymisation des citations : rôle conservé, noms de personnes et noms d'établissements retirés.
- Scroll spy de navigation réel, au lieu d'un simple état actif au clic.

## Déploiement GitHub Pages
1. Mettre les fichiers à la racine du repo (ou dans /docs).
2. GitHub > Settings > Pages > Build and deployment.
3. Source : Deploy from a branch.
4. Branch : main.
5. Folder : /(root) ou /docs.

## Mise à jour des données
Modifier `matrice-globale.json`, puis commit/push.
