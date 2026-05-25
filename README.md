# dailyMana

Application web minimaliste et apaisante qui affiche un verset biblique aléatoire chaque jour.  
L’utilisateur peut choisir parmi trois langues (français, anglais, malgache) et obtenir un nouveau message à tout moment.

➡️ **Démo en ligne** *[ici](https://dailymana.netlify.app/)*

---

## Fonctionnalités

- 🗣️ Sélecteur de langue (Français / English / Malagasy)
- 🌐 Chargement des données depuis des fichiers JSON distants
- 💾 Mise en cache intelligente (pas de requête inutile)

## 📚 Source des versets

Les versets sont fournis par le dépôt GitHub public :

> **[leorak98/seed-verses](https://github.com/leorak98/seed-verses)**

Fichiers JSON utilisés :

- Français : `https://raw.githubusercontent.com/leorak98/seed-verses/main/data/fr/verses.json`
- Anglais : `https://raw.githubusercontent.com/leorak98/seed-verses/main/data/en/verses.json`
- Malgache : `https://raw.githubusercontent.com/leorak98/seed-verses/main/data/mg/verses.json`

Un grand merci à **leorak98** pour la mise à disposition de ces données bibliques libres.

---

## 🛠️ Technologies utilisées

- HTML5
- CSS3 (Flexbox, animations, media queries)
- JavaScript (Vanilla JS – ES6+)
- Google Fonts (*Playfair Display* et *Inter*)
- Fetch API + gestion asynchrone

Aucun framework, aucune dépendance externe.

---

## 🚀 Installation et exécution

1. **Cloner ou télécharger** les trois fichiers :
   - `index.html`
   - `style.css`
   - `script.js`

2. **Ouvrir `index.html`** dans un navigateur moderne (double‑clic ou via un serveur local).

---

## 🙏 Remerciements

- **leorak98** pour son travail sur le dépôt `seed-verses`.
- La communauté open‑source pour l’inspiration du design.

---

*Que chaque verset t’apporte paix et réflexion.*
