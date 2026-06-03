# 🚀 Guide de Démarrage Rapide - Time Sensei

## ⚡ Démarrage en 3 Commandes

```bash
# 1. Accéder au dossier
cd time-sensei-webfront

# 2. Installer les dépendances
npm install

# 3. Lancer l'application
npm start
```

L'application ouvrira automatiquement à `http://localhost:4200/`

## 🎮 Premiers Pas

### 1️⃣ **Connexion**
- Cliquez sur le bouton **"Accès Démo"** pour tester rapidement
- Ou entrez votre nom d'utilisateur et mot de passe

### 2️⃣ **Sélection**
- Choisissez un **type de caractère** : Hiragana, Katakana ou Kanji
- Sélectionnez un **mode** : Reconnaissance ou Écriture
- Choisissez un **niveau** : Débutant, Intermédiaire ou Avancé
- Cliquez **"Commencer la révision"**

### 3️⃣ **Révision**
- **Mode Reconnaissance** : Cliquez sur la bonne réponse parmi 4 options
- **Mode Écriture** : Tapez la romanisation et cliquez "Valider"
- Voyez le feedback immédiat (✓ Correct ou ✗ Incorrect)
- Passez au caractère suivant

### 4️⃣ **Résumé**
- Consultez votre score final
- Cliquez "Nouvelle session" pour continuer

### 5️⃣ **Statistiques**
- Cliquez sur **"Statistiques"** pour voir votre historique
- Consultez vos résultats par type et par niveau
- Réinitialisez si nécessaire

## 📱 Modes de Révision

### Mode Reconnaissance
```
Question: Identifiez ce caractère
           え
Options: [ ka ] [ e ] [ a ] [ ku ]
```
Cliquez sur "e" pour répondre.

### Mode Écriture
```
Question: Écrivez la romanisation
           ケ
Input: [      e.g., "ke"      ] [Valider]
```
Tapez la réponse et cliquez Valider.

## 🎨 Écrans Disponibles

| Écran | URL | Description |
|-------|-----|-------------|
| Login | `/login` | Connexion utilisateur |
| Sélection | `/selection` | Configuration de session |
| Révision | `/revision` | Répondre aux questions |
| Statistiques | `/statistics` | Voir l'historique |

## 💡 Caractères de Base

### Hiragana (10)
- あ (a), い (i), う (u), え (e), お (o)
- か (ka), き (ki), く (ku), け (ke), こ (ko)

### Katakana (10)
- ア (a), イ (i), ウ (u), エ (e), オ (o)
- カ (ka), キ (ki), ク (ku), ケ (ke), コ (ko)

### Kanji (10)
- 一 (ichi - one), 二 (ni - two), 三 (san - three)
- 四 (shi - four), 五 (go - five)
- 人 (hito - person), 日 (hi - day)
- 月 (tsuki - moon), 火 (hi - fire), 水 (mizu - water)

## 🔐 Données Stockées Localement

L'application utilise `localStorage` pour persister :
- État d'authentification
- Statistiques utilisateur

**Note** : Les données sont perdues au vidage du cache du navigateur.

## 🛠️ Commandes de Développement

```bash
# Lancer le serveur de développement
npm start

# Compiler pour production
npm build

# Compiler avec watch mode
npm run watch

# Tests unitaires
npm test
```

## ⚙️ Configuration

### Port par Défaut
- **Développement** : `http://localhost:4200/`

### Tailwind CSS
- Styles inclus automatiquement
- Pas de fichier CSS à maintenir
- Utilise les classes Tailwind directement

## 🐛 Dépannage

### L'application ne démarre pas
```bash
# Vérifier la version de Node
node --version  # Doit être >= 18

# Nettoyer et réinstaller
rm -r node_modules
npm install
npm start
```

### LocalStorage plein
```bash
# Vider le localStorage dans la console du navigateur
localStorage.clear()
```

### Page blanche
- Vérifier la console du navigateur (F12)
- Vérifier que le serveur est en cours d'exécution
- Rafraîchir la page (Ctrl+R)

## 📊 Statistiques de Base

Chaque session contient :
- **10 questions** par défaut
- **Suivi automatique** des bonnes/mauvaises réponses
- **Calcul de précision** en temps réel
- **Persistance** de l'historique

## 🎯 Cas d'Usage

### Apprendre les bases
1. Sélectionnez Hiragana
2. Mode Reconnaissance
3. Niveau Débutant
4. Complétez plusieurs sessions

### S'améliorer
1. Augmentez progressivement le niveau
2. Passez au mode Écriture
3. Essayez Katakana et Kanji
4. Consultez vos statistiques

### Pratiquer intensément
1. Mode Écriture (plus difficile)
2. Niveau Avancé
3. Sessions répétées
4. Suivi de votre progression

## 📚 Resources

- [Angular Documentation](https://angular.io)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Japanese Characters Guide](https://www.lingoni.com/learn-japanese)

## 🤝 Support

En cas de problème :
1. Vérifiez que vous utilisez Node.js >= 18
2. Vérifiez les erreurs dans la console du navigateur
3. Videz le cache et les données du site
4. Essayez une autre navigateur

## 📝 Notes

- La connexion est actuellement **simulée** (backend à intégrer)
- Les caractères sont **limités** à 10 par type
- Pas de sons pour le moment (à ajouter)
- L'application est **responsive** (fonctionne sur mobile)

---

**Bon apprentissage! 🎌 頑張ってください！**
