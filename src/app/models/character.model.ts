export type CharacterType = 'hiragana' | 'katakana' | 'kanji';
export type RevisionMode = 'recognition' | 'writing';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Kana {
  id: string;
  caractere: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  groupe: string;
}
export interface Kanji {
  id: string;
  hiragana_l?: string;
  romaji_l: string;
  hiragana_c?: string;
  romaji_c?: string;
  caractere: string;
  signification?: string;
  type: 'kanji';
  groupe: string;
}

export interface FicheRevision {
  caractere: Kana | Kanji;

  suite_succes: number;
  derniere_revision: string;
  nombre_revisions: number;
  nombre_succes: number;
  
}

export type ListeFiche = FicheRevision[];

export interface ListeUtilisateur {
  id: string;
  userId: string;
  type_liste_fiche: CharacterType;

  nombre_revisions: number;
  liste_fiche: ListeFiche;
}

export interface RevisionSession {
  characterType: CharacterType;
  mode: RevisionMode;
  difficulty: DifficultyLevel;
  characters: Kana[] | Kanji[];
  currentIndex: number;
}

export interface CharacterAnswer {
  characterId: string;
  correct: boolean;
  userAnswer: string;
  type?: CharacterType;
  difficulty?: DifficultyLevel;
}

export interface UserStatistics {
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
