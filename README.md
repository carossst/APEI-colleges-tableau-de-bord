# Val-d'Oise - Analyse d'impact qualitative (2021 / 2023 / 2024)

Page statique prête pour GitHub Pages.

## Contenu du projet
- `index.html` : structure de la page
- `style.css` : styles, lisibilité, accessibilité et impression
- `app.js` : chargement des données, graphiques, tableaux et interactions
- `matrice-globale.json` : données à la racine du projet
- `favicon-32.png` : favicon 32x32

## Structure de lecture de la page
La page suit désormais une hiérarchie claire :
1. **Synthèse globale en niveau 1** : contexte, méthode, repères de lecture, synthèse exécutive rédigée, matrice globale, radar et comparaison par axe.
2. **Descente analytique en niveau 2** : scores par établissement, points clés transversaux, puis détail par année.
3. **Lecture chronologique en dernier** : courbes d'évolution globale et par axe, placées en bas de page.

## Principes de structuration retenus
- Pas de bloc KPI quantitatif en haut de page.
- Le radar est conservé comme vue macro et immédiatement complété par un graphique plus précis par axe.
- La vue par année est conservée, mais seulement dans la partie basse et détaillée.
- Les chemins restent prévus pour des fichiers à la racine.

## Déploiement sur GitHub Pages
1. Mettre tous les fichiers à la racine du dépôt GitHub, ou dans `/docs`.
2. Dans GitHub : `Settings` -> `Pages` -> `Build and deployment`.
3. Choisir :
   - **Source** : `Deploy from a branch`
   - **Branch** : `main`
   - **Folder** : `/(root)` ou `/docs`
4. Enregistrer puis ouvrir l'URL GitHub Pages générée.

## Mise à jour des données
Modifier `matrice-globale.json` puis republier.

## Attention
- `app.js` charge les données avec `fetch('./matrice-globale.json')`.
- Si le JSON est déplacé dans un sous-dossier, il faut mettre à jour le chemin dans `app.js`.
- Les intitulés des 5 axes doivent rester strictement inchangés.

## Sources utilisées pour la structuration
La logique de la page reprend les livrables qualitatifs 2021, 2023 et 2024 :
- contexte et périmètre
- méthode et lecture des 5 axes
- matrice globale
- constats transversaux
- descente analytique par établissement
- détail par année en bas de page

- Le favicon attendu par `index.html` est `favicon-32.png`.
- Les onglets des tableaux établissements s’ouvrent désormais sur 2024 par défaut et sont pilotables au clavier.
