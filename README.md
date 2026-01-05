# 🥗 Diet Tracker - Gwen & Ludo

Une application web simple et élégante pour suivre votre alimentation quotidienne.

## ✨ Fonctionnalités

### 📊 Suivi des Repas
- Ajout de repas avec nom, description et calories
- Calcul automatique des calories quotidiennes
- Historique des 7 derniers jours
- Suppression individuelle ou globale des repas

### 📏 Suivi des Mensurations
- Enregistrement de vos mesures corporelles :
  - Poids (kg)
  - Tour de taille, hanches, poitrine (cm)
  - Tour de bras et cuisses (cm)
- Affichage des dernières mesures
- Historique complet avec dates

### 📅 Planification des Menus
- Menu hebdomadaire (Lundi → Dimanche)
- Catégories de repas (Petit-déjeuner, Déjeuner, Dîner, Collation)
- Calcul des calories par jour
- **Import/Export JSON** pour sauvegarder et partager vos menus

### 💾 Autres fonctionnalités
- Sauvegarde automatique dans le navigateur (localStorage)
- Interface à onglets (Repas / Mensurations / Menu Semaine)
- Design responsive (mobile, tablette, desktop)
- Interface moderne avec animations

## 🚀 Déploiement sur Netlify

### Option 1 : Via l'interface Netlify

1. Connectez-vous sur [netlify.com](https://netlify.com)
2. Cliquez sur "Add new site" > "Import an existing project"
3. Connectez votre compte GitHub
4. Sélectionnez ce repository : `diet-tracker-gwen-ludo`
5. Configuration de build :
   - Build command : (laisser vide)
   - Publish directory : (laisser vide ou mettre ".")
6. Cliquez sur "Deploy"

### Option 2 : Via Netlify CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod
```

## 💻 Utilisation locale

Ouvrez simplement le fichier `index.html` dans votre navigateur !

Aucune installation ou serveur requis.

## 📤 Format JSON pour les menus

Vous pouvez importer un menu au format JSON. Exemple de structure :

```json
{
  "lundi": [
    {
      "id": 1704452400000,
      "type": "petit-dejeuner",
      "name": "Toast avocat et œufs",
      "calories": 350
    },
    {
      "id": 1704463200000,
      "type": "dejeuner",
      "name": "Salade César au poulet",
      "calories": 450
    }
  ],
  "mardi": [
    {
      "id": 1704474000000,
      "type": "diner",
      "name": "Saumon grillé et légumes",
      "calories": 500
    }
  ]
}
```

**Types de repas acceptés** : `petit-dejeuner`, `dejeuner`, `diner`, `collation`

**Jours acceptés** : `lundi`, `mardi`, `mercredi`, `jeudi`, `vendredi`, `samedi`, `dimanche`

## 🛠️ Technologies

- HTML5
- CSS3 (avec variables CSS et animations)
- JavaScript (ES6+, POO)
- LocalStorage pour la persistance des données

## 📝 Licence

MIT © 2026 Gwen & Ludo