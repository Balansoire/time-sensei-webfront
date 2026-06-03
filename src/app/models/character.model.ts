export type CharacterType = 'hiragana' | 'katakana' | 'kanji';
export type RevisionMode = 'recognition' | 'writing';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Kana {
  id: string;
  character: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
}
export interface Kanji {
  id: string;
  hiragana_l?: string;
  romaji_l: string;
  hiragana_c?: string;
  romaji_c?: string;
  character: string;
  signification?: string;
  type: 'kanji';
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
