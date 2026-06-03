# Time Sensei - Application de Révision de Caractères Japonais

## 🎯 Vue d'ensemble

Time Sensei est une application web Angular moderne conçue pour réviser efficacement les caractères japonais (Hiragana, Katakana et Kanji). L'application offre une expérience d'apprentissage interactive avec des modes de révision variés, des niveaux de difficulté ajustables et un suivi détaillé des statistiques.

## ✨ Fonctionnalités

### 1. **Authentification** 
- Page de login élégante avec connexion simulée
- Bouton "Accès Démo" pour un test rapide
- Stockage de la session en localStorage

### 2. **Sélection de Session**
- **Types de caractères** : Hiragana, Katakana, Kanji
- **Modes de révision** :
  - **Reconnaissance** : Identifier le caractère parmi 4 options
  - **Écriture** : Écrire la romanisation du caractère
- **Niveaux de difficulté** : Débutant, Intermédiaire, Avancé

### 3. **Page de Révision**
- Affichage du caractère en gros caractères
- Réponses interactives (boutons pour la reconnaissance, champ texte pour l'écriture)
- Feedback immédiat (✓ Correct / ✗ Incorrect)
- Barre de progression pour suivre la session
- Compteur de bonnes réponses en temps réel
- Résumé final avec statistiques

### 4. **Statistiques**
- Nombre total de réponses
- Nombre de réponses correctes
- Taux de précision global
- Résultats détaillés par type de caractère
- Résultats détaillés par niveau de difficulté
- Barres de progression pour chaque catégorie
- Possibilité de réinitialiser les statistiques

## 🏗️ Architecture

### Structure du Projet

```
src/app/
├── components/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.css
│   ├── selection/
│   │   ├── selection.component.ts
│   │   ├── selection.component.html
│   │   └── selection.component.css
│   ├── revision/
│   │   ├── revision.component.ts
│   │   ├── revision.component.html
│   │   └── revision.component.css
│   └── statistics/
│       ├── statistics.component.ts
│       ├── statistics.component.html
│       └── statistics.component.css
├── services/
│   ├── auth.service.ts          # Gestion de l'authentification
│   ├── character.service.ts     # Données des caractères
│   └── statistics.service.ts    # Gestion des statistiques
├── guards/
│   ├── auth.guard.ts            # Protect routes - authentification requise
│   └── login.guard.ts           # Redirection automatique si déjà connecté
├── models/
│   ├── user.model.ts            # Interface utilisateur
│   └── character.model.ts       # Interfaces des caractères et statistiques
├── app.routes.ts                # Définition des routes
├── app.config.ts                # Configuration Angular
├── app.ts                        # Composant racine
└── app.html                      # Template racine
```

### Services

#### **AuthService**
- Gestion de la connexion/déconnexion
- Stockage de l'état d'authentification
- Récupération de l'utilisateur actuel

#### **CharacterService**
- Base de données des caractères (hiragana, katakana, kanji)
- Génération d'options de réponse
- Mélange aléatoire des caractères

#### **StatisticsService**
- Enregistrement des réponses
- Calcul des statistiques
- Persistance en localStorage

## 🛣️ Routes

| Route | Composant | Guard | Description |
|-------|-----------|-------|-------------|
| `/login` | LoginComponent | LoginGuard | Page de connexion |
| `/selection` | SelectionComponent | AuthGuard | Sélection de session |
| `/revision` | RevisionComponent | AuthGuard | Page de révision |
| `/statistics` | StatisticsComponent | AuthGuard | Statistiques utilisateur |

## 🎨 Styles

- **Framework CSS** : Tailwind CSS v4.1
- **Palette de couleurs** :
  - Bleu : Éléments principaux
  - Vert : Mode reconnaissance
  - Purple : Niveaux de difficulté
  - Red/Green : Feedback incorrect/correct

## 🔧 Technologies

- **Angular** : 21.2
- **TypeScript** : 5.9
- **Tailwind CSS** : 4.1
- **RxJS** : 7.8
- **Vite** : Pour l'optimisation build

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ et npm 11.16+
- Angular CLI 21.2+

### Installation

```bash
cd time-sensei-webfront
npm install
```

### Développement

```bash
npm start
```

L'application sera disponible à `http://localhost:4200/`

### Build Production

```bash
npm run build
```

Les fichiers compilés seront dans le dossier `dist/`

## 📱 Utilisation

1. **Connexion** : Cliquez sur "Accès Démo" pour tester
2. **Sélection** : Choisissez le type de caractère, le mode et la difficulté
3. **Révision** : 
   - Mode Reconnaissance : Cliquez sur la bonne réponse
   - Mode Écriture : Tapez la romanisation et cliquez "Valider"
4. **Résumé** : Consultez votre précision et vos statistiques
5. **Statistiques** : Accédez à votre historique complet

## 📊 Données Simulées

Actuellement, l'application utilise des données simulées :
- 10 caractères hiragana
- 10 caractères katakana
- 10 kanji
- Statistiques pré-remplies

**À faire ultérieurement** : Intégration avec le backend Rust pour récupérer les vraies données

## 🔐 Sécurité

- Authentification simulée avec localStorage
- Routes protégées avec AuthGuard
- Pas de données sensibles stockées en clair

## 🐛 Améliorations Futures

- [ ] Intégration backend API
- [ ] Authentification réelle avec JWT
- [ ] Supports des sons pour l'écoute
- [ ] Graphiques de progression détaillés
- [ ] Système de récompenses/badges
- [ ] Leaderboard
- [ ] Multi-langue
- [ ] Mode hors ligne

## 📝 Notes de Développement

### Session de Révision
- Chaque session contient exactement 10 questions
- Les caractères sont mélangés aléatoirement
- Les options de réponse pour le mode reconnaissance sont générées dynamiquement

### Stockage Local
- État d'authentification : `authState`
- Statistiques utilisateur : `userStatistics`

### Signaux Angular
L'application utilise les signaux Angular pour la réactivité :
```typescript
username = signal('');
isLoading = signal(false);
statistics = signal<UserStatistics | null>(null);
```

## 🤝 Contribution

Les suggestions et améliorations sont les bienvenues !

## 📄 Licence

Projet personnel Time Sensei
