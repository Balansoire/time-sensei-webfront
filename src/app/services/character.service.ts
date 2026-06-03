import { Injectable } from '@angular/core';
import { Kana, Kanji, CharacterType, DifficultyLevel } from '../models/character.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly hiraganaList: Kana[] = [
    { id: '1', character: 'あ', romaji: 'a', type: 'hiragana' },
    { id: '2', character: 'い', romaji: 'i', type: 'hiragana' },
    { id: '3', character: 'う', romaji: 'u', type: 'hiragana' },
    { id: '4', character: 'え', romaji: 'e', type: 'hiragana' },
    { id: '5', character: 'お', romaji: 'o', type: 'hiragana' },
    { id: '6', character: 'か', romaji: 'ka', type: 'hiragana' },
    { id: '7', character: 'き', romaji: 'ki', type: 'hiragana' },
    { id: '8', character: 'く', romaji: 'ku', type: 'hiragana' },
    { id: '9', character: 'け', romaji: 'ke', type: 'hiragana' },
    { id: '10', character: 'こ', romaji: 'ko', type: 'hiragana' }
  ];

  private readonly katakanaList: Kana[] = [
    { id: '11', character: 'ア', romaji: 'a', type: 'katakana' },
    { id: '12', character: 'イ', romaji: 'i', type: 'katakana' },
    { id: '13', character: 'ウ', romaji: 'u', type: 'katakana' },
    { id: '14', character: 'エ', romaji: 'e', type: 'katakana' },
    { id: '15', character: 'オ', romaji: 'o', type: 'katakana' },
    { id: '16', character: 'カ', romaji: 'ka', type: 'katakana' },
    { id: '17', character: 'キ', romaji: 'ki', type: 'katakana' },
    { id: '18', character: 'ク', romaji: 'ku', type: 'katakana' },
    { id: '19', character: 'ケ', romaji: 'ke', type: 'katakana' },
    { id: '20', character: 'コ', romaji: 'ko', type: 'katakana' }
  ];

  private readonly kanjiList: Kanji[] = [
    { id: '21', character: '一', romaji_l: 'ichi', signification: 'one', type: 'kanji' },
    { id: '22', character: '二', romaji_l: 'ni', signification: 'two', type: 'kanji' },
    { id: '23', character: '三', romaji_l: 'san', signification: 'three', type: 'kanji' },
    { id: '24', character: '四', romaji_l: 'shi', signification: 'four', type: 'kanji' },
    { id: '25', character: '五', romaji_l: 'go', signification: 'five', type: 'kanji' },
    { id: '26', character: '人', romaji_l: 'hito', signification: 'person', type: 'kanji' },
    { id: '27', character: '日', romaji_l: 'hi', signification: 'day', type: 'kanji' },
    { id: '28', character: '月', romaji_l: 'tsuki', signification: 'moon', type: 'kanji' },
    { id: '29', character: '火', romaji_l: 'hi', signification: 'fire', type: 'kanji' },
    { id: '30', character: '水', romaji_l: 'mizu', signification: 'water', type: 'kanji' }
  ];

  constructor() {}

  getCharacters(type: CharacterType, difficulty: DifficultyLevel): Observable<Kana[] | Kanji[]> {
    let characters: Kana[] | Kanji[] = [];

    switch (type) {
      case 'hiragana':
        characters = this.hiraganaList;
        break;
      case 'katakana':
        characters = this.katakanaList;
        break;
      case 'kanji':
        characters = this.kanjiList;
        break;
    }

    // Mélanger les caractères
    const shuffled = this.shuffleArray([...characters] as (Kana | Kanji)[]);
    return of(shuffled as Kana[] | Kanji[]).pipe(delay(300));
  }

  getAnswerOptions(character: Kana | Kanji, correctOptions: number = 4): string[] {
    const allCharacters = this.getAllCharactersOfType(character.type);
    const options = new Set<string>();
    options.add(this.getCharacterAnswer(character));

    while (options.size < correctOptions) {
      const randomChar = allCharacters[Math.floor(Math.random() * allCharacters.length)];
      options.add(this.getCharacterAnswer(randomChar));
    }

    return this.shuffleArray(Array.from(options));
  }

  private getCharacterAnswer(character: Kana | Kanji): string {
    return character.type === 'kanji' ? character.romaji_l : character.romaji;
  }

  private getAllCharactersOfType(type: CharacterType): Kana[] | Kanji[] {
    switch (type) {
      case 'hiragana':
        return this.hiraganaList;
      case 'katakana':
        return this.katakanaList;
      case 'kanji':
        return this.kanjiList;
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
