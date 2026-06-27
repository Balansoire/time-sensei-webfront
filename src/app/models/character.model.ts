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
  id?: string;
  userId?: string;
  nombre_total_revisions?: number;
  totalAnswers?: number;
  correctAnswers?: number;
  accuracy?: number;
  stats: Record<string, number>;
}

export interface BackendUserStatistics {
  id?: string;
  user_id?: string;
  userId?: string;
  nombre_total_revisions?: number;
  stats?: Record<string, number>;
  totalAnswers?: number;
  correctAnswers?: number;
  accuracy?: number;
  byType?: Record<string, { correct: number; total: number }>;
  byDifficulty?: Record<string, { correct: number; total: number }>;
}
