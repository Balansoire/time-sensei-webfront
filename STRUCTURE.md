# Structure Détaillée de l'Application Time Sensei

## 📁 Arborescence du Projet

```
time-sensei-webfront/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/
│   │   │   │   ├── login.component.ts          (107 lignes)
│   │   │   │   ├── login.component.html        (50 lignes)
│   │   │   │   └── login.component.css         (vide - Tailwind)
│   │   │   ├── selection/
│   │   │   │   ├── selection.component.ts      (95 lignes)
│   │   │   │   ├── selection.component.html    (92 lignes)
│   │   │   │   └── selection.component.css     (vide - Tailwind)
│   │   │   ├── revision/
│   │   │   │   ├── revision.component.ts       (180 lignes)
│   │   │   │   ├── revision.component.html     (150 lignes)
│   │   │   │   └── revision.component.css      (vide - Tailwind)
│   │   │   └── statistics/
│   │   │       ├── statistics.component.ts     (60 lignes)
│   │   │       ├── statistics.component.html   (120 lignes)
│   │   │       └── statistics.component.css    (vide - Tailwind)
│   │   ├── services/
│   │   │   ├── auth.service.ts                 (67 lignes)
│   │   │   ├── character.service.ts            (94 lignes)
│   │   │   └── statistics.service.ts           (75 lignes)
│   │   ├── guards/
│   │   │   ├── auth.guard.ts                   (17 lignes)
│   │   │   └── login.guard.ts                  (18 lignes)
│   │   ├── models/
│   │   │   ├── user.model.ts                   (11 lignes)
│   │   │   └── character.model.ts              (35 lignes)
│   │   ├── app.routes.ts                       (15 lignes)
│   │   ├── app.config.ts                       (18 lignes)
│   │   ├── app.ts                              (10 lignes)
│   │   └── app.html                            (1 ligne - <router-outlet />)
│   ├── main.ts
│   ├── index.html
│   └── styles.css
├── package.json
├── angular.json
├── tsconfig.json
├── tailwind.config.js
├── README_FR.md                                 (Nouvelle documentation)
└── README.md                                    (Documentation existante)
```

## 🔄 Flux de Navigation

```
┌─────────────┐
│   Login     │ (Page d'authentification)
└──────┬──────┘
       │ (Connexion réussie)
       ▼
┌─────────────────────┐
│   Selection         │ (Choix du type, mode, difficulté)
│  ┌──────────────┐   │
│  │- Hiragana    │   │
│  │- Katakana    │   │
│  │- Kanji       │   │
│  └──────────────┘   │
│  ┌──────────────┐   │
│  │- Reconnaissance │
│  │- Écriture    │   │
│  └──────────────┘   │
│  ┌──────────────┐   │
│  │- Débutant    │   │
│  │- Intermédiaire  │
│  │- Avancé      │   │
│  └──────────────┘   │
└─────────┬────────────┘
          │
          ▼
    ┌─────────────┐
    │  Révision   │ (10 caractères)
    │ Affichage:  │
    │ ┌─────────┐ │
    │ │  え    │ │
    │ └─────────┘ │
    │ Réponses:   │
    │ [a] [e] [i] │
    │ [u]         │
    └─────┬────────┘
          │ (Tous les 10 répondus)
          ▼
    ┌──────────────┐
    │  Résumé      │
    │ 7/10 correctes
    │ 70% précision │
    └──────┬───────┘
           │
           ├─────────────────┬──────────────────┐
           ▼                 ▼                  ▼
      ┌─────────┐      ┌──────────────┐   ┌─────────────┐
      │Déconnexion  │Selection (↻)  │   │Statistiques │
      │  (Login)    │                │   │ (Historique)│
      └─────────┘      └──────────────┘   └─────────────┘
```

## 🧩 Composants Détaillés

### 1. LoginComponent
**Responsabilité** : Authentification utilisateur
**Fonctionnalités** :
- Formulaire login/mot de passe
- Bouton "Accès Démo" pour test rapide
- Validation des champs
- Gestion d'erreurs

**Signaux** :
- `username: WritableSignal<string>`
- `password: WritableSignal<string>`
- `isLoading: WritableSignal<boolean>`
- `error: WritableSignal<string>`

### 2. SelectionComponent
**Responsabilité** : Configuration de la session
**Fonctionnalités** :
- 3 grilles de sélection (type, mode, difficulté)
- Validation du formulaire
- Navigation vers la page de révision
- Accès aux statistiques

**Signaux** :
- `characterType: WritableSignal<CharacterType | ''>`
- `revisionMode: WritableSignal<RevisionMode | ''>`
- `difficulty: WritableSignal<DifficultyLevel | ''>`
- `isLoading: WritableSignal<boolean>`

### 3. RevisionComponent
**Responsabilité** : Session de révision interactive
**Fonctionnalités** :
- Affichage du caractère
- Mode reconnaissance : 4 boutons
- Mode écriture : champ texte
- Feedback instantané
- Suivi de progression
- Résumé final

**Signaux** :
- `currentCharacter: WritableSignal<Character | null>`
- `isAnswered: WritableSignal<boolean>`
- `selectedAnswer: WritableSignal<string | null>`
- `currentIndex: WritableSignal<number>`
- `correctAnswers: WritableSignal<number>`
- `sessionComplete: WritableSignal<boolean>`

### 4. StatisticsComponent
**Responsabilité** : Affichage des statistiques utilisateur
**Fonctionnalités** :
- Statistiques globales
- Résultats par type de caractère
- Résultats par niveau de difficulté
- Barres de progression
- Réinitialisation

**Signaux** :
- `statistics: WritableSignal<UserStatistics | null>`
- `isLoading: WritableSignal<boolean>`

## 🔌 Services

### AuthService
```typescript
// Méthodes principales
login(username: string, password: string): Observable<User>
logout(): void
isAuthenticated(): boolean
getAuthState(): Observable<AuthState>
getCurrentUser(): User | null
```

### CharacterService
```typescript
// Méthodes principales
getCharacters(type: CharacterType, difficulty: DifficultyLevel): Observable<Character[]>
getAnswerOptions(character: Character, correctOptions: number = 4): string[]
```

**Données** :
- Hiragana : 10 caractères (あ, い, う, え, お, か, き, く, け, こ)
- Katakana : 10 caractères (ア, イ, ウ, エ, オ, カ, キ, ク, ケ, コ)
- Kanji : 10 caractères (一, 二, 三, 四, 五, 人, 日, 月, 火, 水)

### StatisticsService
```typescript
// Méthodes principales
getUserStatistics(): Observable<UserStatistics>
recordAnswer(answer: CharacterAnswer): void
resetStatistics(): void
```

## 🛡️ Guards

### AuthGuard
- Vérifie que l'utilisateur est authentifié
- Redirige vers /login si non authentifié
- Protège les routes : `/selection`, `/revision`, `/statistics`

### LoginGuard
- Vérifie que l'utilisateur n'est PAS authentifié
- Redirige vers /selection si déjà connecté
- Protège la route : `/login`

## 📊 Modèles de Données

### User
```typescript
interface User {
  id: string;
  username: string;
  email: string;
}
```

### Character
```typescript
interface Character {
  id: string;
  character: string;
  romaji: string;
  meaning?: string;
  type: CharacterType;
}
```

### UserStatistics
```typescript
interface UserStatistics {
  userId: string;
  totalAnswers: number;
  correctAnswers: number;
  accuracy: number;
  byType: {
    hiragana: { correct: number; total: number };
    katakana: { correct: number; total: number };
    kanji: { correct: number; total: number };
  };
  byDifficulty: {
    beginner: { correct: number; total: number };
    intermediate: { correct: number; total: number };
    advanced: { correct: number; total: number };
  };
}
```

## 🎨 Design System

### Palette Tailwind
- **Primaire** : Bleu (`blue-600`, `blue-700`)
- **Succès** : Vert (`green-500`, `green-600`)
- **Erreur** : Rouge (`red-500`, `red-600`)
- **Accentuation** : Indigo (`indigo-600`) et Purple (`purple-600`)
- **Fond** : Gradient bleu (`from-blue-50 to-blue-100`)

### Composants Réutilisables
- Cartes de sélection avec hover effect
- Boutons avec états (normal, hover, disabled)
- Barres de progression
- Grilles responsives (grid-cols-1 md:grid-cols-2/3)

## 🔄 Flux de Données

```
AuthService (state d'auth)
    ↓
Navigation Guards (AuthGuard, LoginGuard)
    ↓
ComponentServices (Character, Statistics)
    ↓
Signaux Angular (réactivité)
    ↓
Templates (rendu HTML)
```

## 💾 Persistance

- **localStorage.authState** : État d'authentification
- **localStorage.userStatistics** : Statistiques utilisateur
- **Memory** : Caractères actuels (rechargé à chaque session)

## ✅ Checklist de Déploiement

- [x] Structure complète des composants
- [x] Services fonctionnels
- [x] Routes configurées
- [x] Guards de sécurité
- [x] Styles Tailwind
- [x] Données simulées
- [x] Tests manuels réussis
- [ ] Tests unitaires (à faire)
- [ ] Tests e2e (à faire)
- [ ] Intégration backend (à faire)
- [ ] Déploiement en production (à faire)

## 🚀 Prochaines Étapes

1. **Backend Integration**
   - Connecter l'API Rust pour authentification
   - Charger les vrais caractères
   - Sauvegarder les statistiques en BD

2. **Améliorations UX**
   - Animations de transition
   - Sons pour la prononciation
   - Thème sombre

3. **Fonctionnalités Avancées**
   - Système de points/récompenses
   - Leaderboard
   - Sessions planifiées
   - Révision ciblée

4. **Optimisation**
   - Lazy loading des caractères
   - Compression des images
   - Service Worker pour offline
   - Performance metrics
